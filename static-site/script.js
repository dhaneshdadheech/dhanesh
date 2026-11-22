/* Portfolio interactions. Plain JS, no dependencies. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL = "ddadheechdhanesh@gmail.com";

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Theme ---------- */
function setTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme");
  setTheme(cur === "dark" ? "light" : "dark");
}
$("#theme-toggle").addEventListener("click", toggleTheme);

/* ---------- Scroll: nav state, progress bar, back-to-top ---------- */
(function scrollEffects() {
  const nav = $("#nav"), bar = $("#progress-bar"), top = $("#to-top");
  let ticking = false;
  function update() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("scrolled", y > 8);
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    top.classList.toggle("show", y > 900);
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
  update();
})();

/* ---------- Active section highlighting ---------- */
(function activeLinks() {
  if (!("IntersectionObserver" in window)) return;
  const links = $$('.nav-links a, .mobile-menu a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => io.observe(s));
})();

/* ---------- Mobile menu ---------- */
(function mobileMenu() {
  const btn = $("#menu-btn"), menu = $("#mobile-menu"), nav = $("#nav");
  function set(open) {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("menu-open", open);
    if (open) nav.classList.add("scrolled");
  }
  btn.addEventListener("click", () => set(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { set(false); btn.focus(); } });
  document.addEventListener("click", (e) => { if (!menu.hidden && !nav.contains(e.target)) set(false); });
  window.addEventListener("resize", () => { if (window.innerWidth >= 1024 && !menu.hidden) set(false); });
})();

/* ---------- Reveal on scroll (+ staggering within a group) ---------- */
function observeReveals(root = document) {
  const els = $$(".reveal:not(.in)", root);
  const groups = new Map();
  els.forEach((el) => {
    const p = el.parentElement;
    const i = groups.get(p) || 0;
    el.style.setProperty("--d", Math.min(i, 6) * 80 + "ms");
    groups.set(p, i + 1);
  });
  if (!("IntersectionObserver" in window) || reducedMotion) { els.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => io.observe(el));
}

/* ---------- Count-up stats ---------- */
(function counters() {
  const nums = $$(".stat-num[data-count]");
  if (reducedMotion || !("IntersectionObserver" in window)) return;
  const run = (el) => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || "", dur = 1300, t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  nums.forEach((n) => io.observe(n));
})();

/* ---------- Typing animation ---------- */
(function typer() {
  const words = ["data stories", "BI dashboards", "ML models", "smarter decisions"];
  const el = $("#typer");
  if (reducedMotion) { el.textContent = words[0]; return; }
  let i = 0, n = 0, del = false;
  (function tick() {
    const w = words[i];
    let delay = del ? 40 : 80;
    if (!del && n < w.length) n++;
    else if (!del) { del = true; delay = 1500; }
    else if (n > 0) n--;
    else { del = false; i = (i + 1) % words.length; delay = 250; }
    el.textContent = w.slice(0, n);
    setTimeout(tick, delay);
  })();
})();

/* ---------- Emoji burst when the name is clicked ---------- */
(function popName() {
  const h1 = $("#name");
  const items = ["✨", "📊", "💡", "⭐", "🎉", "📈", "💛", "🚀"];
  h1.addEventListener("click", (ev) => {
    if (reducedMotion) return;
    const r = h1.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    for (let k = 0; k < 12; k++) {
      const a = (Math.PI * 2 * k) / 12;
      const s = document.createElement("span");
      s.className = "pop-item";
      s.textContent = items[k % items.length];
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(a) * 130 + "px");
      s.style.setProperty("--dy", Math.sin(a) * 130 + "px");
      h1.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  });
})();

/* ---------- Cursor spotlight on cards ---------- */
document.addEventListener("pointermove", (e) => {
  const card = e.target.closest && e.target.closest(".spot");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--x", e.clientX - r.left + "px");
  card.style.setProperty("--y", e.clientY - r.top + "px");
}, { passive: true });

/* ---------- Marquee: duplicate items for a seamless loop ---------- */
(function marquee() {
  const track = $("#marquee");
  $$("span", track).forEach((s) => {
    const c = s.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    track.appendChild(c);
  });
})();

/* ---------- Tableau dashboard cards ---------- */
(function dashboards() {
  const TABLEAU = "https://public.tableau.com/app/profile/dhanesh.dadheech1110";
  const list = [
    { title: "Localization Vendor Spend", wb: "APPLE_17942762656270", sheet: "LocalizationVendorSpendSyntheticData_" },
    { title: "By Country", wb: "Book2_17684839671070", sheet: "Bycountry" },
    { title: "Dashboard View", wb: "Book1_17632796544840", sheet: "Dashview" },
  ];
  const grid = $("#dash-grid");
  list.forEach((d) => {
    const a = document.createElement("a");
    a.className = "card spot dash reveal";
    a.href = `${TABLEAU}/viz/${d.wb}/${d.sheet}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `
      <div class="dash-img"><img src="https://public.tableau.com/static/images/${d.wb.slice(0, 2)}/${d.wb}/${d.sheet}/1.png" alt="${d.title} Tableau dashboard" loading="lazy" /></div>
      <div class="dash-body">
        <div><h3>${d.title}</h3><p class="muted small">View on Tableau Public</p></div>
        <span class="dash-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </div>`;
    grid.appendChild(a);
  });
})();

/* ---------- Skills: filter buttons + category cards ---------- */
(function skills() {
  const icons = {
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    scatter: '<path d="M3 3v18h18"/><circle cx="8" cy="14" r="1.5"/><circle cx="13" cy="9" r="1.5"/><circle cx="18" cy="12" r="1.5"/>',
    sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 16v5M16.5 18.5h5"/>',
    bars: '<path d="M4 20V10M10 20V4M16 20v-7M2 20h20"/>',
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4Z"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>',
    people: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M22 21a7 7 0 0 0-4-6.3"/>',
  };
  const groups = [
    { name: "Data Science & ML", icon: "scatter", skills: ["Machine Learning", "scikit-learn", "pandas", "NumPy", "Exploratory Data Analysis", "Data Cleaning", "Feature Engineering", "Classification", "Clustering", "Model Evaluation", "Time Series Forecasting", "Computer Vision (YOLO)", "NLP"] },
    { name: "AI & GenAI", icon: "sparkles", skills: ["Generative AI", "Conversational AI", "Prompt Engineering", "RAG", "LLM APIs", "AI Product Strategy"] },
    { name: "Statistics", icon: "bars", skills: ["Statistics", "Hypothesis Testing", "A/B Testing", "Regression Analysis", "Segmentation", "Anomaly Detection"] },
    { name: "Analytics & BI", icon: "dashboard", skills: ["Business Analytics", "Data Analysis", "Data Visualization", "Dashboards", "Tableau", "Power BI", "Microsoft Excel", "IBM SPSS", "MATLAB"] },
    { name: "Languages & Databases", icon: "code", skills: ["Python", "SQL", "R", "Java", "JavaScript", "PostgreSQL", "MySQL"] },
    { name: "Tools", icon: "wrench", skills: ["Jupyter", "Google Colab", "Git & GitHub", "Streamlit"] },
    { name: "Business & Marketing", icon: "briefcase", skills: ["Requirements Gathering", "KPI Design", "Product Analytics", "Stakeholder Management", "Marketing Analytics", "Google Analytics", "Marketing", "Sales", "Advertising", "Promotions"] },
    { name: "Strengths", icon: "people", skills: ["Leadership", "Communication", "Critical Thinking", "Decision-Making", "Problem Solving"] },
  ];
  const total = groups.reduce((n, g) => n + g.skills.length, 0);
  const filters = $("#skill-filters"), grid = $("#skill-grid");
  let active = "All";

  function render() {
    const shown = active === "All" ? groups : groups.filter((g) => g.name === active);
    grid.innerHTML = "";
    shown.forEach((g, i) => {
      const card = document.createElement("article");
      card.className = "card spot skill-card" + (shown.length === 1 ? " solo" : "");
      card.style.animationDelay = (reducedMotion ? 0 : i * 70) + "ms";
      card.innerHTML =
        `<div class="skill-card-head"><span class="skill-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[g.icon]}</svg></span>` +
        `<div><h3>${g.name}</h3><p class="count-label">${g.skills.length} skills</p></div></div>` +
        `<div class="skill-tags">${g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}</div>`;
      grid.appendChild(card);
    });
    $$("button", filters).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.name === active)));
  }

  [{ name: "All", n: total }, ...groups.map((g) => ({ name: g.name, n: g.skills.length }))].forEach(({ name, n }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "skill-filter";
    b.dataset.name = name;
    b.innerHTML = `${name}<span class="count">${n}</span>`;
    b.addEventListener("click", () => { active = name; render(); });
    filters.appendChild(b);
  });
  render();
})();

