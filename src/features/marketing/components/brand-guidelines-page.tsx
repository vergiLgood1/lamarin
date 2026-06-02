import { LamarinLogo } from "@/components/lamarin-logo";
import { Particles } from "@/components/ui/particles";
import Link from "next/link";
import type { ReactNode } from "react";

const brandValues = [
  {
    title: "Honest",
    description:
      "Tidak menjanjikan hasil hiring, interview rate, atau keberhasilan rekrutmen yang tidak bisa dibuktikan.",
  },
  {
    title: "Organized",
    description:
      "Membantu pengguna melihat lamaran, status, dokumen, follow-up, dan jadwal dalam satu alur yang rapi.",
  },
  {
    title: "Human-first",
    description:
      "AI membantu membuat draft, tetapi pengguna tetap membaca, mengedit, dan mengambil keputusan akhir.",
  },
  {
    title: "Practical",
    description:
      "Fokus pada workflow nyata job seeker, bukan dekorasi atau fitur yang tidak membantu proses lamaran.",
  },
  {
    title: "Calm",
    description:
      "Mengurangi beban mental dengan interface yang jelas, tidak ramai, dan mudah ditindaklanjuti.",
  },
];

const colorTokens = [
  {
    name: "Orbit Blue",
    role: "Primary accent",
    hex: "#1E86FF",
    rgb: "30, 134, 255",
    cmyk: "88, 47, 0, 0",
    pantone: "PMS 285 C",
  },
  {
    name: "Deep Space",
    role: "Primary background",
    hex: "#09090B",
    rgb: "9, 9, 11",
    cmyk: "18, 18, 0, 96",
    pantone: "Black 6 C",
  },
  {
    name: "Glass Surface",
    role: "Cards and panels",
    hex: "#18181B",
    rgb: "24, 24, 27",
    cmyk: "11, 11, 0, 89",
    pantone: "PMS Black 7 C",
  },
  {
    name: "Soft White",
    role: "Primary text",
    hex: "#FAFAFA",
    rgb: "250, 250, 250",
    cmyk: "0, 0, 0, 2",
    pantone: "PMS 663 C",
  },
  {
    name: "Muted Grey",
    role: "Secondary text",
    hex: "#A1A1AA",
    rgb: "161, 161, 170",
    cmyk: "5, 5, 0, 33",
    pantone: "PMS Cool Gray 6 C",
  },
];

const typography = [
  {
    label: "Display / H1",
    font: "Geist Sans",
    size: "48-72px",
    weight: "600",
    usage: "Hero headlines and major brand moments.",
  },
  {
    label: "Heading / H2-H3",
    font: "Geist Sans",
    size: "28-48px",
    weight: "600",
    usage: "Section titles, cards, and content hierarchy.",
  },
  {
    label: "Body",
    font: "Geist Sans",
    size: "16-18px",
    weight: "400",
    usage: "Paragraphs, descriptions, and supporting copy.",
  },
  {
    label: "Label / Caption",
    font: "Geist Sans",
    size: "12-14px",
    weight: "500-600",
    usage: "Badges, buttons, metadata, and compact UI labels.",
  },
  {
    label: "Code / Technical",
    font: "Geist Mono",
    size: "12-14px",
    weight: "400",
    usage: "Color tokens, technical values, and developer-facing notes.",
  },
];

const logoDos = [
  "Gunakan logo pada background gelap atau terang dengan kontras yang cukup.",
  "Jaga proporsi asli logo dan wordmark.",
  "Berikan clear space yang lapang di sekitar logo.",
  "Gunakan versi icon untuk favicon, avatar, atau area sempit.",
];

const logoDonts = [
  "Jangan menarik, memiringkan, atau mendistorsi logo.",
  "Jangan mengubah warna logo sembarangan di luar palet brand.",
  "Jangan menaruh logo di background yang terlalu ramai.",
  "Jangan menambahkan shadow, outline, atau efek dekoratif berlebihan.",
];

function SectionHeader({ eyebrow, title, description }: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-pretty leading-8 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function GuidelineCard({ title, children }: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-4 text-sm leading-7 text-muted-foreground">{children}</div>
    </article>
  );
}

