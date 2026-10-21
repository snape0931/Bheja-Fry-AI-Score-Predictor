// ============================================================
//  The ONLY file you need to edit before deploying.
//  Put the URL of your FastAPI backend here (no trailing slash).
//
//  Local development : "http://127.0.0.1:8000"
//  After deploying   : "https://your-backend-name.onrender.com"
// ============================================================
window.APP_CONFIG = {
  API_BASE_URL: "http://127.0.0.1:2200",
  REQUEST_TIMEOUT_MS: 60000, // Render free tier can take ~50s to wake up
};

/* MindMetrics frontend – talks to the FastAPI backend (POST /predict, GET /) */
(function () {
  "use strict";

  const API = (window.APP_CONFIG.API_BASE_URL || "").replace(/\/+$/, "");
  const TIMEOUT = window.APP_CONFIG.REQUEST_TIMEOUT_MS || 60000;

  const $ = (id) => document.getElementById(id);
  const form = $("predictForm");
  const submitBtn = $("submitBtn");
  const alertBox = $("formAlert");

  // Field rules mirror the Pydantic model in main.py
  const NUMBER_FIELDS = {
    age:                     { label: "Age",                     min: 10, max: 100, integer: true },
    avg_daily_usage_hours:   { label: "Daily usage hours",       min: 0,  max: 24 },
    daily_unlocks:           { label: "Daily unlocks",           min: 0,  integer: true },
    study_hours:             { label: "Study hours",             min: 0,  max: 24 },
    physical_activity_hours: { label: "Physical activity hours", min: 0,  max: 24 },
    sleep_hours_per_night:   { label: "Sleep hours",             min: 0,  max: 24 },
  };
  const SELECT_FIELDS = ["gender", "country", "academic_level", "most_used_platform", "purpose_of_use", "stress_level"];

  /* ---------- Navbar ---------- */
  const navToggle = $("navToggle"), navLinks = $("navLinks");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open);
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { navLinks.classList.remove("open"); navToggle.classList.remove("open"); }
  });
  window.addEventListener("scroll", () => $("navbar").classList.toggle("scrolled", window.scrollY > 20), { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 })
    : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  /* ---------- API status pill ---------- */
  async function checkApi() {
    const pill = $("apiStatus"), label = pill.querySelector("b");
    try {
      const res = await fetchWithTimeout(API + "/", { method: "GET" }, 45000);
      if (!res.ok) throw new Error();
      pill.className = "api-status online"; label.textContent = "API online";
    } catch {
      pill.className = "api-status offline"; label.textContent = "API offline";
    }
  }
  checkApi();

  /* ---------- Helpers ---------- */
  function fetchWithTimeout(url, options, ms) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(t));
  }

  function setFieldError(name, msg) {
    const field = $(name).closest(".field");
    field.classList.toggle("invalid", !!msg);
    field.querySelector(".err").textContent = msg || "";
  }

  function showAlert(msg, type) {
    alertBox.textContent = msg;
    alertBox.className = "form-alert" + (type ? " " + type : "");
    alertBox.hidden = !msg;
  }

  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle("loading", on);
    submitBtn.querySelector(".btn-label").textContent = on ? "Analyzing…" : "Predict my score";
  }

  /* ---------- Validation ---------- */
  function validate() {
    let ok = true, firstBad = null;
    const payload = {};

    for (const [name, r] of Object.entries(NUMBER_FIELDS)) {
      const raw = $(name).value.trim();
      let msg = "";
      const num = Number(raw);
      if (raw === "" || Number.isNaN(num)) msg = "Please enter a number.";
      else if (r.integer && !Number.isInteger(num)) msg = "Must be a whole number.";
      else if (num < r.min) msg = `Must be at least ${r.min}.`;
      else if (r.max !== undefined && num > r.max) msg = `Must be at most ${r.max}.`;
      setFieldError(name, msg);
      if (msg) { ok = false; firstBad = firstBad || $(name); } else payload[name] = num;
    }
    for (const name of SELECT_FIELDS) {
      const val = $(name).value;
      setFieldError(name, val ? "" : "Please choose an option.");
      if (!val) { ok = false; firstBad = firstBad || $(name); } else payload[name] = val;
    }
    if (firstBad) firstBad.focus();
    return ok ? payload : null;
  }

  // clear an error as soon as the user edits the field
  form.addEventListener("input", (e) => { if (e.target.id) setFieldError(e.target.id, ""); });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showAlert("");
    const payload = validate();
    if (!payload) return;

    setLoading(true);
    const slowTimer = setTimeout(() => showAlert("The server is waking up (free hosting can take up to a minute). Please wait…", "info"), 6000);

    try {
      const res = await fetchWithTimeout(API + "/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }, TIMEOUT);

      if (!res.ok) throw await apiError(res);

      const data = await res.json();
      const score = data.predicted_mental_health_score;
      if (typeof score !== "number" || Number.isNaN(score)) throw new Error("The API returned an unexpected response.");

      showAlert("");
      renderResults(score, payload);
    } catch (err) {
      if (err.name === "AbortError") showAlert("The request timed out. The server may be starting up – please try again in a moment.");
      else if (err instanceof TypeError) showAlert("Could not reach the backend. Check that it is running and that API_BASE_URL in js/config.js is correct.");
      else showAlert(err.message || "Something went wrong. Please try again.");
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
    }
  });

  // Turn FastAPI error bodies (422 validation, 500) into readable messages
  async function apiError(res) {
    let detail = "";
    try {
      const body = await res.json();
      if (Array.isArray(body.detail)) {
        detail = body.detail.map((d) => `${(d.loc || []).slice(1).join(".")}: ${d.msg}`).join("; ");
      } else if (typeof body.detail === "string") detail = body.detail;
    } catch { /* body wasn't JSON */ }
    if (res.status === 422) return new Error("The server rejected some inputs – " + (detail || "please check your values."));
    if (res.status >= 500) return new Error("The model failed to produce a prediction (server error " + res.status + "). " + detail);
    return new Error(`Request failed (${res.status}). ${detail}`);
  }

  /* ---------- Results dashboard ---------- */
  // Assumption: score is on a 0–10 scale, higher = better (6.77 in your main.py comment).
  const MAX_SCORE = 10;

  function renderResults(score, p) {
    const section = $("results");
    section.hidden = false;

    // gauge
    const pct = Math.max(0, Math.min(100, (score / MAX_SCORE) * 100));
    const fill = $("gaugeFill");
    fill.setAttribute("stroke-dasharray", "0 100");
    requestAnimationFrame(() => requestAnimationFrame(() => fill.setAttribute("stroke-dasharray", `${pct} 100`)));
    countUp($("scoreValue"), score, 1600);

    // badge
    const badge = $("scoreBadge"), note = $("scoreNote");
    let cls, text, msg;
    if (score >= 7)      { cls = "good"; text = "Healthy range";    msg = "The model predicts a relatively strong mental health score for this profile."; }
    else if (score >= 5) { cls = "mid";  text = "Moderate range";   msg = "The model predicts a middling score – small habit changes could help."; }
    else                 { cls = "low";  text = "Needs attention";  msg = "The model predicts a lower score for this profile. Consider the suggestions below."; }
    badge.className = "badge " + cls; badge.textContent = text; note.textContent = msg;

    renderBars(p);
    renderSummary(p);
    renderInsights(p);

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function countUp(el, target, ms) {
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / ms);
      el.textContent = (target * (1 - Math.pow(1 - t, 3))).toFixed(2);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(2);
    })(start);
  }

  function renderBars(p) {
    // [label, value, reference/max for the bar, display text, is "too much" metric?, warn threshold]
    const rows = [
      ["Sleep",             p.sleep_hours_per_night,   8,   `${p.sleep_hours_per_night} h / 8 h goal`,        false],
      ["Physical activity", p.physical_activity_hours, 1,   `${p.physical_activity_hours} h / 1 h goal`,      false],
      ["Study time",        p.study_hours,             6,   `${p.study_hours} h (scale to 6 h)`,              false],
      ["Social media use",  p.avg_daily_usage_hours,   8,   `${p.avg_daily_usage_hours} h (scale to 8 h)`,    true, 5],
      ["Phone unlocks",     p.daily_unlocks,           150, `${p.daily_unlocks} / day (scale to 150)`,        true, 100],
    ];
    $("bars").innerHTML = rows.map(([label, val, ref, text, inverse, warnAt]) => {
      const w = Math.min(100, (val / ref) * 100);
      const warn = inverse && val > warnAt ? " warn" : "";
      return `<div class="bar-row"><div class="bar-head"><span>${label}</span><span>${text}</span></div><div class="bar"><i class="${warn.trim()}" data-w="${w}"></i></div></div>`;
    }).join("");
    requestAnimationFrame(() => requestAnimationFrame(() =>
      document.querySelectorAll("#bars .bar i").forEach((i) => (i.style.width = i.dataset.w + "%"))));
  }

  function renderSummary(p) {
    const items = [
      ["Age", p.age], ["Gender", p.gender], ["Country", p.country], ["Level", p.academic_level],
      ["Platform", p.most_used_platform], ["Purpose", p.purpose_of_use], ["Stress", p.stress_level],
    ];
    $("summary").innerHTML = items.map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHtml(String(v))}</dd></div>`).join("");
  }

  // Simple rule-based tips from the user's own inputs (not model output)
  function renderInsights(p) {
    const list = [];
    const add = (type, title, text) => list.push({ type, title, text });

    if (p.sleep_hours_per_night < 6) add("bad", "😴 Low sleep", `You sleep ${p.sleep_hours_per_night} h a night. Most students do better with 7–9 h.`);
    else if (p.sleep_hours_per_night < 7) add("warn", "😴 Slightly short on sleep", "Try adding 30–60 minutes of sleep each night.");
    else add("good", "😴 Healthy sleep", "Your sleep is within the commonly recommended range. Keep it up.");

    if (p.avg_daily_usage_hours >= 6) add("bad", "📱 Heavy social media use", `${p.avg_daily_usage_hours} h/day is high. Try app timers or phone-free hours.`);
    else if (p.avg_daily_usage_hours >= 4) add("warn", "📱 Moderate-high usage", "Consider cutting back a little, especially before bed.");
    else add("good", "📱 Balanced screen time", "Your social media use is relatively low.");

    if (p.daily_unlocks > 100) add("warn", "🔓 Frequent unlocking", `${p.daily_unlocks} unlocks/day suggests lots of checking. Turning off non-essential notifications can help.`);

    if (p.physical_activity_hours < 0.5) add("warn", "🏃 Move more", "Even a 20–30 minute daily walk is linked with better mood.");
    else add("good", "🏃 Active lifestyle", "Regular physical activity supports mental wellbeing.");

    if (p.stress_level === "High" || p.stress_level === "Very High") add("bad", "🧘 High stress", "Consider breaks, breathing exercises, or talking to someone you trust or a counsellor.");

    if (["Entertainment"].includes(p.purpose_of_use) && p.avg_daily_usage_hours >= 4) add("warn", "🎬 Entertainment-driven use", "Mixing in educational or social-connection use may feel more fulfilling.");

    $("insights").innerHTML = list.map((i) => `<div class="insight ${i.type}"><b>${i.title}</b><p>${i.text}</p></div>`).join("");
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- Reset ---------- */
  $("resetBtn").addEventListener("click", () => {
    form.reset();
    [...Object.keys(NUMBER_FIELDS), ...SELECT_FIELDS].forEach((n) => setFieldError(n, ""));
    showAlert("");
    $("results").hidden = true;
  });
})();
