/**
 * dev-monitor.ts
 *
 * Wrapper script untuk menjalankan `next dev` dengan monitoring komprehensif.
 * Mendiagnosis unexpected exit (exit code 0 tanpa user stop).
 *
 * Cara pakai:
 *   bun run dev:monitor              — default (bun + turbopack)
 *   bun run dev:monitor:node         — tanpa bun runtime (pakai Node.js)
 *   bun run dev:monitor:noturbo      — tanpa turbopack
 *
 * Atau langsung:
 *   bun scripts/dev-monitor.ts [--no-bun] [--no-turbo]
 *
 * Output:
 * - Console: memory usage + inotify info setiap 5 detik
 * - logs/memory.log: full memory log history
 * - logs/crash-report.log: detail saat proses crash/exit
 * - logs/nextjs-output.log: SEMUA stdout/stderr dari Next.js (untuk lihat pesan terakhir)
 */

import { spawn } from "bun";
import { existsSync, mkdirSync, appendFileSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// === PARSE CLI FLAGS ===
const args = process.argv.slice(2);
const USE_BUN_RUNTIME = !args.includes("--no-bun");
const USE_TURBOPACK = !args.includes("--no-turbo");

// === CONFIG ===
const MONITOR_INTERVAL_MS = 5_000; // 5 detik
const WARNING_RSS_MB = 2_048; // 2GB - warning
const CRITICAL_RSS_MB = 3_072; // 3GB - critical
const LOG_DIR = join(import.meta.dir, "..", "logs");
const MEMORY_LOG = join(LOG_DIR, "memory.log");
const CRASH_LOG = join(LOG_DIR, "crash-report.log");
const NEXTJS_OUTPUT_LOG = join(LOG_DIR, "nextjs-output.log");

// === HELPERS ===

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
}

function ts(): string {
  return new Date().toISOString().replace("T", " ").replace("Z", "");
}

function log(msg: string, level: "INFO" | "WARN" | "CRIT" | "ERROR" = "INFO") {
  const line = `[${ts()}] [${level}] ${msg}`;
  console.log(line);
  appendFileSync(MEMORY_LOG, line + "\n");
}

function logCrash(msg: string) {
  const line = `[${ts()}] ${msg}`;
  console.error(line);
  appendFileSync(CRASH_LOG, line + "\n");
}

function logNextOutput(data: string) {
  appendFileSync(NEXTJS_OUTPUT_LOG, data);
}

function parseProcStatus(pid: number): { vmRSS: number; vmSize: number } | null {
  try {
    const status = readFileSync(`/proc/${pid}/status`, "utf-8");
    const vmRSSMatch = status.match(/VmRSS:\s+(\d+)\s+kB/);
    const vmSizeMatch = status.match(/VmSize:\s+(\d+)\s+kB/);
    return {
      vmRSS: vmRSSMatch ? parseInt(vmRSSMatch[1]) / 1024 : 0,
      vmSize: vmSizeMatch ? parseInt(vmSizeMatch[1]) / 1024 : 0,
    };
  } catch {
    return null;
  }
}

function getSystemMemory(): { total: number; available: number; used: number } | null {
  try {
    const meminfo = readFileSync("/proc/meminfo", "utf-8");
    const totalMatch = meminfo.match(/MemTotal:\s+(\d+)\s+kB/);
    const availMatch = meminfo.match(/MemAvailable:\s+(\d+)\s+kB/);
    if (!totalMatch || !availMatch) return null;
    const total = parseInt(totalMatch[1]) / 1024;
    const available = parseInt(availMatch[1]) / 1024;
    return { total, available, used: total - available };
  } catch {
    return null;
  }
}

function getChildPids(parentPid: number): number[] {
  try {
    const children = readFileSync(`/proc/${parentPid}/task/${parentPid}/children`, "utf-8").trim();
    if (!children) return [];
    return children.split(/\s+/).map(Number).filter(Boolean);
  } catch {
    return [];
  }
}

function getTotalTreeMemory(pid: number): number {
  let totalRSS = 0;
  const procInfo = parseProcStatus(pid);
  if (procInfo) totalRSS += procInfo.vmRSS;

  const children = getChildPids(pid);
  for (const childPid of children) {
    totalRSS += getTotalTreeMemory(childPid);
  }
  return totalRSS;
}

function getInotifyMaxWatches(): number {
  try {
    return parseInt(
      readFileSync("/proc/sys/fs/inotify/max_user_watches", "utf-8").trim()
    );
  } catch {
    return -1;
  }
}

async function checkDmesgForOOM(pid: number): Promise<string[]> {
  try {
    const proc = spawn({
      cmd: ["dmesg"],
      stdout: "pipe",
      stderr: "pipe",
    });
    const output = await new Response(proc.stdout).text();
    await proc.exited;

    const lines = output.split("\n").filter(
      (line) =>
        line.toLowerCase().includes("oom") ||
        line.toLowerCase().includes("killed process") ||
        line.toLowerCase().includes("out of memory")
    );
    return lines.slice(-10);
  } catch {
    return ["(Unable to read dmesg - may need sudo)"];
  }
}