/* ---------- Copy email ---------- */
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = EMAIL; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e2) { /* ignore */ }
    ta.remove();
  }
  toast("Email copied to clipboard");
}
$("#copy-email").addEventListener("click", copyEmail);

/* ---------- Command palette (⌘K / Ctrl+K) ---------- */
(function palette() {
  const root = $("#palette"), input = $("#palette-input"), list = $("#palette-list");
  const go = (id) => () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); };
  const items = [
    { label: "About", group: "Section", run: go("about") },
    { label: "Education", group: "Section", run: go("education") },
    { label: "Experience", group: "Section", run: go("experience") },
    { label: "Projects", group: "Section", run: go("projects") },
    { label: "Dashboards", group: "Section", run: go("dashboards") },
    { label: "Skills", group: "Section", run: go("skills") },
    { label: "Contact", group: "Section", run: go("contact") },
    { label: "Send me a message", group: "Action", run: () => { go("contact")(); setTimeout(() => $("#f-name").focus({ preventScroll: true }), 500); } },
    { label: "Copy email address", group: "Action", run: copyEmail },
    { label: "Toggle light / dark mode", group: "Action", run: toggleTheme },
    { label: "Open Anteater Study Spots (live app)", group: "Project", run: () => window.open("https://uci-study-spots.onrender.com/", "_blank", "noopener") },
    { label: "Open LinkedIn", group: "Link", run: () => window.open("https://www.linkedin.com/in/dhaneshh/", "_blank", "noopener") },
    { label: "Open Tableau Public", group: "Link", run: () => window.open("https://public.tableau.com/app/profile/dhanesh.dadheech1110", "_blank", "noopener") },
  ];
  let shown = items, sel = 0, lastFocus = null;

  function render() {
    const q = input.value.trim().toLowerCase();
    shown = items.filter((it) => it.label.toLowerCase().includes(q) || it.group.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    list.innerHTML = shown.length
      ? shown.map((it, i) => `<li role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === sel}"><span>${it.label}</span><span class="group">${it.group}</span></li>`).join("")
      : `<li class="empty">No results</li>`;
    input.setAttribute("aria-activedescendant", shown.length ? "pal-" + sel : "");
    const cur = $("#pal-" + sel);
    if (cur) cur.scrollIntoView({ block: "nearest" });
  }
  function open() {
    lastFocus = document.activeElement;
    root.hidden = false; input.value = ""; sel = 0; render();
    requestAnimationFrame(() => input.focus());
  }
  function close() { root.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function exec(i) { const it = shown[i]; if (!it) return; close(); it.run(); }

  $("#open-palette").addEventListener("click", open);
  root.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) return close();
    const li = e.target.closest("li[data-i]");
    if (li) exec(+li.dataset.i);
  });
  list.addEventListener("mousemove", (e) => {
    const li = e.target.closest("li[data-i]");
    if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; $$("li[data-i]", list).forEach((x) => x.setAttribute("aria-selected", String(+x.dataset.i === sel))); }
  });
  input.addEventListener("input", () => { sel = 0; render(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(shown.length, 1); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(shown.length, 1); render(); }
    else if (e.key === "Enter") { e.preventDefault(); exec(sel); }
    else if (e.key === "Tab") { e.preventDefault(); }
  });
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); root.hidden ? open() : close(); }
    else if (e.key === "/" && !typing && root.hidden) { e.preventDefault(); open(); }
    else if (e.key === "Escape" && !root.hidden) { close(); }
  });
})();

