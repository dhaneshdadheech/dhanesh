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