function getLastNLines(filePath: string, n: number): string[] {
  try {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    return lines.slice(-n).filter(Boolean);
  } catch {
    return [];
  }
}

// === MAIN ===

async function main() {
  ensureLogDir();

  // Clear previous nextjs output log for this session
  writeFileSync(NEXTJS_OUTPUT_LOG, `=== Session started at ${ts()} ===\n`);

  const inotifyMax = getInotifyMaxWatches();

  // Build command
  const cmd: string[] = [];
  if (USE_BUN_RUNTIME) {
    cmd.push("bun", "--bun");
  } else {
    cmd.push("npx");
  }
  cmd.push("next", "dev");
  if (USE_TURBOPACK) {
    cmd.push("--turbopack");
  }

  const modeLabel = `${USE_BUN_RUNTIME ? "Bun" : "Node.js"} + ${USE_TURBOPACK ? "Turbopack" : "Webpack"}`;

  console.log("=".repeat(70));
  console.log(" Next.js Dev Server — Diagnostic Monitor v2");
  console.log("=".repeat(70));
  console.log(`  Mode:             ${modeLabel}`);
  console.log(`  Command:          ${cmd.join(" ")}`);
  console.log(`  Warning at:       ${WARNING_RSS_MB} MB RSS`);
  console.log(`  Critical at:      ${CRITICAL_RSS_MB} MB RSS`);
  console.log(`  Monitor interval: ${MONITOR_INTERVAL_MS / 1000}s`);
  console.log(`  Inotify limit:    ${inotifyMax}`);
  console.log(`  Memory log:       ${MEMORY_LOG}`);
  console.log(`  Crash log:        ${CRASH_LOG}`);
  console.log(`  Next.js output:   ${NEXTJS_OUTPUT_LOG}`);
  console.log("=".repeat(70));
  console.log("");

  log(`Starting Next.js dev server [${modeLabel}]...`);
  log(`Inotify max_user_watches: ${inotifyMax}`);

  if (inotifyMax > 0 && inotifyMax < 65536) {
    log(`WARNING: inotify limit is LOW (${inotifyMax}). This may cause file watcher failures!`, "WARN");
    log(`Fix: echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches`, "WARN");
  }

  const sysMem = getSystemMemory();
  if (sysMem) {
    log(
      `System memory: ${sysMem.total.toFixed(0)} MB total, ${sysMem.available.toFixed(0)} MB available, ${sysMem.used.toFixed(0)} MB used`
    );
  }

  // Spawn next dev — pipe stdout/stderr agar kita bisa log ke file
  const childProc = spawn({
    cmd,
    cwd: join(import.meta.dir, ".."),
    env: {
      ...process.env,
    },
    stdout: "pipe",
    stderr: "pipe",
  });

  const pid = childProc.pid;
  log(`Dev server started with PID: ${pid}`);

  // Stream stdout ke console DAN file
  const stdoutReader = (async () => {
    const reader = childProc.stdout.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        process.stdout.write(text);
        logNextOutput(text);
      }
    } catch {}
  })();

  // Stream stderr ke console DAN file
  const stderrReader = (async () => {
    const reader = childProc.stderr.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        process.stderr.write(text);
        logNextOutput(`[STDERR] ${text}`);
      }
    } catch {}
  })();

  let peakRSS = 0;
  let monitorCount = 0;
  let processAlive = true;
  const lastRSSValues: number[] = [];

  // Monitor loop
  const monitorInterval = setInterval(() => {
    if (!processAlive) {
      clearInterval(monitorInterval);
      return;
    }

    monitorCount++;
    const procMem = parseProcStatus(pid);
    const sysMem = getSystemMemory();

    if (!procMem) {
      log("Cannot read process memory — process may have exited", "WARN");
      clearInterval(monitorInterval);
      return;
    }

    const treeRSS = getTotalTreeMemory(pid);
    if (treeRSS > peakRSS) peakRSS = treeRSS;

    // Track RSS trend (last 12 samples = 1 minute)
    lastRSSValues.push(treeRSS);
    if (lastRSSValues.length > 12) lastRSSValues.shift();

    // Calculate RSS growth rate
    let trend = "";
    if (lastRSSValues.length >= 4) {
      const recent = lastRSSValues.slice(-4);
      const older = lastRSSValues.slice(0, 4);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
      const diff = recentAvg - olderAvg;
      if (diff > 50) trend = ` [GROWING +${diff.toFixed(0)}MB]`;
      else if (diff < -50) trend = ` [SHRINKING ${diff.toFixed(0)}MB]`;
      else trend = " [STABLE]";
    }

    let level: "INFO" | "WARN" | "CRIT" = "INFO";
    let suffix = "";
    if (treeRSS > CRITICAL_RSS_MB) {
      level = "CRIT";
      suffix = " !! CRITICAL";
    } else if (treeRSS > WARNING_RSS_MB) {
      level = "WARN";
      suffix = " ! HIGH";
    }

    const sysInfo = sysMem
      ? ` | Sys: ${sysMem.used.toFixed(0)}/${sysMem.total.toFixed(0)}MB (${((sysMem.used / sysMem.total) * 100).toFixed(1)}%)`
      : "";

    log(
      `[#${monitorCount}] RSS: ${treeRSS.toFixed(0)}MB (peak: ${peakRSS.toFixed(0)}MB) | VmSize: ${procMem.vmSize.toFixed(0)}MB${sysInfo}${trend}${suffix}`,
      level
    );
  }, MONITOR_INTERVAL_MS);

  // Wait for process to exit
  const exitCode = await childProc.exited;
  processAlive = false;
  clearInterval(monitorInterval);

  // Wait for stream readers to finish
  await Promise.allSettled([stdoutReader, stderrReader]);

  // === CRASH ANALYSIS ===
  console.log("");
  console.log("=".repeat(70));
  console.log(" PROCESS EXITED — DIAGNOSTIC REPORT");
  console.log("=".repeat(70));

  const exitSignal = exitCode === 137 ? "SIGKILL" : exitCode === 143 ? "SIGTERM" : null;

  logCrash("=".repeat(60));
  logCrash(`CRASH REPORT — ${ts()}`);
  logCrash(`Mode: ${modeLabel}`);
  logCrash("=".repeat(60));
  logCrash(`Exit code: ${exitCode}`);
  logCrash(`Signal: ${exitSignal ?? "none"}`);
  logCrash(`Peak RSS: ${peakRSS.toFixed(0)} MB`);
  logCrash(`Monitor samples: ${monitorCount}`);
  logCrash(`Uptime: ~${((monitorCount * MONITOR_INTERVAL_MS) / 1000 / 60).toFixed(1)} minutes`);
  logCrash(`Inotify max_user_watches: ${inotifyMax}`);

  // Last lines of Next.js output (crucial for diagnosis)
  const lastLines = getLastNLines(NEXTJS_OUTPUT_LOG, 30);
  logCrash("");
  logCrash("--- LAST 30 LINES OF NEXT.JS OUTPUT ---");
  for (const line of lastLines) {
    logCrash(`  ${line}`);
  }
  logCrash("--- END ---");

  if (exitCode === 137) {
    logCrash("");
    logCrash("!! EXIT CODE 137 (SIGKILL) — OOM kill by kernel!");
    const oomLines = await checkDmesgForOOM(pid);
    if (oomLines.length > 0) {
      logCrash("dmesg OOM entries:");
      for (const line of oomLines) {
        logCrash(`  ${line}`);
      }
    } else {
      logCrash("No OOM entries in dmesg (may need sudo)");
    }
  } else if (exitCode === 143) {
    logCrash("");
    logCrash("EXIT CODE 143 (SIGTERM) — Process terminated externally.");
    logCrash("Possible causes: systemd, another process, or resource limit.");
  } else if (exitCode === 0) {
    logCrash("");
    logCrash("!! EXIT CODE 0 — Process exited 'normally' but was NOT stopped by user.");
    logCrash("");
    logCrash("LIKELY CAUSES:");
    logCrash("  1. Turbopack internal error causing graceful shutdown");
    logCrash("  2. File watcher failure (inotify limit or event flood from auto-save)");
    logCrash("  3. Bun runtime incompatibility with Next.js internals");
    logCrash("  4. Unhandled promise rejection causing clean exit");
    logCrash("");
    logCrash("NEXT STEPS:");
    logCrash("  - Check the 'LAST 30 LINES' above for clues");
    logCrash("  - Try: bun run dev:monitor:node    (test without Bun runtime)");
    logCrash("  - Try: bun run dev:monitor:noturbo (test without Turbopack)");
    if (inotifyMax > 0 && inotifyMax < 524288) {
      logCrash(`  - Increase inotify limit (current: ${inotifyMax}):`);
      logCrash("      echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches");
    }
  } else {
    logCrash("");
    logCrash(`EXIT CODE ${exitCode} — Unexpected exit.`);
  }

  const finalSysMem = getSystemMemory();
  if (finalSysMem) {
    logCrash(
      `System memory at exit: ${finalSysMem.used.toFixed(0)}/${finalSysMem.total.toFixed(0)} MB (${finalSysMem.available.toFixed(0)} MB available)`
    );
  }

  logCrash("=".repeat(60));
  logCrash("");

  console.log("");
  console.log("  Log files:");
  console.log(`    Memory log:     ${MEMORY_LOG}`);
  console.log(`    Crash report:   ${CRASH_LOG}`);
  console.log(`    Next.js output: ${NEXTJS_OUTPUT_LOG}`);
  console.log("");
  console.log("  Tip: Check logs/nextjs-output.log for the last messages before exit.");
  console.log("");

  process.exit(exitCode);
}

main().catch((err) => {
  console.error("Monitor script error:", err);
  process.exit(1);
});
