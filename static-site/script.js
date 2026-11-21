// Typing animation: "currently building ..."
(function typer() {
  const words = ["data stories", "BI dashboards", "ML models", "smarter decisions"];
  const el = document.getElementById("typer");
  let i = 0, n = 0, del = false;
  function tick() {
    const w = words[i];
    let delay = del ? 40 : 80;
    if (!del && n < w.length) n++;
    else if (!del) { del = true; delay = 1400; }
    else if (n > 0) n--;
    else { del = false; i = (i + 1) % words.length; }
    el.textContent = w.slice(0, n);
    setTimeout(tick, delay);
  }
  tick();
})();

// Emoji burst when the name is clicked
(function popName() {
  const h1 = document.getElementById("name");
  const items = ["✨", "📊", "💡", "⭐", "🎉", "📈", "💛", "🚀"];
  h1.addEventListener("click", (ev) => {
    const r = h1.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    for (let k = 0; k < 12; k++) {
      const a = (Math.PI * 2 * k) / 12;
      const s = document.createElement("span");
      s.className = "pop-item";
      s.textContent = items[k % items.length];
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(a) * 120 + "px");
      s.style.setProperty("--dy", Math.sin(a) * 120 + "px");
      h1.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  });
})();

// Tableau dashboard cards
(function dashboards() {
  const TABLEAU = "https://public.tableau.com/app/profile/dhanesh.dadheech1110";
  const list = [
    { title: "Localization Vendor Spend", wb: "APPLE_17942762656270", sheet: "LocalizationVendorSpendSyntheticData_" },
    { title: "By Country", wb: "Book2_17684839671070", sheet: "Bycountry" },
    { title: "Dashboard View", wb: "Book1_17632796544840", sheet: "Dashview" },
  ];
  const grid = document.getElementById("dash-grid");
  for (const d of list) {
    const a = document.createElement("a");
    a.className = "card dash";
    a.href = `${TABLEAU}/viz/${d.wb}/${d.sheet}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `
      <img src="https://public.tableau.com/static/images/${d.wb.slice(0, 2)}/${d.wb}/${d.sheet}/1.png" alt="${d.title} Tableau dashboard" loading="lazy" />
      <div class="dash-body">
        <h3>${d.title}</h3>
        <p class="muted small">View on Tableau Public ↗</p>
      </div>`;
    grid.appendChild(a);
  }
})();

// Skills: filter buttons + category cards
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

  const filters = document.getElementById("skill-filters");
  const grid = document.getElementById("skill-grid");
  let active = "All";

  function render() {
    const shown = active === "All" ? groups : groups.filter((g) => g.name === active);
    grid.innerHTML = "";
    shown.forEach((g, i) => {
      const card = document.createElement("article");
      card.className = "skill-card";
      // A lone card (or the last of an odd count) spans the full row, centred
      if (shown.length === 1 || (shown.length % 2 === 1 && i === shown.length - 1)) card.classList.add("span-all");
      card.style.animationDelay = i * 90 + "ms";
      card.innerHTML =
        `<h3>${g.name}</h3>` +
        `<span class="skill-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[g.icon]}</svg></span>` +
        `<div class="skill-tags">${g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}</div>`;
      grid.appendChild(card);
    });
    filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.name === active)));
  }

  ["All", ...groups.map((g) => g.name)].forEach((name) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "skill-filter";
    b.dataset.name = name;
    b.textContent = name;
    b.addEventListener("click", () => { active = name; render(); });
    filters.appendChild(b);
  });
  render();
})();

// Contact form
// Messages are sent through FormSubmit (https://formsubmit.co), which emails them to the
// address below. No account needed; the first submission sends a one-time "Activate Form"
// email that must be clicked before messages are delivered.
const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/ddadheechdhanesh@gmail.com";

(function contactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const button = form.querySelector("button");
  const setStatus = (msg, kind) => { status.textContent = msg; status.className = "form-status " + (kind || ""); };

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    if (data.get("_honey")) return; // spam bot

    data.append("_subject", "Portfolio message from " + data.get("name"));
    data.append("_template", "table");
    data.append("_captcha", "false");

    button.disabled = true;
    setStatus("Sending…");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && String(json.success) === "true") {
        form.reset();
        setStatus("Thanks! Your message was sent. I’ll get back to you soon.", "ok");
      } else {
        setStatus("Sorry, the message couldn’t be sent right now. Please email me at ddadheechdhanesh@gmail.com.", "err");
      }
    } catch {
      setStatus("Couldn’t send. Check your connection, or email me at ddadheechdhanesh@gmail.com.", "err");
    } finally {
      button.disabled = false;
    }
  });
})();
