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
