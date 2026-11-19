import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dhanesh Dadheech — Business Analytics" },
      { name: "description", content: "Dhanesh Dadheech: MS Business Analytics at UC Irvine. Data, dashboards, and machine learning." },
      { property: "og:title", content: "Dhanesh Dadheech — Business Analytics" },
      { property: "og:description", content: "MS Business Analytics at UC Irvine. Data, dashboards, and machine learning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const words = ["data stories", "BI dashboards", "ML models", "smarter decisions"];

function Typer() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i] ?? "";
    const t = setTimeout(() => {
      if (!del && n < w.length) setN(n + 1);
      else if (!del) setDel(true);
      else if (n > 0) setN(n - 1);
      else { setDel(false); setI((i + 1) % words.length); }
    }, !del && n === w.length ? 1400 : del ? 40 : 80);
    return () => clearTimeout(t);
  }, [n, del, i]);
  return <span className="text-primary">{(words[i] ?? "").slice(0, n)}<span className="caret" /></span>;
}

function PopName() {
  const [pops, setPops] = useState<{ id: number; x: number; y: number; e: string; dx: number; dy: number }[]>([]);
  const items = ["✨", "📊", "💡", "⭐", "🎉", "📈", "💛", "🚀"];
  const burst = (ev: React.MouseEvent<HTMLHeadingElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top, base = Date.now();
    const next = Array.from({ length: 12 }, (_, k) => {
      const a = (Math.PI * 2 * k) / 12;
      return { id: base + k, x, y, e: items[k % items.length] ?? "✨", dx: Math.cos(a) * 120, dy: Math.sin(a) * 120 };
    });
    setPops((p) => [...p, ...next]);
    setTimeout(() => setPops((p) => p.filter((q) => q.id < base || q.id > base + 11)), 1000);
  };
  return (
    <h1 onClick={burst} title="Click me!" className="relative mt-2 cursor-pointer select-none text-6xl leading-none md:text-8xl">
      <span className="name-gradient">Dhanesh Dadheech</span>
      {pops.map((p) => (
        <span key={p.id} className="pop-item" style={{ left: p.x, top: p.y, ["--dx" as string]: `${p.dx}px`, ["--dy" as string]: `${p.dy}px` }}>{p.e}</span>
      ))}
    </h1>
  );
}

const dashboards = [
  { title: "Localization Vendor Spend", wb: "APPLE_17942762656270", sheet: "LocalizationVendorSpendSyntheticData_" },
  { title: "By Country", wb: "Book2_17684839671070", sheet: "Bycountry" },
  { title: "Dashboard View", wb: "Book1_17632796544840", sheet: "Dashview" },
];
const TABLEAU = "https://public.tableau.com/app/profile/dhanesh.dadheech1110";

const stats = [
  ["92%", "Detection accuracy (YOLO)"],
  ["15%", "Engagement lift delivered"],
  ["3+", "Case studies led"],
  ["4", "Person team led"],
];

const experience = [
  {
    org: "UCI Dining, University of California, Irvine", role: "Marketing Associate (Part-time)", when: "Sep 2026 – Oct 2026", where: "Irvine, CA",
    points: ["Advised students on meal plan options, supporting sales and engagement", "Maintained pricing accuracy and supported social media and mobile ordering promotion"],
  },
  {
    org: "NextLeap", role: "Business Analyst Fellowship", when: "Aug 2025 – Nov 2025", where: "Remote",
    points: ["Analyzed large datasets with SQL, Excel and Tableau to find growth opportunities", "Built interactive BI dashboards tracking adoption and growth KPIs", "Data-driven recommendations improved simulated product engagement by 15%", "Led 3+ case studies from requirements to stakeholder insights"],
  },
];