export function BrandGuidelinesPage() {
  return (
    <main className="dark min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative isolate px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_50%_15%,hsl(var(--primary)/0.22),transparent_36%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]" />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[64px_64px] opacity-20 mask-[radial-gradient(circle_at_top,black,transparent_70%)]" />
        <Particles
          className="absolute inset-0 -z-10"
          quantity={80}
          ease={80}
          color="#ffffff"
          refresh={false}
        />

        <div className="mx-auto max-w-6xl">
          <nav className="mb-16 flex items-center justify-between rounded-full border border-white/10 bg-background/75 px-4 py-3 backdrop-blur-2xl">
            <Link href="/" className="flex items-center gap-2">
              <LamarinLogo className="size-9 text-foreground" />
              <span className="text-sm font-semibold tracking-wide">Lamarin</span>
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Back to home
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
                Brand Guidelines
              </p>
              <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
                Lamarin brand identity system.
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
                Panduan ringkas untuk menjaga identitas Lamarin tetap konsisten: dari fondasi merek, logo, warna, sampai tipografi.
              </p>
            </div>
            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex min-h-64 items-center justify-center rounded-[2rem] border border-white/10 bg-background/70">
                <div className="text-center">
                  <LamarinLogo className="mx-auto size-24 text-foreground" />
                  <p className="mt-5 text-2xl font-semibold tracking-tight">Lamarin</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Keep every job application in orbit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="01. Brand Identity"
            title="Fondasi merek sebelum masuk ke desain."
            description="Lamarin adalah workspace karier yang membantu job seeker menjaga proses lamaran tetap terlihat, teratur, dan mudah ditindaklanjuti."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <GuidelineCard title="Visi">
              Membantu job seeker mengelola banyak lamaran kerja tanpa kehilangan konteks penting seperti status, dokumen, kontak HR, follow-up, dan jadwal.
            </GuidelineCard>
            <GuidelineCard title="Misi">
              Menyediakan workspace praktis untuk mencatat lamaran, mengelola status, menyiapkan follow-up, menyimpan dokumen, menjaga jadwal, dan mengirim reminder melalui tools yang sudah digunakan pengguna.
            </GuidelineCard>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {brandValues.map((value) => (
              <GuidelineCard key={value.title} title={value.title}>
                {value.description}
              </GuidelineCard>
            ))}
          </div>

          <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold tracking-tight">Brand Persona / Personality</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {["Professional", "Calm", "Organized", "Supportive", "Practical", "Honest", "Focused"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="02. Visual Identity"
            title="Panduan desain agar eksekusi visual tetap konsisten."
            description="Identitas visual Lamarin menggunakan arah cinematic dark orbit, glass-like cards, kontras lembut, dan aksen biru yang terasa fokus dan modern."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <GuidelineCard title="Logo utama dan alternatif">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-background/70 p-5 text-center">
                  <LamarinLogo className="mx-auto size-20 text-foreground" />
                  <p className="mt-4 font-medium text-foreground">Icon mark</p>
                  <p className="mt-1 text-xs">Untuk favicon, avatar, dan area kecil.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/70 p-5 text-center">
                  <div className="flex items-center justify-center gap-3 py-6">
                    <LamarinLogo className="size-12 text-foreground" />
                    <span className="text-2xl font-semibold tracking-tight text-foreground">Lamarin</span>
                  </div>
                  <p className="font-medium text-foreground">Wordmark lockup</p>
                  <p className="mt-1 text-xs">Untuk header, footer, dan dokumen brand.</p>
                </div>
              </div>
            </GuidelineCard>

            <div className="grid gap-5 md:grid-cols-2">
              <GuidelineCard title="Clear Space">
                Gunakan jarak aman minimal sebesar tinggi huruf L dari wordmark di setiap sisi logo. Jangan biarkan elemen lain terlalu dekat dengan logo.
              </GuidelineCard>
              <GuidelineCard title="Ukuran Minimal">
                Digital wordmark minimal 120px lebar. Icon mark minimal 32px. Untuk ukuran di bawah itu, gunakan icon mark tanpa wordmark.
              </GuidelineCard>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <GuidelineCard title="Logo Do's">
              <ul className="space-y-3">
                {logoDos.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </GuidelineCard>
            <GuidelineCard title="Logo Don'ts">
              <ul className="space-y-3">
                {logoDonts.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </GuidelineCard>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Color Palette"
            title="Palet warna resmi untuk digital dan referensi cetak."
            description="Gunakan warna ini sebagai dasar. Nilai CMYK dan Pantone bersifat approximate dan perlu proofing ulang untuk kebutuhan produksi cetak final."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {colorTokens.map((color) => (
              <article key={color.name} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl">
                <div className="h-28" style={{ backgroundColor: color.hex }} />
                <div className="space-y-2 p-5 text-sm text-muted-foreground">
                  <h3 className="text-base font-semibold text-foreground">{color.name}</h3>
                  <p>{color.role}</p>
                  <p className="font-mono">HEX {color.hex}</p>
                  <p className="font-mono">RGB {color.rgb}</p>
                  <p className="font-mono">CMYK {color.cmyk}</p>
                  <p className="font-mono">{color.pantone}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Typography"
            title="Tipografi yang jelas, modern, dan mudah dibaca."
            description="Lamarin menggunakan Geist sebagai font utama untuk interface dan komunikasi brand, dengan Geist Mono untuk token teknis atau detail developer-facing."
          />
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl">
            {typography.map((item) => (
              <div key={item.label} className="grid gap-4 border-b border-white/10 p-6 last:border-b-0 md:grid-cols-[0.8fr_1fr_1fr] md:items-center">
                <div>
                  <p className="text-lg font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.font}</p>
                </div>
                <div className="font-mono text-sm text-muted-foreground">
                  {item.size} / Weight {item.weight}
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{item.usage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