/* ---------- Contact form ---------- */
// Messages are sent through FormSubmit (https://formsubmit.co), which emails them to the
// address below. No account needed; the first submission sends a one-time "Activate Form"
// email that must be clicked before messages are delivered.
const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/" + EMAIL;

(function contactForm() {
  const form = $("#contact-form");
  const status = $("#form-status");
  const button = $("button[type=submit]", form);
  const label = $(".btn-label", button);
  const setStatus = (msg, kind) => { status.textContent = msg; status.className = "form-status " + (kind || ""); };

  $$(".field input, .field textarea", form).forEach((f) =>
    f.addEventListener("input", () => f.closest(".field").classList.remove("invalid")));

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    let firstBad = null;
    $$(".field input, .field textarea", form).forEach((f) => {
      const bad = !f.checkValidity();
      f.closest(".field").classList.toggle("invalid", bad);
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) { setStatus("Please fill in your name, a valid email and a message.", "err"); firstBad.focus(); return; }

    const data = new FormData(form);
    if (data.get("_honey")) return; // spam bot
    data.append("_subject", "Portfolio message from " + data.get("name"));
    data.append("_template", "table");
    data.append("_captcha", "false");

    button.disabled = true;
    label.textContent = "Sending…";
    setStatus("");
    try {
      const res = await fetch(CONTACT_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => ({}));
      if (res.ok && String(json.success) === "true") {
        form.reset();
        setStatus("Thanks! Your message was sent. I’ll get back to you soon.", "ok");
        toast("Message sent ✓");
      } else {
        setStatus(`Sorry, the message couldn’t be sent right now. Please email me at ${EMAIL}.`, "err");
      }
    } catch (e) {
      setStatus(`Couldn’t send. Check your connection, or email me at ${EMAIL}.`, "err");
    } finally {
      button.disabled = false;
      label.textContent = "Send message";
    }
  });
})();

/* Start reveal animations last, after dynamic cards exist */
observeReveals();