const skills: [string, string[]][] = [
  ["Programming", ["Python (pandas, scikit-learn)", "R", "SQL", "Java"]],
  ["Analytics & BI", ["Data Analysis", "Data Visualization", "Dashboards", "Statistics", "Tableau", "Excel", "SPSS", "MATLAB"]],
  ["AI & ML", ["Machine Learning", "Generative AI"]],
];

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative z-0 mx-auto max-w-5xl px-6 py-20">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-4xl md:text-5xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Index() {
  return (
    <main>
      <nav className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#" className="font-display text-xl">Dhanesh<span className="text-primary">.</span></a>
          <div className="hidden gap-6 text-sm text-muted-foreground sm:flex">
            {["about", "experience", "projects", "dashboards", "skills", "contact"].map((s) => (
              <a key={s} href={`#${s}`} className="capitalize hover:text-foreground">{s}</a>
            ))}
          </div>
        </div>
      </nav>

      <header className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center px-6">
        <p className="text-lg text-muted-foreground">Hello, I’m</p>
        <PopName />
        <p className="mt-6 text-lg text-muted-foreground">
          Business Analytics <span className="text-primary">|</span> Data <span className="text-primary">|</span> Machine Learning <span className="text-primary">|</span> Team Lead
        </p>
        <p className="mt-4 text-2xl md:text-3xl font-display">currently building <Typer /></p>
        <a href="#about" className="mt-10 inline-flex w-fit rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground transition hover:bg-primary">Meet me ↓</a>
      </header>

      <Section id="about" eyebrow="About me" title="Hey there! 👋">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>I’m a Master of Science in Business Analytics student at UC Irvine’s Paul Merage School of Business, with a computer science background from Techno India University.</p>
            <p>I love turning messy data into clear dashboards and decisions, and I’ve led teams building real-time machine learning systems.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(([n, l]) => (
              <div key={l} className="rounded-xl border bg-card p-6">
                <p className="font-display text-4xl text-primary">{n}</p>
                <p className="mt-2 text-sm text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="bg-ink text-ink-foreground">
        <Section id="experience" eyebrow="Experience" title="Where I’ve worked.">
          <div className="space-y-6">
            {experience.map((e) => (
              <article key={e.org} className="rounded-xl border border-ink-foreground/15 p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl">{e.role}</h3>
                  <span className="text-sm opacity-70">{e.when}</span>
                </div>
                <p className="mt-1 text-primary">{e.org} · {e.where}</p>
                <ul className="mt-4 space-y-2 opacity-85">
                  {e.points.map((p) => <li key={p}>— {p}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </Section>
      </div>

      <Section id="projects" eyebrow="Projects" title="Things I’ve built.">
        <article className="rounded-xl border bg-card p-8 md:p-12">
          <p className="eyebrow">Computer Vision · Team Lead</p>
          <h3 className="mt-3 text-3xl">Real-Time Weapon Detection System</h3>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Led a team of 4 to design and deploy a real-time object detection system using YOLO, reaching 92% detection accuracy. Owned the full workflow: dataset preparation, training, testing and deployment.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["YOLO", "Python", "Object Detection", "Deployment"].map((t) => (
              <span key={t} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">{t}</span>
            ))}
          </div>
        </article>
      </Section>

      <Section id="dashboards" eyebrow="Tableau Public" title="Dashboards I’ve built.">
        <div className="grid gap-6 md:grid-cols-3">
          {dashboards.map((d) => (
            <a key={d.wb} href={`${TABLEAU}/viz/${d.wb}/${d.sheet}`} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-xl border bg-card transition hover:-translate-y-1 hover:shadow-lg">
              <img src={`https://public.tableau.com/static/images/${d.wb.slice(0, 2)}/${d.wb}/${d.sheet}/1.png`} alt={`${d.title} Tableau dashboard`} loading="lazy" className="aspect-[4/3] w-full bg-secondary object-cover" />
              <div className="p-5">
                <h3 className="text-xl group-hover:text-primary">{d.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">View on Tableau Public ↗</p>
              </div>
            </a>
          ))}
        </div>
        <a href={`${TABLEAU}/vizzes`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full border px-6 py-3 font-semibold hover:bg-secondary">See all dashboards ↗</a>
      </Section>

      <Section id="skills" eyebrow="Toolkit" title="Skills & education.">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            {skills.map(([g, list]) => (
              <div key={g}>
                <p className="font-semibold">{g}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {list.map((s) => <span key={s} className="rounded-full border px-3 py-1 text-sm">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-secondary p-6">
              <p className="text-sm text-muted-foreground">Aug 2026 – Expected 2027</p>
              <h3 className="mt-1 text-xl">MS Business Analytics</h3>
              <p className="text-muted-foreground">UC Irvine, Paul Merage School of Business</p>
            </div>
            <div className="rounded-xl bg-secondary p-6">
              <p className="text-sm text-muted-foreground">2021 – 2025</p>
              <h3 className="mt-1 text-xl">B.Tech Computer Science</h3>
              <p className="text-muted-foreground">Techno India University</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="contact" eyebrow="Say hello" title="Let’s talk data.">
        <div className="flex flex-wrap gap-3">
          <a href="mailto:ddadheechdhanesh@gmail.com" target="_top" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">ddadheechdhanesh@gmail.com</a>
          <a href="https://www.linkedin.com/in/dhaneshh/" target="_blank" rel="noopener noreferrer" className="rounded-full border px-6 py-3 font-semibold hover:bg-secondary">LinkedIn ↗</a>
        </div>
        <p className="mt-6 text-muted-foreground">Based in Irvine, CA</p>
      </Section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 Dhanesh Dadheech</footer>
    </main>
  );
}
