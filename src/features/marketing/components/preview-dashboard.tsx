import { BorderBeam } from "@/components/ui/border-beam";
import { Orbit } from "lucide-react";
import { statusItems } from "../constants/landing-data";

export function PreviewDashboard() {
  return (
    <div
      data-hero-reveal
      data-preview-section
      className="relative mx-auto mt-20 max-w-6xl "
    >
      {/* Subtle highlight gradient - top to middle */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60%] w-full -translate-x-1/2 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-4xl" />

      {/* Dark gradient - middle to bottom */}
      <div className="pointer-events-none absolute left-1/2 bottom-0 -z-10 h-[50%] w-full -translate-x-1/2 bg-gradient-to-t from-background via-background/50 to-transparent" />

      <div
        data-preview
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl mask-[linear-gradient(to_bottom,black_0%,black_40%,transparent_100%)]"
      >
        <BorderBeam
          size={250}
          duration={12}
          delay={9}
          colorFrom="#ffaa40"
          colorTo="#9c40ff"
          borderWidth={2}
        />
        <div className="rounded-3xl border border-white/10 bg-background/90">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-white/20" />
              <span className="size-3 rounded-full bg-white/20" />
              <span className="size-3 rounded-full bg-white/20" />
            </div>
            <p className="text-xs text-muted-foreground">
              dashboard / overview
            </p>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 lg:block">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-white/[0.06]">
                  <Orbit className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Lamarin</p>
                  <p className="text-xs text-muted-foreground">
                    Job application workspace
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  "Overview",
                  "Applications",
                  "Send Email",
                  "Follow-ups",
                  "Settings",
                ].map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-xl px-3 py-2 text-sm ${index === 0
                      ? "bg-white/[0.08] text-foreground"
                      : "text-muted-foreground"
                      }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Total applications", "24"],
                  ["Need follow-up", "5"],
                  ["Upcoming events", "3"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                  >
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-3 text-3xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Application activity</p>
                      <p className="text-sm text-muted-foreground">
                        Weekly application trend
                      </p>
                    </div>
                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-muted-foreground">
                      7 days
                    </span>
                  </div>

                  <div className="flex h-52 items-end gap-2">
                    {[42, 58, 35, 72, 52, 88, 66].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-xl bg-foreground/20"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="font-medium">Status orbit</p>
                  <div className="mt-5 space-y-3">
                    {statusItems.map((status, index) => (
                      <div
                        key={status}
                        className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2"
                      >
                        <span className="text-sm text-muted-foreground">
                          {status}
                        </span>
                        <span className="text-sm font-medium">
                          {index === 0
                            ? "8"
                            : index === 2
                              ? "3"
                              : index === 4
                                ? "1"
                                : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
