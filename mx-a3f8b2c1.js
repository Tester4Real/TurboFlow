const r = "6LdsFiUsAAAAAIjVDZcuLhaHiDn5nnHVXVRQGeMV",
  n = 3e5,
  LOCAL_USER = {
    email: "local@extension.invalid",
    name: "Local User",
    picture: "",
    token: "local",
  },
  LOCAL_PLAN = {
    plan: "pro",
    promptsPerDay: 0,
    promptsUsedToday: 0,
    promptsRemaining: -1,
    trial: !1,
    localOnly: !0,
  };
let i = LOCAL_USER,
  s = LOCAL_PLAN,
  c = null,
  l = null,
  d = null,
  u = null,
  p = 0,
  m = null,
  f = !1,
  g = 0,
  w = null,
  h = "flow-auto",
  _ = !0,
  y = !0,
  I = "2k",
  A = "standard",
  E = { total: 0, downloaded: 0, failed: 0 },
  T = 0,
  v = 0,
  b = 5e3,
  O = 0,
  P = 0,
  S = 0,
  M = 5e3,
  C = !1,
  R = !1,
  k = 0,
  L = 0,
  x = 5e3,
  N = !1,
  D = 0,
  U = 5e3,
  $ = !1,
  G = 0,
  F = 0,
  j = 0,
  H = 5e3,
  B = !1;
const V = new Map(),
  z = new Map(),
  K = new Set(),
  Y = new Map(),
  W = [];
let q = 0,
  Q = 3,
  J = 3;
const X = 1;
let Z = !1;
function ee(e) {
  ((J = { fast: 3, balanced: 2, slow: 1 }[e] || 3), Q > J && (Q = J));
}
let te = 0,
  ae = 0;
const re = new Map(),
  oe = new Map();
let ne = null;
function ie(e) {
  return !!e && !["PAYGATE_TIER_NOT_PAID", "PAYGATE_TIER_ONE"].includes(e);
}
let _vD = {
    status: "disconnected",
    flowTabId: null,
    hasProject: !1,
    lastCheck: 0,
    lastError: null,
  },
  se = null,
  ce = null,
  le = null,
  de = !1,
  ue = 0;
const pe = 3,
  me = 2;
let fe = 0,
  ge = null;
function we(e) {
  return new Promise((t) => setTimeout(t, e));
}
function he() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
    const t = (16 * Math.random()) | 0;
    return ("x" === e ? t : (3 & t) | 8).toString(16);
  });
}
function _e() {
  return Math.floor(3e5 * Math.random());
}
class ye extends Error {
  constructor(e) {
    (super(e), (this.name = "_xY"));
  }
}
function Ie(e) {
  if (!e) return !1;
  try {
    const t = new URL(e);
    return (
      "labs.google" === t.hostname &&
      /^\/fx\/(?:[^/]+\/)?tools\/flow(?:\/|$)/.test(t.pathname)
    );
  } catch (t) {
    return /labs\.google\/fx\/(?:[^/]+\/)?tools\/flow(?:[/?#]|$)/.test(e);
  }
}
async function findFlowTabs() {
  const e = new Map(),
    t = async (t) => {
      try {
        for (const a of await chrome.tabs.query(t))
          a?.id && !e.has(a.id) && e.set(a.id, a);
      } catch (e) {}
    };
  return (
    await t({ active: !0, currentWindow: !0 }),
    await t({ url: "https://labs.google/fx/*" }),
    await t({}),
    [...e.values()].filter((e) => e.url && Ie(e.url))
  );
}
function getProjectIdFromUrl(e) {
  if (!e) return null;
  try {
    const t = new URL(e).pathname.match(/\/project\/([^/?#]+)/);
    return t ? t[1] : null;
  } catch (t) {
    const a = e.match(/\/project\/([^/?#]+)/);
    return a ? a[1] : null;
  }
}
function setFlowConnectionFromTab(e, t = {}) {
  if (!e?.id) return null;
  const a = t.projectId || getProjectIdFromUrl(t.url || e.url),
    r = {
      status: a ? "connected" : "connecting",
      flowTabId: e.id,
      hasProject: !!a,
      lastCheck: Date.now(),
      lastError: a ? null : "Open or create a project in Flow",
      googlePaygateTier: ne,
    };
  return (
    (c = e.id),
    (u = a || null),
    chrome.sidePanel
      ?.setOptions({ tabId: e.id, path: "sidepanel.html", enabled: !0 })
      .catch(() => {}),
    (_vD = r),
    Ke(),
    r
  );
}
let Ae = null;
async function Ee() {
  return i;
}
async function Te() {
  ((i = LOCAL_USER),
    (s = LOCAL_PLAN),
    await chrome.storage.local.set({
      turboflowUser: i,
      turboflowPlan: s,
      turboflowPlanTime: Date.now(),
    }),
    chrome.runtime
      .sendMessage({ type: "AUTH_STATE_CHANGED", user: i, plan: s })
      .catch(() => {}));
}
async function ve() {
  ((i = LOCAL_USER),
    (s = LOCAL_PLAN),
    await chrome.storage.local.set({
      turboflowUser: i,
      turboflowPlan: s,
      turboflowPlanTime: Date.now(),
    }),
    chrome.runtime
      .sendMessage({ type: "AUTH_STATE_CHANGED", user: i, plan: s })
      .catch(() => {}));
}
async function be() {
  return !0;
}
async function Oe() {
  return !0;
}
async function Pe(e, a, r) {
  return;
}
async function Se(e = !1) {
  return (
    (s = LOCAL_PLAN),
    await chrome.storage.local.set({
      turboflowPlan: s,
      turboflowPlanTime: Date.now(),
    }),
    chrome.runtime
      .sendMessage({ type: "PLAN_UPDATE", plan: s })
      .catch(() => {}),
    s
  );
}
async function Me(e, a) {
  return { allowed: !0, remaining: -1 };
}
let Ce = null;
function Re() {
  if (Ce) return Ce;
  let e = "unknown";
  try {
    const t = navigator.userAgent || "";
    t.includes("CrOS")
      ? (e = "ChromeOS")
      : t.includes("Windows")
        ? (e = "Windows")
        : t.includes("Mac")
          ? (e = "Mac")
          : t.includes("Linux")
            ? (e = "Linux")
            : t.includes("Android") && (e = "Android");
  } catch (e) {}
  let t = "unknown";
  try {
    t = navigator.language || "unknown";
  } catch (e) {}
  return ((Ce = { platform: e, locale: t }), Ce);
}
let ke = null;
function Le() {
  return ke;
}
function xe(e) {
  ke = e;
}
function Ne() {
  try {
    return chrome.runtime.getManifest().version;
  } catch (e) {
    return "unknown";
  }
}
function De() {
  const e = {
    usedMapper: !1,
    usedAutoChain: !1,
    usedLibrary: !1,
    usedVideoMode: !1,
    usedOnboarding: !1,
    librarySize: 0,
    queueSize: 0,
  };
  try {
    void 0 !== w?.videoRatio && (e.usedVideoMode = !0);
  } catch (e) {}
  return e;
}
async function Ue() {
  const e = De();
  try {
    const t = await chrome.storage.local.get([
      "turboflowImageLibrary",
      "flowAutoBatches",
      "flowAutoRefMode",
      "turboflowOnboardingDone",
    ]);
    if (
      (t.turboflowImageLibrary &&
        Array.isArray(t.turboflowImageLibrary) &&
        ((e.librarySize = t.turboflowImageLibrary.length),
        (e.usedLibrary = t.turboflowImageLibrary.length > 0)),
      t.flowAutoBatches && Array.isArray(t.flowAutoBatches))
    ) {
      e.queueSize = t.flowAutoBatches.length;
      const a = t.flowAutoBatches.filter(
        (e) => "done" === e.status || "partial" === e.status,
      );
      e.usedAutoChain = a.length > 1;
    }
    ("mapped" === t.flowAutoRefMode && (e.usedMapper = !0),
      t.turboflowOnboardingDone && (e.usedOnboarding = !0));
  } catch (e) {}
  return e;
}
async function $e(e, a, r = null) {
  return (
    (m = {
      unlockToken: "local",
      timestamp: Date.now(),
      promptCount: e,
      mode: a,
    }),
    { authorized: !0, remaining: -1, localOnly: !0 }
  );
}
async function Ge(e, a, r = null) {
  return ((m = null), { ok: !0, remaining: -1, localOnly: !0 });
}
async function Fe() {
  if (!c) return !1;
  try {
    _vD._recovering = !0;
    const e = (await chrome.tabs.get(c)).url;
    return e && Ie(e)
      ? (Kt("🔄 reCAPTCHA expired — reloading Flow page...", "warn"),
        (d = null),
        (u = null),
        await chrome.scripting.executeScript({
          target: { tabId: c },
          world: "MAIN",
          func: () => {
            window.location.href =
              window.location.href.split("?")[0] + "?t=" + Date.now();
          },
        }),
        await He(c, 3e4),
        await we(5e3),
        (await Ze())
          ? (await Qe(!0),
            await Xe(),
            await Ve(),
            (ge = "url_reload"),
            wt.push({
              at: Date.now() - lt,
              level: "url_reload",
              succeededBefore: E.total,
            }),
            Kt("✅ reCAPTCHA recovered via page reload", "success"),
            (_vD._recovering = !1),
            await we(3e3),
            !0)
          : ((_vD._recovering = !1), !1))
      : ((_vD._recovering = !1), !1);
  } catch (e) {
    return ((_vD._recovering = !1), !1);
  }
}
async function je() {
  if (!c) return !1;
  try {
    ((_vD._recovering = !0),
      Kt("🔄 Creating new project to reset reCAPTCHA session...", "warn"),
      (d = null),
      (u = null));
    const e = await chrome.scripting.executeScript({
        target: { tabId: c },
        world: "MAIN",
        func: async () => {
          try {
            const e = new Date(),
              t =
                e.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                }) +
                ", " +
                e.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: !1,
                }),
              a = await fetch("/fx/api/trpc/project.createProject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  json: { projectTitle: t, toolName: "PINHOLE" },
                }),
              });
            if (!a.ok) return { error: "HTTP " + a.status };
            const r = await a.json(),
              o = r?.result?.data?.json?.result?.projectId;
            return o
              ? { success: !0, projectId: o }
              : { error: "No projectId in response" };
          } catch (e) {
            return { error: e.message };
          }
        },
      }),
      t = e?.[0]?.result;
    if (!t?.success)
      return (
        Kt(
          "❌ Failed to create new project: " + (t?.error || "unknown"),
          "error",
        ),
        (_vD._recovering = !1),
        !1
      );
    const a = "https://labs.google/fx/tools/flow/project/" + t.projectId;
    return (
      await chrome.scripting.executeScript({
        target: { tabId: c },
        world: "MAIN",
        func: (e) => {
          window.location.href = e;
        },
        args: [a],
      }),
      await He(c, 3e4),
      await we(5e3),
      (await Ze())
        ? (await Qe(!0),
          await Xe(),
          await Ve(),
          (ge = "new_project"),
          wt.push({
            at: Date.now() - lt,
            level: "new_project",
            succeededBefore: E.total,
          }),
          Kt("✅ reCAPTCHA recovered via new project", "success"),
          (_vD._recovering = !1),
          await we(5e3),
          !0)
        : (Kt(
            "⚠️ New project created but reCAPTCHA still failing — try disabling VPN",
            "warn",
          ),
          (_vD._recovering = !1),
          !1)
    );
  } catch (e) {
    return (
      (_vD._recovering = !1),
      Kt("❌ New project recovery failed: " + e.message, "error"),
      !1
    );
  }
}
async function He(e, t) {
  return new Promise((a, r) => {
    const o = setTimeout(() => {
      (chrome.tabs.onUpdated.removeListener(n),
        r(new Error("Page load timed out")));
    }, t);
    function n(t, r) {
      t === e &&
        "complete" === r.status &&
        (chrome.tabs.onUpdated.removeListener(n), clearTimeout(o), a());
    }
    chrome.tabs.onUpdated.addListener(n);
  });
}
async function Be() {
  if (de) return !!le && (await le);
  if (ue >= 3)
    return (
      Kt(
        "⚠️ Max recovery attempts reached — close Flow tab and reopen manually",
        "error",
      ),
      zt("SHOW_FIX_UNUSUAL", {}),
      !1
    );
  let e;
  ((de = !0),
    ue++,
    (le = new Promise((t) => {
      e = t;
    })));
  try {
    if (fe < 2) {
      if ((fe++, await Fe())) return (e(!0), !0);
      Kt(
        "⚠️ Page reload didn't fix reCAPTCHA — escalating to new project...",
        "warn",
      );
    }
    return (await je())
      ? (e(!0), !0)
      : (Kt("❌ Please close the Flow tab, reopen it and try again", "error"),
        zt("SHOW_FIX_UNUSUAL", {}),
        e(!1),
        !1);
  } catch (t) {
    return (Kt("❌ Recovery crashed: " + t.message, "error"), e(!1), !1);
  } finally {
    ((de = !1), await we(2e3), (le = null));
  }
}
async function Ve() {
  const e = {
    status: "disconnected",
    flowTabId: null,
    hasProject: !1,
    lastCheck: Date.now(),
    lastError: null,
  };
  try {
    const t = await findFlowTabs();
    if (0 === t.length)
      return (
        (e.lastError = "Open Google Flow and sign in with Google if prompted"),
        (c = null),
        (_vD = e),
        Ke(),
        e
      );
    const a = t.sort((e, t) =>
      "complete" === e.status && "complete" !== t.status
        ? -1
        : "complete" === t.status && "complete" !== e.status
          ? 1
          : (t.lastAccessed || 0) - (e.lastAccessed || 0),
    )[0];
    if (
      ((e.flowTabId = a.id),
      (c = a.id),
      chrome.sidePanel
        .setOptions({ tabId: a.id, path: "sidepanel.html", enabled: !0 })
        .catch(() => {}),
      "complete" !== a.status)
    )
      return (
        (e.status = "connecting"),
        (e.lastError = "Flow page is loading..."),
        (_vD = e),
        Ke(),
        e
      );
  } catch (t) {
    return (
      (e.lastError = "Open Google Flow to get started"),
      (_vD = e),
      Ke(),
      e
    );
  }
  try {
    u = null;
    const t = await Xe();
    ((e.hasProject = !!t),
      t || (e.lastError = "Open or create a project in Flow"));
  } catch (t) {
    e.lastError = "Open or create a project in Flow";
  }
  return (
    e.flowTabId &&
      !f &&
      (ne && (e.googlePaygateTier = ne),
      st()
        .then((t) => {
          t && ((e.googlePaygateTier = t.tier), (_vD = e), Ke());
        })
        .catch(() => {})),
    e.flowTabId && e.hasProject
      ? ((e.status = "connected"), (e.lastError = null))
      : e.flowTabId && (e.status = "connecting"),
    (e.googlePaygateTier = ne),
    (_vD = e),
    Ke(),
    e
  );
}
async function ze() {
  if (!c) return Ve();
  try {
    const e = await chrome.tabs.get(c);
    return e.url && Ie(e.url)
      ? "complete" !== e.status
        ? ((_vD = {
            ..._vD,
            status: "connecting",
            flowTabId: e.id,
            hasProject: !1,
            lastError: "Flow page is loading...",
            lastCheck: Date.now(),
          }),
          Ke(),
          _vD)
        : "connected" === _vD.status && Date.now() - _vD.lastCheck < 3e4
          ? _vD
          : Ve()
      : ((c = null),
        (d = null),
        (u = null),
        (_vD = {
          status: "disconnected",
          flowTabId: null,
          hasProject: !1,
          lastCheck: Date.now(),
          lastError: "Flow tab navigated away — open Flow again",
        }),
        Ke(),
        _vD);
  } catch (e) {
    return (
      (c = null),
      (d = null),
      (u = null),
      (_vD = {
        status: "disconnected",
        flowTabId: null,
        hasProject: !1,
        lastCheck: Date.now(),
        lastError: "Flow tab was closed",
      }),
      Ke(),
      _vD
    );
  }
}
function Ke() {
  chrome.runtime
    .sendMessage({ type: "CONNECTION_STATE", state: _vD })
    .catch(() => {});
}
function Ye() {
  return;
}
function We() {
  return chrome.storage.local.remove([
    "activationPending",
    "activationStartedAt",
  ]);
}
(chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: !0 })
  .catch(() => {}),
  chrome.tabs.onUpdated.addListener((e, t, a) => {
    a.url &&
      (Ie(a.url)
        ? ((c = e),
          chrome.sidePanel
            .setOptions({ tabId: e, path: "sidepanel.html", enabled: !0 })
            .catch(() => {}),
          "loading" === t.status &&
            ((d = null),
            (u = null),
            (_vD = {
              status: "connecting",
              flowTabId: e,
              hasProject: !1,
              lastError: "Flow page is loading...",
              lastCheck: Date.now(),
            }),
            Ke()),
          "complete" === t.status && setTimeout(() => Ve(), 2e3))
        : e === c &&
          ((c = null),
          (d = null),
          (u = null),
          (_vD = {
            status: "disconnected",
            flowTabId: null,
            hasProject: !1,
            lastError: "Flow tab navigated away — open Flow again",
            lastCheck: Date.now(),
          }),
          Ke()));
  }),
  chrome.tabs.onRemoved.addListener((e) => {
    e === c &&
      ((c = null),
      (d = null),
      (u = null),
      (_vD = {
        status: "disconnected",
        flowTabId: null,
        hasProject: !1,
        lastError: "Flow tab was closed",
        lastCheck: Date.now(),
      }),
      Ke());
  }),
  chrome.tabs.onReplaced.addListener((e, t) => {
    t === c && ((c = e), setTimeout(() => Ve(), 2e3));
  }));
let qe = null;
async function Qe(e = !1) {
  if (!c) return null;
  if (!e && d && Date.now() - p < n) return d;
  if (qe && !e) return qe;
  qe = Je();
  try {
    return await qe;
  } finally {
    qe = null;
  }
}
async function Je() {
  try {
    const e = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: async () => {
        try {
          const e = await fetch("/fx/api/auth/session", {
            credentials: "include",
          });
          return (await e.json()).access_token || null;
        } catch (e) {
          return null;
        }
      },
    });
    return ((d = e?.[0]?.result || null), (p = Date.now()), d);
  } catch (e) {
    return null;
  }
}
async function Xe() {
  if (u) return u;
  if (!c) return null;
  try {
    const e = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: () => {
        const e =
          window.location.pathname.match(/\/project\/([^/?#]+)/) ||
          window.location.href.match(/\/project\/([^/?#]+)/);
        return e ? e[1] : null;
      },
    });
    return ((u = e?.[0]?.result || null), u);
  } catch (e) {
    return null;
  }
}
async function Ze() {
  if (!c) return null;
  try {
    const e = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: async (e) => {
        try {
          return "undefined" != typeof grecaptcha && grecaptcha.enterprise
            ? await grecaptcha.enterprise.execute(e, {
                action: "IMAGE_GENERATION",
              })
            : null;
        } catch (e) {
          return null;
        }
      },
      args: [r],
    });
    return e?.[0]?.result || null;
  } catch (e) {
    return null;
  }
}
async function et(e, t, a, o = "IMAGE_GENERATION", n = 0) {
  if (!c) throw new Error("No Flow tab");
  if (le && 0 === n) {
    if (await le) {
      const a = await Qe(!0);
      if (a) return et(e, t, a, o, 0);
    }
    throw new Error("reCAPTCHA recovery failed — cannot make API call");
  }
  const i = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: (e, t) => {
        const a = window.grecaptcha?.enterprise;
        return a ? a.execute(e, { action: t }) : Promise.resolve(null);
      },
      args: [r, o],
    }),
    s = i?.[0]?.result;
  if (!s) throw new Error("No reCAPTCHA token — try refreshing the Flow page");
  if (
    (t.clientContext?.recaptchaContext &&
      (t.clientContext.recaptchaContext.token = s),
    t.requests)
  )
    for (const e of t.requests)
      e.clientContext?.recaptchaContext &&
        (e.clientContext.recaptchaContext.token = s);
  const l = JSON.stringify(t),
    u = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: async (e, t, a) => {
        try {
          const r = await fetch(e, {
              method: "POST",
              headers: {
                "Content-Type": "text/plain;charset=UTF-8",
                Authorization: "Bearer " + a,
              },
              body: t,
            }),
            o = await r.text();
          if (!r.ok)
            return {
              error: "HTTP " + r.status + ": " + o.substring(0, 300),
              status: r.status,
              errText: o.substring(0, 500),
            };
          let n;
          try {
            n = JSON.parse(o);
          } catch (e) {
            n = o;
          }
          return { success: !0, data: n };
        } catch (e) {
          return { error: e.message };
        }
      },
      args: [e, l, a],
    }),
    p = u?.[0]?.result;
  if (!p) throw new Error("Script execution failed");
  if (p.error) {
    let r = null,
      i = null;
    try {
      const e = JSON.parse(p.errText || "");
      r = e?.error?.message || null;
      const t = e?.error?.details;
      if (Array.isArray(t))
        for (const e of t)
          if (e.reason) {
            i = e.reason;
            break;
          }
    } catch (e) {}
    const s = (e) =>
      r && i
        ? `${r} [${i}]`
        : r || (i ? `[${i}]` : p.errText?.substring(0, 200) || e);
    if (400 === p.status)
      throw new Error("Rejected (400): " + s("Bad request"));
    if (401 === p.status) {
      if (0 === n) {
        ((d = null), await we(1e3));
        const a = await Qe(!0);
        if (a) return et(e, t, a, o, 1);
      }
      throw new Error(
        "Session expired (401) — refresh the Flow page and try again",
      );
    }
    if (429 === p.status) {
      const e =
          "DAILY_QUOTA_REACHED" === i ||
          (p.errText || "").includes("DAILY_QUOTA_REACHED"),
        t =
          "PUBLIC_ERROR_USER_REQUESTS_THROTTLED" === i ||
          (p.errText || "").includes("PUBLIC_ERROR_USER_REQUESTS_THROTTLED");
      if (e)
        throw new ye(
          "Your Google account's daily generation limit reached. Try again in a few hours.",
        );
      if (t) throw new Error("429 Throttled: " + s("throttled"));
      if ((p.errText || "").includes("RESOURCE_EXHAUSTED"))
        throw new Error("429 Rate limited: " + s("rate limited"));
      throw new Error("429: " + s("rate limited"));
    }
    if (403 === p.status) {
      const r = (p.errText || "").toLowerCase(),
        i =
          r.includes("recaptcha") || r.includes("captcha") || r.includes("bot"),
        s =
          r.includes("permission") ||
          r.includes("forbidden") ||
          r.includes("auth");
      if (0 === n) return (await we(1500), et(e, t, (await Qe(!0)) || a, o, 1));
      if (1 === n && i && (await Be())) {
        const a = await Qe(!0);
        if (a) return et(e, t, a, o, 2);
      }
      if (i)
        throw new Error(
          "reCAPTCHA blocked — close the Flow tab, reopen it, and try again",
        );
      if (s)
        throw new Error(
          "Access denied (403) — your Flow session may have expired. Refresh the Flow page and try again",
        );
      throw new Error(
        "Blocked by Google (403) — refresh the Flow page, disable VPN if active, and try again",
      );
    }
    throw new Error(p.error);
  }
  return p.data;
}
async function tt(e, t, a, r = 0) {
  const o = await Qe(),
    n = await Xe();
  if (!o || !n) throw new Error("Missing auth/project");
  const i = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: async (e, t, a, r, o) => {
        try {
          const n = await fetch(
            "https://aisandbox-pa.googleapis.com/v1/flow/uploadImage",
            {
              method: "POST",
              headers: {
                "Content-Type": "text/plain;charset=UTF-8",
                Authorization: "Bearer " + o,
              },
              body: JSON.stringify({
                clientContext: { projectId: r, tool: "PINHOLE" },
                fileName: t,
                imageBytes: e,
                isHidden: !1,
                isUserUploaded: !0,
                mimeType: a,
              }),
            },
          );
          if (!n.ok) {
            const e = await n.text();
            return {
              error: "HTTP " + n.status + ": " + e.substring(0, 300),
              status: n.status,
            };
          }
          return { success: !0, data: await n.json() };
        } catch (e) {
          return { error: e.message, isNetworkError: !0 };
        }
      },
      args: [e, t, a, n, o],
    }),
    s = i?.[0]?.result;
  if (!s) {
    if (r < 3) {
      const o = 1e3 * Math.pow(2, r) + 500 * Math.random();
      return (await we(o), tt(e, t, a, r + 1));
    }
    throw new Error("Script execution failed after 3 retries");
  }
  if (s.error) {
    if (400 === s.status || 404 === s.status || 422 === s.status)
      throw new Error(s.error);
    if (
      (s.isNetworkError ||
        429 === s.status ||
        500 === s.status ||
        502 === s.status ||
        503 === s.status ||
        s.error.includes("Failed to fetch") ||
        s.error.includes("NetworkError") ||
        s.error.includes("network") ||
        s.error.includes("ECONNRESET") ||
        s.error.includes("timeout")) &&
      r < 3
    ) {
      const o =
        429 === s.status
          ? 3e3 * Math.pow(2, r) + 1e3 * Math.random()
          : 1e3 * Math.pow(1.5, r) + 500 * Math.random();
      return (
        await we(o),
        (401 !== s.status && 403 !== s.status) || (d = null),
        tt(e, t, a, r + 1)
      );
    }
    throw new Error(s.error);
  }
  const l = s.data?.media?.name;
  if (!l) throw new Error("No mediaId in upload response");
  return (
    zt("LOG", {
      message: `📤 Uploaded "${t}" → mediaId: ${l.substring(0, 8)}...`,
      type: "success",
    }),
    l
  );
}
async function at(e, t, a, o = "2k") {
  const n = ";" + Date.now() + Math.random(),
    i =
      "4k" === o
        ? "UPSAMPLE_IMAGE_RESOLUTION_4K"
        : "UPSAMPLE_IMAGE_RESOLUTION_2K",
    s = "4k" === o ? "PAYGATE_TIER_TWO" : "PAYGATE_TIER_NOT_PAID",
    l = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: async (e, t, a, r, o, n, i) => {
        try {
          let s = null;
          if (
            ("undefined" != typeof grecaptcha &&
              grecaptcha.enterprise &&
              (s = await grecaptcha.enterprise.execute(o, {
                action: "IMAGE_GENERATION",
              })),
            !s)
          )
            return { error: "No reCAPTCHA token" };
          const c = await fetch(
            "https://aisandbox-pa.googleapis.com/v1/flow/upsampleImage",
            {
              method: "POST",
              headers: {
                "Content-Type": "text/plain;charset=UTF-8",
                Authorization: "Bearer " + r,
              },
              body: JSON.stringify({
                mediaId: e,
                targetResolution: n,
                clientContext: {
                  projectId: t,
                  tool: "PINHOLE",
                  recaptchaContext: {
                    applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB",
                    token: s,
                  },
                  sessionId: a,
                  userPaygateTier: i,
                },
              }),
            },
          );
          if (!c.ok) {
            const e = await c.text();
            return {
              error: "HTTP " + c.status + ": " + e.substring(0, 500),
              status: c.status,
            };
          }
          const l = await c.json();
          return l.encodedImage
            ? { success: !0, base64: l.encodedImage }
            : { error: "No encodedImage" };
        } catch (e) {
          return { error: e.message };
        }
      },
      args: [e, t, n, a, r, i, s],
    });
  return l?.[0]?.result || { error: "Script failed" };
}
async function rt(e, t, a, r, o) {
  const n = {
      mediaGenerationContext: { batchId: he() },
      clientContext: {
        projectId: a,
        tool: "PINHOLE",
        userPaygateTier: "PAYGATE_TIER_NOT_PAID",
        sessionId: ";" + Date.now() + Math.random(),
        recaptchaContext: {
          token: "PLACEHOLDER",
          applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB",
        },
      },
      requests: [
        {
          resolution: "VIDEO_RESOLUTION_1080P",
          aspectRatio:
            "portrait" === o
              ? "VIDEO_ASPECT_RATIO_PORTRAIT"
              : "VIDEO_ASPECT_RATIO_LANDSCAPE",
          seed: _e(),
          videoModelKey: "veo_3_1_upsampler_1080p",
          metadata: { workflowId: t },
          videoInput: { mediaId: e },
        },
      ],
      useV2ModelConfig: !0,
    },
    i = await et(
      "https://aisandbox-pa.googleapis.com/v1/video:batchAsyncGenerateVideoUpsampleVideo",
      n,
      r,
      "VIDEO_GENERATION",
    ),
    s = i?.media?.[0]?.name,
    c = i?.operations?.[0]?.status;
  if (!s) throw new Error("No upsampled mediaId in response");
  return { upsampledMediaId: s, status: c };
}
async function ot(e, t, a, r, o) {
  const n = {
      mediaGenerationContext: { batchId: he() },
      clientContext: {
        projectId: a,
        tool: "PINHOLE",
        userPaygateTier: "PAYGATE_TIER_TWO",
        sessionId: ";" + Date.now() + Math.random(),
        recaptchaContext: {
          token: "PLACEHOLDER",
          applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB",
        },
      },
      requests: [
        {
          resolution: "VIDEO_RESOLUTION_4K",
          aspectRatio:
            "portrait" === o
              ? "VIDEO_ASPECT_RATIO_PORTRAIT"
              : "VIDEO_ASPECT_RATIO_LANDSCAPE",
          seed: _e(),
          videoModelKey: "veo_3_1_upsampler_4k",
          metadata: { workflowId: t },
          videoInput: { mediaId: e },
        },
      ],
      useV2ModelConfig: !0,
    },
    i = await et(
      "https://aisandbox-pa.googleapis.com/v1/video:batchAsyncGenerateVideoUpsampleVideo",
      n,
      r,
      "VIDEO_GENERATION",
    ),
    s = i?.media?.[0]?.name,
    c = i?.operations?.[0]?.status;
  if (!s) throw new Error("No upsampled mediaId in 4K response");
  return { upsampledMediaId: s, status: c };
}
async function nt(e, t, a, r) {
  for (let a = 0; a < 120; a++) {
    await we(5e3);
    try {
      const o = await Qe();
      if (!o) continue;
      const n = await chrome.scripting.executeScript({
          target: { tabId: c },
          world: "MAIN",
          func: async (e, t, a) => {
            try {
              const r = await fetch(
                "https://aisandbox-pa.googleapis.com/v1/video:batchCheckAsyncVideoGenerationStatus",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "text/plain;charset=UTF-8",
                    Authorization: "Bearer " + a,
                  },
                  body: JSON.stringify({ media: [{ name: e, projectId: t }] }),
                },
              );
              return r.ok
                ? { success: !0, data: await r.json() }
                : { error: "HTTP " + r.status };
            } catch (e) {
              return { error: e.message };
            }
          },
          args: [e, t, o],
        }),
        i = n?.[0]?.result;
      if (!i?.success) continue;
      const s = i.data?.media?.[0],
        l = s?.mediaMetadata?.mediaStatus?.mediaGenerationStatus;
      if (
        "MEDIA_GENERATION_STATUS_COMPLETED" === l ||
        "MEDIA_GENERATION_STATUS_COMPLETE" === l ||
        "MEDIA_GENERATION_STATUS_SUCCESSFUL" === l
      )
        return (
          zt("LOG", {
            message: `✅ Video #${r + 1} upscaled to 1080p!`,
            type: "success",
          }),
          `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${e}`
        );
      if ("MEDIA_GENERATION_STATUS_FAILED" === l)
        return (
          zt("LOG", {
            message: `❌ Video #${r + 1} upscale failed`,
            type: "error",
          }),
          null
        );
      a % 6 == 0 &&
        Kt(
          `⏳ Video #${String(r + 1).padStart(3, "0")} upscaling... (${Math.round((5e3 * a) / 1e3)}s)`,
          "info",
        );
    } catch (e) {}
  }
  return (
    zt("LOG", {
      message: `⏰ Video #${r + 1} upscale timed out`,
      type: "error",
    }),
    null
  );
}
async function it(e, t) {
  return `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${e}`;
}
async function st() {
  if (!c) return null;
  try {
    const e = await Qe();
    if (!e) return null;
    const t = await chrome.scripting.executeScript({
        target: { tabId: c },
        world: "MAIN",
        func: async (e, t) => {
          try {
            const a = await fetch(
              "https://aisandbox-pa.googleapis.com/v1/credits?key=" + t,
              { headers: { Authorization: "Bearer " + e } },
            );
            return a.ok
              ? { success: !0, data: await a.json() }
              : { error: "HTTP " + a.status };
          } catch (e) {
            return { error: e.message };
          }
        },
        args: [e, o],
      }),
      a = t?.[0]?.result;
    if (!a?.success) return null;
    const r = a.data?.userPaygateTier || null;
    return (
      (ne = r),
      r &&
        chrome.storage.local
          .set({ turboflowGoogleTier: r, turboflowGoogleTierAt: Date.now() })
          .catch(() => {}),
      {
        tier: r,
        sku: a.data?.sku || null,
        serviceTier: a.data?.serviceTier || null,
        credits: a.data?.credits ?? null,
      }
    );
  } catch (e) {
    return null;
  }
}
let ct = {},
  lt = 0,
  dt = 0,
  ut = !1,
  pt = !1,
  mt = {},
  ft = 0,
  gt = 0,
  wt = [];
function ht() {
  ((ct = {}),
    (lt = 0),
    (dt = 0),
    (ut = !1),
    (pt = !1),
    (mt = {}),
    (ft = 0),
    (gt = 0),
    (wt = []));
}
function _t(e) {
  (ct[e] || (ct[e] = 0), ct[e]++);
}
function yt(e) {
  if (!e) return "unknown";
  const t = e.toLowerCase();
  return t.includes("recaptcha") || t.includes("captcha") || t.includes("bot")
    ? "recaptcha_blocked"
    : t.includes("daily_quota_reached") || t.includes("resource_exhausted")
      ? "daily_quota"
      : t.includes("401") ||
          t.includes("session expired") ||
          t.includes("authentication credentials")
        ? "auth_expired"
        : t.includes("429") || t.includes("rate limit")
          ? "rate_limited_429"
          : t.includes("500") || t.includes("502") || t.includes("503")
            ? "server_error_500"
            : t.includes("403") ||
                t.includes("access denied") ||
                t.includes("forbidden") ||
                t.includes("blocked by google")
              ? "access_denied_403"
              : t.includes("400") || t.includes("rejected")
                ? "google_rejected_400"
                : t.includes("timeout") || t.includes("timed out")
                  ? "timeout"
                  : t.includes("failed to fetch") ||
                      t.includes("networkerror") ||
                      t.includes("network") ||
                      t.includes("econnreset")
                    ? "network_error"
                    : t.includes("script") ||
                        t.includes("no flow tab") ||
                        t.includes("missing auth")
                      ? "script_failed"
                      : "unknown";
}
function It(e, t) {
  if (!e || "string" != typeof e) return;
  let a = e.substring(0, 500);
  (a.includes("HTTP 500") &&
    a.includes("Internal error encountered") &&
    (a = "HTTP 500: Google internal error"),
    t?.videoModelKey && (a = "[" + t.videoModelKey + "] " + a),
    mt[a] || (mt[a] = 0),
    mt[a]++);
}
function At() {
  let e = null,
    t = 0;
  for (const [a, r] of Object.entries(mt)) r > t && ((t = r), (e = a));
  return e;
}
function Et() {
  const e = Date.now(),
    t = lt > 0 && dt > 0 ? dt - lt : null,
    a = lt > 0 ? e - lt : null,
    r = a && t && a > t ? a - t : null,
    o = { ...ct };
  return (
    ut && (o.user_stopped = 1),
    {
      duration: { totalMs: a, generationMs: t, downloadMs: r },
      errors: Object.keys(o).length > 0 ? o : null,
      autoChained: pt,
      speedMode: w?.speedMode || "fast",
      totalImagesGenerated: gt,
      rateLimitHits: O,
      upscaleRateLimitHits: P,
      videoUpscaleRateLimitHits: G,
      fourKVideoUpscaleRateLimitHits: F,
      topErrorMessage: At(),
      videoPollDurationMs: ft > 0 ? ft : null,
      actualDownloadQuality: void 0 !== ce ? ce : null,
      recaptchaRecoveries: ue,
      recaptchaRecoveryLevel: ge,
      recoveryLog: wt,
      downloadTotal: E.total,
      downloadSaved: E.downloaded,
      downloadFailed: E.failed,
      autoDownloadImages: _,
      autoDownloadVideos: y,
      imageModel: w?.imageModel || null,
      videoModelKey: null,
    }
  );
}
function Tt(e, t, a, r, o) {
  if (((o = o || 8), "omni_flash" === t)) {
    const t = "_" + o + "s";
    switch (e) {
      case "text":
      default:
        return "abra_t2v" + t;
      case "reference":
        return "abra_r2v" + t;
      case "start_frame":
        return "abra_i2v" + t;
    }
  }
  const n = 8 !== o,
    i = n ? "_" + o + "s" : "";
  if ("lite" === t)
    switch (e) {
      case "text":
      default:
        return "veo_3_1_t2v_lite" + i;
      case "start_frame":
        return n ? "veo_3_1_i2v_s_lite" + i : "veo_3_1_i2v_lite";
      case "start_end_frame":
        return n
          ? "veo_3_1_i2v_s_lite" + i + "_fl"
          : "veo_3_1_interpolation_lite";
      case "reference":
        return "veo_3_1_r2v_lite";
    }
  if ("lite_lp" === t)
    switch (e) {
      case "text":
        return n
          ? "veo_3_1_t2v_lite" + i + "_low_priority"
          : "veo_3_1_t2v_lite_low_priority";
      case "start_frame":
        return n
          ? "veo_3_1_i2v_s_lite" + i + "_low_priority"
          : "veo_3_1_i2v_lite_low_priority";
      case "start_end_frame":
        return n
          ? "veo_3_1_i2v_s_lite" + i + "_fl_low_priority"
          : "veo_3_1_interpolation_lite_low_priority";
      case "reference":
        return "veo_3_1_r2v_lite_low_priority";
      default:
        return "veo_3_1_t2v_lite_low_priority";
    }
  if ("relaxed" === t)
    switch (e) {
      case "text": {
        let e = "veo_3_1_t2v_fast";
        return (
          "portrait" === a && (e += "_portrait"),
          (e += "_ultra_relaxed"),
          e
        );
      }
      case "start_frame": {
        let e = "veo_3_1_i2v_s_fast";
        return (
          "portrait" === a && (e += "_portrait"),
          (e += "_ultra_relaxed"),
          e
        );
      }
      case "start_end_frame": {
        let e = "veo_3_1_i2v_s_fast_fl";
        return (
          "portrait" === a && (e += "_portrait"),
          (e += "_ultra_relaxed"),
          e
        );
      }
      case "reference": {
        let e = "veo_3_1_r2v_fast";
        return (
          (e += "landscape" === a ? "_landscape" : "_portrait"),
          (e += "_ultra_relaxed"),
          e
        );
      }
      default:
        return "veo_3_1_t2v_fast_ultra_relaxed";
    }
  if ("fast" === t)
    switch (e) {
      case "text": {
        if (n) return "veo_3_1_t2v_fast" + i;
        let e = "veo_3_1_t2v_fast";
        return (
          "portrait" === a && (e += "_portrait"),
          r && (e += "_ultra"),
          e
        );
      }
      case "start_frame": {
        if (n) return "veo_3_1_i2v_s_fast" + i;
        let e = "veo_3_1_i2v_s_fast";
        return (
          "portrait" === a && (e += "_portrait"),
          r && (e += "_ultra"),
          e
        );
      }
      case "start_end_frame": {
        if (n) return "veo_3_1_i2v_s_fast" + i + "_fl";
        let e = "veo_3_1_i2v_s_fast";
        return (
          "portrait" === a && (e += "_portrait"),
          r && (e += "_ultra"),
          (e += "_fl"),
          e
        );
      }
      case "reference": {
        let e = "veo_3_1_r2v_fast";
        return (
          (e += "landscape" === a ? "_landscape" : "_portrait"),
          r && (e += "_ultra"),
          e
        );
      }
      default:
        return "veo_3_1_t2v_fast" + (r ? "_ultra" : "");
    }
  switch (e) {
    case "text": {
      if (n) return "veo_3_1_t2v_quality" + i;
      let e = "veo_3_1_t2v";
      return ("portrait" === a && (e += "_portrait"), e);
    }
    case "start_frame": {
      if (n) return "veo_3_1_i2v_s_quality" + i;
      let e = "veo_3_1_i2v_s";
      return ("portrait" === a && (e += "_portrait"), e);
    }
    case "start_end_frame": {
      if (n) return "veo_3_1_i2v_s_quality" + i + "_fl";
      let e = "veo_3_1_i2v_s";
      return ("portrait" === a && (e += "_portrait"), (e += "_fl"), e);
    }
    case "reference": {
      let e = "veo_3_1_r2v";
      return ((e += "landscape" === a ? "_landscape" : "_portrait"), e);
    }
    default:
      return "veo_3_1_t2v";
  }
}
function vt(e) {
  switch (e) {
    case "text":
    default:
      return "batchAsyncGenerateVideoText";
    case "start_frame":
      return "batchAsyncGenerateVideoStartImage";
    case "start_end_frame":
      return "batchAsyncGenerateVideoStartAndEndImage";
    case "reference":
      return "batchAsyncGenerateVideoReferenceImages";
  }
}
async function bt(e, t, a = 200) {
  const r = new Array(e.length);
  let o,
    n = 0,
    i = 0,
    s = !1,
    c = t;
  const l = [],
    d = new Map(),
    u = new Set();
  let p = 0;
  const m = new Promise((e) => {
    o = e;
  });
  function g() {
    return (
      !!s ||
      (r.filter((e) => void 0 !== e).length === e.length &&
        ((s = !0), o(r), !0))
    );
  }
  function w(a, o, i) {
    if ((n--, i)) {
      const t = o?.message || String(o),
        n = t.includes("429");
      if ((p++, p >= 15)) {
        ((r[a] = { status: "rejected", reason: o }),
          d.delete(a),
          u.delete(a),
          f &&
            ((f = !1),
            zt("LOG", {
              message:
                "🛑 Too many consecutive failures — stopping batch. Check your Flow page and try again.",
              type: "error",
            })));
        for (let t = 0; t < e.length; t++)
          void 0 === r[t] &&
            (r[t] = {
              status: "rejected",
              reason: new Error("Stopped — too many consecutive failures"),
            });
        return void g();
      }
      if (
        (_t(yt(t)),
        It(t),
        "_xY" === o?.name || t.includes("DAILY_QUOTA_REACHED"))
      ) {
        ((r[a] = { status: "rejected", reason: o }),
          d.delete(a),
          C ||
            ((C = !0),
            (f = !1),
            zt("LOG", {
              message:
                "🚫 Your Google account's daily generation limit reached. Try again in a few hours.",
              type: "error",
            }),
            zt("QUOTA_EXHAUSTED", {
              message:
                "Your Google account's daily generation limit reached. Try again in a few hours.",
              type: "generation",
            })));
        for (let t = 0; t < e.length; t++)
          void 0 === r[t] &&
            (r[t] = {
              status: "rejected",
              reason: new Error("Skipped — daily quota reached"),
            });
        return void g();
      }
      if (
        le &&
        (t.includes("No Flow tab") ||
          t.includes("Script execution failed") ||
          t.includes("Script failed") ||
          t.includes("Missing auth/project") ||
          t.includes("No reCAPTCHA token") ||
          t.includes("reCAPTCHA blocked") ||
          t.includes("reCAPTCHA recovery failed") ||
          t.includes("Failed to fetch") ||
          t.includes("NetworkError") ||
          t.includes("network") ||
          t.includes("Load failed") ||
          t.includes("aborted") ||
          t.includes("scripting.executeScript") ||
          t.includes("Error in invocation") ||
          t.includes("Cannot access") ||
          t.includes("Frame with") ||
          t.includes("No tab") ||
          t.includes("No frame"))
      ) {
        c = 2;
        const e = l.findIndex((e) => e.index === a);
        return (
          e >= 0 && l.splice(e, 1),
          void le
            .then(() => {
              setTimeout(
                () => {
                  l.push({ index: a });
                },
                2e3 + 1e3 * Math.random(),
              );
            })
            .catch(() => {
              l.push({ index: a });
            })
        );
      }
      const i = d.get(a) || 0,
        s = t.includes("429 Throttled") || t.includes("429 Rate limited"),
        m = t.includes("500"),
        w =
          t.includes("403") &&
          !t.includes("reCAPTCHA blocked") &&
          !t.includes("Blocked by Google"),
        h = t.includes("Google rejected"),
        _ = n || m || w || h,
        y = h ? 1 : 3;
      if (
        (n && O++,
        s &&
          ((v = Date.now()),
          T++,
          (b = Math.min(2 * b, 3e4)),
          c > 1 &&
            ((c = 1),
            Kt(
              "⏳ Google is throttling — slowing down to 1 at a time...",
              "warn",
            ))),
        _ && i < y)
      ) {
        const e = 5e3 * Math.pow(2.5, i) + 2e3 * Math.random();
        d.set(a, i + 1);
        const t = l.findIndex((e) => e.index === a);
        if ((t >= 0 && l.splice(t, 1), u.has(a))) return;
        return (
          u.add(a),
          void setTimeout(() => {
            (u.delete(a), l.push({ index: a }));
          }, e)
        );
      }
      ((r[a] = { status: "rejected", reason: o }), d.delete(a), u.delete(a));
    } else {
      ((r[a] = { status: "fulfilled", value: o }),
        d.delete(a),
        u.delete(a),
        (p = 0));
      const e = l.findIndex((e) => e.index === a);
      e >= 0 && l.splice(e, 1);
      const n = Date.now() - v;
      c < t &&
        v > 0 &&
        n > 12e4 &&
        ((c = Math.min(c + 1, t)),
        (b = Math.max(b / 1.3, 5e3)),
        (v = Date.now()),
        c === t && Kt("✓ Pacing recovered — running at full speed", "success"));
    }
    g();
  }
  function h(t) {
    (n++,
      u.delete(t),
      e[t]()
        .then((e) => w(t, e, !1))
        .catch((e) => w(t, e, !0)));
  }
  const _ = setInterval(() => {
    if (g()) clearInterval(_);
    else {
      if (!f && 0 === l.length) {
        for (let t = 0; t < e.length; t++)
          void 0 === r[t] &&
            (r[t] = {
              status: "rejected",
              reason: new Error("Skipped — generation stopped"),
            });
        return (g(), void clearInterval(_));
      }
      if (!(n >= c)) {
        if (l.length > 0) return void h(l.shift().index);
        if (i < e.length) return void h(i++);
      }
    }
  }, a);
  return m;
}
async function Ot(e, t = 3, a = 3e3) {
  for (let r = 0; r <= t; r++)
    try {
      return await e();
    } catch (e) {
      if (!e.message || !e.message.includes("429") || r === t) throw e;
      const o = a * Math.pow(2, r) + 1e3 * Math.random();
      (zt("LOG", {
        message: `⏳ Rate limited — retrying in ${(o / 1e3).toFixed(1)}s (attempt ${r + 1}/${t})`,
        type: "warn",
      }),
        await we(o));
    }
}
async function Pt(e, t, a) {
  const r = await Qe(),
    o = await Xe();
  if (!r || !o) throw new Error("Missing auth/project");
  const n = he(),
    i = ";" + Date.now(),
    s = t.imageCount || 1;
  V.set(n, a);
  const c = `https://aisandbox-pa.googleapis.com/v1/projects/${o}/flowMedia:batchGenerateImages`,
    l = [];
  for (let a = 0; a < s; a++) {
    const a = _e();
    l.push({
      seed: a,
      payload: {
        clientContext: {
          recaptchaContext: {
            applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB",
            token: "PLACEHOLDER",
          },
          projectId: o,
          tool: "PINHOLE",
          sessionId: i,
        },
        mediaGenerationContext: { batchId: n },
        requests: [
          {
            clientContext: {
              recaptchaContext: {
                applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB",
                token: "PLACEHOLDER",
              },
              projectId: o,
              tool: "PINHOLE",
              sessionId: i,
            },
            imageAspectRatio: t.aspectRatio || "IMAGE_ASPECT_RATIO_LANDSCAPE",
            imageInputs: [],
            imageModelName: t.imageModel || "NARWHAL",
            seed: a,
            structuredPrompt: { parts: [{ text: e }] },
          },
        ],
      },
    });
  }
  const d = l.map((t, o) =>
      (async () => {
        try {
          const o = await et(c, t.payload, r);
          if (o?.workflows)
            for (const r of o.workflows) {
              const n = r?.metadata?.batchId,
                i = r?.metadata?.primaryMediaId;
              if (i && n) {
                V.has(n) || V.set(n, a);
                let r = null;
                if (o.media && Array.isArray(o.media))
                  for (const e of o.media) {
                    const t = e?.image?.generatedImage?.fifeUrl;
                    if (t) {
                      r = t;
                      break;
                    }
                  }
                (Y.set(i, {
                  fifeUrl: r,
                  prompt: e,
                  promptIndex: a,
                  type: "image",
                  seed: t.seed,
                }),
                  kt(i, n),
                  zt("PREVIEW_READY", {
                    mediaId: i,
                    fifeUrl: r,
                    promptIndex: a,
                    prompt: e.substring(0, 60),
                    mediaType: "image",
                  }));
              }
            }
          return { success: !0 };
        } catch (e) {
          return (
            zt("LOG", {
              message: `⚠️ Request ${o + 1}/${s} failed: ${e.message}`,
              type: "warn",
            }),
            { success: !1, error: e.message }
          );
        }
      })(),
    ),
    u = (await Promise.allSettled(d)).filter(
      (e) => "rejected" === e.status || !1 === e.value?.success,
    ).length;
  return (
    u > 0 &&
      zt("LOG", {
        message: `⚠️ ${u}/${s} failed for prompt ${a + 1}`,
        type: "warn",
      }),
    { batchId: n, count: s, failed: u }
  );
}
async function St(e, t, a = null) {
  const r = Date.now(),
    o = a || e.map((e, t) => t);
  (ht(), (pt = t._autoChained || !1));
  const n = t.mode || "image";
  Kt("⚙️ Preparing batch...", "info");
  const s = await $e(e.length, n, t);
  if (!s.authorized)
    return s.banned
      ? void zt("BANNED", { message: s.reason })
      : (zt("LOG", { message: `🚫 ${s.reason}`, type: "error" }),
        void 0 !== s.remaining &&
          zt("LIMIT_REACHED", {
            message: s.reason,
            remaining: s.remaining || 0,
          }),
        void (
          s.serverDown &&
          zt("LOG", {
            message: "💡 Check your internet connection and try again.",
            type: "warn",
          })
        ));
  (Kt("✅ Ready to go", "success"),
    (f = !0),
    (w = {
      naming: t.naming || "numbered",
      namingPrefix: t.namingPrefix || "",
      namingSeparator:
        "string" == typeof t.namingSeparator ? t.namingSeparator : "-",
      startNumber: t.startNumber || 1,
      videoRatio: t.videoRatio || "landscape",
      speedMode: t.speedMode || "fast",
    }));
  const l = "video" === n,
    p = l ? t.videoCount || 1 : t.imageCount || 1,
    m = p > 1 ? ` × ${p}` : "",
    g = e.length * p;
  if (
    (Kt(
      `⚡ Generating ${g} ${l ? "video" : "image"}${g > 1 ? "s" : ""} from ${e.length} prompt${e.length > 1 ? "s" : ""}${m}`,
      "success",
    ),
    Kt("🔄 Connecting to Flow...", "info"),
    !c)
  )
    return (
      Kt("❌ No Flow tab found — open Google Flow and try again", "error"),
      _t("script_failed"),
      void (f = !1)
    );
  const h = await Qe(!0);
  if (!h)
    return (
      Kt("❌ Authentication failed — try refreshing the Flow page", "error"),
      _t("script_failed"),
      void (f = !1)
    );
  const _ = await Xe();
  if (!_)
    return (
      Kt("❌ No project open — create or open a project in Flow", "error"),
      _t("script_failed"),
      void (f = !1)
    );
  if (!(await Ze()))
    return (
      Kt(
        "❌ Security check failed — refresh the Flow page. Disable VPN if active.",
        "error",
      ),
      _t("recaptcha_blocked"),
      void (f = !1)
    );
  (Kt("✅ Connected", "success"),
    (lt = Date.now()),
    "image" === n
      ? await Mt(e, t, o, h, _)
      : "video" === n && (await Ct(e, t, o, h, _)),
    (dt = Date.now()),
    (gt = E.total));
  let y = 0;
  if ("video" === n) {
    const e = new Set(
        W.filter((e) => "video" === e.type).map((e) => e.promptIndex),
      ),
      t = new Set();
    for (const [e, a] of Y)
      "video" === a.type && void 0 !== a.promptIndex && t.add(a.promptIndex);
    y = Math.max(e.size, t.size);
  } else y = z.size;
  const I = e.length,
    A = I - y,
    T = Date.now() - r,
    v =
      T < 6e4
        ? `${(T / 1e3).toFixed(0)}s`
        : `${Math.floor(T / 6e4)}m ${Math.round((T % 6e4) / 1e3)}s`;
  if (
    (f || C || (ut = !0),
    f &&
      (A > 0 && y > 0
        ? Kt(
            `⚠️ Done — ${y}/${I} prompts succeeded, ${A} failed (${v})`,
            "warn",
          )
        : A > 0
          ? Kt(`❌ Failed — all ${I} prompts errored (${v})`, "error")
          : Kt(`✅ All ${I} prompts generated (${v})`, "success")),
    A > 0)
  ) {
    const e = new Set();
    if ("video" === n) {
      for (const t of W)
        "video" === t.type && void 0 !== t.promptIndex && e.add(t.promptIndex);
      for (const [, t] of Y)
        "video" === t.type && void 0 !== t.promptIndex && e.add(t.promptIndex);
    } else for (const t of z.keys()) e.add(t);
    const t = o
      .filter((t) => !e.has(t))
      .map((e) => "#" + String(e + 1).padStart(3, "0"));
    if (t.length > 0) {
      const e = "video" === n ? "Video" : "Image",
        a = 40;
      let r;
      ((r =
        t.length > a
          ? t.slice(0, a).join(", ") + `, +${t.length - a} more`
          : t.join(", ")),
        Kt(
          `❌ Failed ${e.toLowerCase()}${t.length > 1 ? "s" : ""}: ${r}`,
          "error",
        ));
    }
  }
  const b = Et();
  ((b.featureFlags = t.featureFlags || null),
    (b.uploadsThisSession = t.uploadsThisSession || 0),
    "video" === n &&
      (b.videoModelKey = Tt(
        t.videoMode || "text",
        t.videoQuality || "lite",
        t.videoRatio || "landscape",
        ie(ne),
        t.videoDuration || 8,
      )));
  const O = await Ge(y, A, b);
  if (
    (O?.ok &&
      (O.deducted > 0
        ? Kt(
            `📊 ${O.deducted} prompts deducted · ${O.remaining} remaining today`,
            "info",
          )
        : O.plan),
    zt("BATCH_GENERATION_DONE", {
      message: "All API requests completed",
      totalPrompts: I,
      successfulPrompts: y,
      failedPrompts: A,
      totalImages: E.total,
    }),
    c && E.total > 0)
  ) {
    const e = setInterval(() => {
      E.downloaded + E.failed >= E.total &&
        !Z &&
        (clearInterval(e), (d = null), (u = null), chrome.tabs.reload(c));
    }, 2e3);
    setTimeout(() => clearInterval(e), 3e5);
  }
  ((te = 0), (ae = 0), (f = !1));
}
async function Mt(e, t, a, r, o) {
  const n = t.imageCount || 1;
  ((te = e.length * n), (ae = 0));
  const i = {
      fast: { concurrent: 3, stagger: 100 },
      balanced: { concurrent: 2, stagger: 2e3 },
      slow: { concurrent: 1, stagger: 3e3 },
    },
    s = i[t.speedMode || "fast"] || i.fast,
    c = s.concurrent,
    l = s.stagger,
    d = [];
  for (let r = 0; r < e.length; r++) {
    const o = e[r],
      i = a[r],
      s = he(),
      c = ";" + Date.now() + r;
    (V.set(s, i),
      zt("LOG", {
        message: `🖊 #${r + 1} — "${o.substring(0, 50) + (o.length > 50 ? "..." : "")}"`,
        type: "info",
      }),
      zt("PROMPT_STATUS", { promptIndex: i, status: "running" }));
    for (let e = 0; e < n; e++) {
      const a = _e(),
        l = i,
        u = 250 * (r * n + e);
      d.push(async () => {
        if (!f) return { success: !1, promptIndex: l };
        if (C) return { success: !1, promptIndex: l, quotaHit: !0 };
        u > 0 && (await we(u));
        const e = await Qe(),
          r = await Xe();
        if (!e || !r) throw new Error("Missing auth/project");
        const n = `https://aisandbox-pa.googleapis.com/v1/projects/${r}/flowMedia:batchGenerateImages`,
          i = [];
        if ("mapped" === t.referenceMode) {
          const e = t.perPromptReferences?.[l];
          if (e && e.length > 0)
            for (const t of e)
              i.push({ imageInputType: "IMAGE_INPUT_TYPE_REFERENCE", name: t });
        } else if (
          t.imageReferenceMediaIds &&
          t.imageReferenceMediaIds.length > 0
        )
          for (const e of t.imageReferenceMediaIds)
            i.push({ imageInputType: "IMAGE_INPUT_TYPE_REFERENCE", name: e });
        const d = {
            clientContext: {
              recaptchaContext: {
                applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB",
                token: "PLACEHOLDER",
              },
              projectId: r,
              tool: "PINHOLE",
              sessionId: c,
            },
            mediaGenerationContext: { batchId: s },
            useNewMedia: !0,
            requests: [
              {
                clientContext: {
                  recaptchaContext: {
                    applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB",
                    token: "PLACEHOLDER",
                  },
                  projectId: r,
                  tool: "PINHOLE",
                  sessionId: c,
                },
                imageAspectRatio:
                  t.aspectRatio || "IMAGE_ASPECT_RATIO_LANDSCAPE",
                imageInputs: i,
                imageModelName: t.imageModel || "NARWHAL",
                seed: a,
                structuredPrompt: { parts: [{ text: o }] },
              },
            ],
          },
          p = await et(n, d, e, "IMAGE_GENERATION");
        if (p?.workflows)
          for (const e of p.workflows) {
            const t = e?.metadata?.batchId,
              r = e?.metadata?.primaryMediaId;
            if (r && t) {
              V.has(t) || V.set(t, l);
              let e = null;
              if (p.media && Array.isArray(p.media))
                for (const t of p.media) {
                  const a = t?.image?.generatedImage?.fifeUrl;
                  if (a) {
                    e = a;
                    break;
                  }
                }
              (Y.set(r, {
                fifeUrl: e,
                prompt: o,
                promptIndex: l,
                type: "image",
                seed: a,
              }),
                kt(r, t),
                zt("PREVIEW_READY", {
                  mediaId: r,
                  fifeUrl: e,
                  promptIndex: l,
                  prompt: o.substring(0, 60),
                  mediaType: "image",
                }));
            }
          }
        return { success: !0, promptIndex: l };
      });
    }
  }
  const u = new Map(),
    p = new Map(),
    m = d.map((e, r) => {
      const o = a[Math.floor(r / n)];
      return async () => {
        try {
          const t = await e();
          if (!1 === t?.success) return t;
          if (void 0 !== t?.promptIndex) {
            const e = t.promptIndex;
            (u.set(e, (u.get(e) || 0) + 1),
              u.get(e) >= n &&
                (zt("PROMPT_STATUS", { promptIndex: e, status: "submitted" }),
                zt("LOG", {
                  message: `✓ Prompt #${e + 1} complete (${n}/${n})`,
                  type: "success",
                })));
          }
        } catch (e) {
          if (
            (_t(yt(e.message)),
            It(e.message, {
              videoModelKey: "image:" + (t.imageModel || "unknown"),
            }),
            f && !le)
          ) {
            let t = e.message || "Unknown error";
            (t.includes("PUBLIC_ERROR_UNSAFE_GENERATION")
              ? (t = "Blocked by safety filter — try rewording the prompt")
              : t.includes("PUBLIC_ERROR_UNSAFE_IMAGE_UPLOAD")
                ? (t = "Reference image blocked by safety filter")
                : t.includes("reCAPTCHA blocked")
                  ? (t = "reCAPTCHA blocked — refresh Flow page or disable VPN")
                  : t.includes("Access denied")
                    ? (t = "Session expired — refresh Flow page")
                    : t.includes("Blocked by Google")
                      ? (t = "Blocked by Google — refresh Flow page")
                      : t.includes("Rejected (400)") ||
                        (t.includes("500")
                          ? (t = "Server error (500)")
                          : t.includes("429")
                            ? (t = "Rate limited (429)")
                            : t.includes("403")
                              ? (t = "Access denied (403) — refresh Flow page")
                              : t.length > 150 &&
                                (t = t.substring(0, 150) + "...")),
              zt("LOG", {
                message: `❌ Prompt #${o + 1} failed — ${t}`,
                type: "error",
              }));
          }
          if (
            (p.set(o, (p.get(o) || 0) + 1),
            (u.get(o) || 0) + p.get(o) >= n && f && !le)
          ) {
            const e = u.get(o) || 0;
            0 === e
              ? (zt("PROMPT_STATUS", { promptIndex: o, status: "failed" }),
                zt("LOG", {
                  message: `❌ Prompt #${o + 1} failed — all ${n} request(s) errored`,
                  type: "error",
                }))
              : (zt("PROMPT_STATUS", { promptIndex: o, status: "submitted" }),
                zt("LOG", {
                  message: `⚠️ Prompt #${o + 1} partial — ${e}/${n} succeeded`,
                  type: "warn",
                }));
          }
          throw e;
        }
      };
    });
  await bt(m, c, l);
}
async function Ct(e, t, a, r, o) {
  const n = {
      fast: { concurrent: 2, stagger: 1e3 },
      balanced: { concurrent: 1, stagger: 2e3 },
      slow: { concurrent: 1, stagger: 3e3 },
    },
    i = n[t.speedMode || "fast"] || n.fast,
    s = i.concurrent,
    l = i.stagger,
    d = t.videoCount || 1;
  ((te = e.length * d), (ae = 0));
  const u = [];
  for (let r = 0; r < e.length; r++) {
    const o = e[r],
      n = a[r],
      i = he(),
      s = ";" + Date.now() + r;
    (V.set(i, n),
      zt("LOG", {
        message: `🎬 #${r + 1} — "${o.substring(0, 50) + (o.length > 50 ? "..." : "")}"`,
        type: "info",
      }),
      zt("PROMPT_STATUS", { promptIndex: n, status: "running" }));
    for (let e = 0; e < d; e++) {
      const a = _e(),
        l = 250 * (r * d + e);
      u.push(async () => {
        if (!f) return { success: !1, promptIndex: n };
        if (C) return { success: !1, promptIndex: n, quotaHit: !0 };
        l > 0 && (await we(l));
        const r = await Qe(),
          u = await Xe();
        if (!r || !u) throw new Error("Missing auth/project");
        const p = t.videoRatio || "landscape",
          m = t.videoQuality || "lite",
          g = ie(ne),
          w = t.videoMode || "text",
          h = Tt(w, m, p, g, t.videoDuration || 8),
          _ = `https://aisandbox-pa.googleapis.com/v1/video:${vt(w)}`,
          y = {
            aspectRatio:
              "landscape" === p
                ? "VIDEO_ASPECT_RATIO_LANDSCAPE"
                : "VIDEO_ASPECT_RATIO_PORTRAIT",
            seed: a,
            metadata: {},
            textInput: { structuredPrompt: { parts: [{ text: o }] } },
            videoModelKey: h,
          };
        if ("start_frame" === w || "start_end_frame" === w)
          if ("mapped" === t.referenceMode) {
            const e = t.perPromptStartFrames?.[n];
            e &&
              (y.startImage = {
                mediaId: e,
                cropCoordinates: { top: 0, left: 0, bottom: 1, right: 1 },
              });
          } else
            t.startFrameMediaId &&
              (y.startImage = {
                mediaId: t.startFrameMediaId,
                cropCoordinates: { top: 0, left: 0, bottom: 1, right: 1 },
              });
        if ("start_end_frame" === w)
          if ("mapped" === t.referenceMode) {
            const e = t.perPromptEndFrames?.[n];
            e &&
              (y.endImage = {
                mediaId: e,
                cropCoordinates: { top: 0, left: 0, bottom: 1, right: 1 },
              });
          } else
            t.endFrameMediaId &&
              (y.endImage = {
                mediaId: t.endFrameMediaId,
                cropCoordinates: { top: 0, left: 0, bottom: 1, right: 1 },
              });
        if ("reference" === w)
          if ("mapped" === t.referenceMode) {
            const e = t.perPromptReferences?.[n];
            e &&
              e.length > 0 &&
              (y.referenceImages = e.map((e) => ({
                mediaId: e,
                imageUsageType: "IMAGE_USAGE_TYPE_ASSET",
              })));
          } else
            t.referenceMediaIds &&
              t.referenceMediaIds.length > 0 &&
              (y.referenceImages = t.referenceMediaIds.map((e) => ({
                mediaId: e,
                imageUsageType: "IMAGE_USAGE_TYPE_ASSET",
              })));
        const I = {
            mediaGenerationContext: {
              batchId: i,
              audioFailurePreference: "BLOCK_SILENCED_VIDEOS",
            },
            clientContext: {
              projectId: u,
              tool: "PINHOLE",
              recaptchaContext: {
                applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB",
                token: "PLACEHOLDER",
              },
              sessionId: s,
              userPaygateTier: ne || "PAYGATE_TIER_NOT_PAID",
            },
            requests: [y],
            useV2ModelConfig: !0,
          },
          A = await et(_, I, r, "VIDEO_GENERATION"),
          E = A?.media?.[0]?.name;
        if (!E) throw new Error("No mediaId in response");
        const T = A?.workflows?.[0]?.metadata?.batchId;
        T && !V.has(T) && V.set(T, n);
        const v = A?.workflows?.[0]?.name;
        Y.set(E, {
          fifeUrl: null,
          prompt: o,
          promptIndex: n,
          type: "video",
          workflowId: v,
        });
        let b = null,
          O = 0;
        for (let t = 0; t < 120; t++) {
          if (!f) return { success: !1, promptIndex: n };
          const a = Date.now();
          (await we(5e3), (ft += Date.now() - a));
          try {
            const a = await Qe();
            if (!a) {
              if ((O++, O >= 5))
                throw new Error(
                  "Polling failed — lost auth token after 5 consecutive failures",
                );
              continue;
            }
            const r = await chrome.scripting.executeScript({
                target: { tabId: c },
                world: "MAIN",
                func: async (e, t, a) => {
                  try {
                    const r = await fetch(
                      "https://aisandbox-pa.googleapis.com/v1/video:batchCheckAsyncVideoGenerationStatus",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "text/plain;charset=UTF-8",
                          Authorization: "Bearer " + a,
                        },
                        body: JSON.stringify({
                          media: [{ name: e, projectId: t }],
                        }),
                      },
                    );
                    if (!r.ok) {
                      const e = await r.text();
                      return {
                        error: "HTTP " + r.status,
                        errText: e.substring(0, 300),
                      };
                    }
                    return { success: !0, data: await r.json() };
                  } catch (e) {
                    return { error: e.message };
                  }
                },
                args: [E, u, a],
              }),
              o = r?.[0]?.result;
            if (!o || o.error) {
              O++;
              const e = o?.error || "Script execution failed";
              if (e.includes("429")) {
                const e = Math.min(1e4, 15e3);
                await we(e);
              }
              if (O >= 5)
                throw new Error(
                  `Polling failed after 5 consecutive errors: ${e}`,
                );
              continue;
            }
            O = 0;
            const i = o.data?.media?.[0],
              s = i?.mediaMetadata?.mediaStatus?.mediaGenerationStatus;
            if (
              "MEDIA_GENERATION_STATUS_COMPLETED" === s ||
              "MEDIA_GENERATION_STATUS_COMPLETE" === s ||
              "MEDIA_GENERATION_STATUS_SUCCESSFUL" === s
            ) {
              b = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${E}`;
              break;
            }
            if ("MEDIA_GENERATION_STATUS_FAILED" === s) {
              const e =
                i?.mediaMetadata?.mediaStatus?.failureReason ||
                i?.mediaMetadata?.mediaStatus?.errorMessage ||
                "unknown";
              throw (
                JSON.stringify(i?.mediaMetadata?.mediaStatus || {}).substring(
                  0,
                  300,
                ),
                new Error(`Google rejected video: ${e}`)
              );
            }
            t % 6 == 0 &&
              Kt(
                `⏳ Video #${String(n + 1).padStart(3, "0")}${d > 1 ? String.fromCharCode(97 + e) : ""} still generating... (${Math.round((5e3 * t) / 1e3)}s)`,
                "info",
              );
          } catch (e) {
            if (
              e.message.includes("Google rejected") ||
              e.message.includes("Polling failed")
            )
              throw e;
            if ((O++, O >= 5))
              throw new Error(
                `Polling crashed after 5 consecutive errors: ${e.message}`,
              );
          }
        }
        if (!b) throw new Error("Video generation timed out after 600s");
        const P = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${E}`;
        return (
          zt("PREVIEW_READY", {
            mediaId: E,
            fifeUrl: null,
            promptIndex: n,
            prompt: o.substring(0, 60),
            mediaType: "video",
            videoUrl: P,
            workflowId: v,
          }),
          Lt(b, E, n),
          { success: !0, promptIndex: n }
        );
      });
    }
  }
  const p = new Map(),
    m = new Map(),
    g = u.map((e, r) => {
      const o = Math.floor(r / d),
        n = a[o];
      return async () => {
        try {
          const t = await e();
          if (!1 === t?.success) {
            if (
              (m.set(n, (m.get(n) || 0) + 1),
              (p.get(n) || 0) + m.get(n) >= d && f && !le)
            ) {
              const e = p.get(n) || 0;
              e > 0
                ? (zt("PROMPT_STATUS", { promptIndex: n, status: "submitted" }),
                  Kt(`⚠️ Prompt #${n + 1} partial — ${e}/${d} videos`, "warn"))
                : zt("PROMPT_STATUS", { promptIndex: n, status: "failed" });
            }
            return t;
          }
          if (t?.success && void 0 !== t?.promptIndex) {
            const e = t.promptIndex;
            (p.set(e, (p.get(e) || 0) + 1),
              p.get(e) >= d &&
                (zt("PROMPT_STATUS", { promptIndex: e, status: "submitted" }),
                Kt(
                  `✅ Prompt #${e + 1} complete (${d}/${d} videos)`,
                  "success",
                )));
          }
          return t;
        } catch (e) {
          if (
            (It(e.message, { videoModelKey: t.videoQuality || "unknown" }),
            f && !le)
          ) {
            let t = e.message || "Unknown error";
            if (
              (t.includes("404") && t.includes("NOT_FOUND")) ||
              t.includes("Requested entity was not found")
            )
              throw (
                zt("STALE_REFERENCES", {
                  message:
                    "Some reference images are from a previous project and are no longer valid.",
                }),
                (f = !1),
                e
              );
            (t.includes("PUBLIC_ERROR_UNSAFE_GENERATION")
              ? (t = "Blocked by safety filter — try rewording the prompt")
              : t.includes("PUBLIC_ERROR_UNSAFE_IMAGE_UPLOAD")
                ? (t = "Reference image blocked by safety filter")
                : t.includes("Google rejected")
                  ? (t = "Generation failed by Google")
                  : t.includes("timed out")
                    ? (t = "Generation timed out")
                    : t.includes("Polling failed")
                      ? (t = "Lost connection during generation")
                      : t.includes("reCAPTCHA blocked")
                        ? (t = "reCAPTCHA blocked — refresh Flow page")
                        : t.includes("Rejected (400)") ||
                          (t.includes("429")
                            ? (t = "Rate limited (429)")
                            : t.includes("403")
                              ? (t = "Access denied — refresh Flow page")
                              : t.includes("500")
                                ? (t = "Server error (500)")
                                : t.length > 150 &&
                                  (t = t.substring(0, 150) + "...")),
              Kt(
                `❌ Video #${String(n + 1).padStart(3, "0")} failed — ${t}`,
                "error",
              ));
          }
          if (
            (m.set(n, (m.get(n) || 0) + 1),
            (p.get(n) || 0) + m.get(n) >= d && f && !le)
          ) {
            const e = p.get(n) || 0;
            0 === e
              ? zt("PROMPT_STATUS", { promptIndex: n, status: "failed" })
              : (zt("PROMPT_STATUS", { promptIndex: n, status: "submitted" }),
                Kt(`⚠️ Prompt #${n + 1} partial — ${e}/${d} videos`, "warn"));
          }
          throw e;
        }
      };
    });
  await bt(g, s, l);
}
function Rt(e, t, a, r, o, n) {
  e =
    (e || "turboflow")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 40) || "turboflow";
  const i = parseInt(o?.startNumber) || 1,
    s = String(t + (i - 1)).padStart(3, "0") + (a || "");
  switch (o?.naming || "numbered") {
    case "prompt":
      return `${e}/${(n || "image")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 30)
        .replace(/-+$/, "")}-${s}.${r}`;
    case "prefix":
      return `${e}/${(o?.namingPrefix || "img").replace(/[^a-zA-Z0-9_\-\.]/g, "-").replace(/[-_\.]+$/, "")}${"string" == typeof o?.namingSeparator ? o.namingSeparator : "-"}${s}.${r}`;
    default:
      return `${e}/${s}.${r}`;
  }
}
function kt(e, t) {
  if (K.has(e)) return;
  K.add(e);
  const a = V.get(t);
  if (void 0 === a)
    return void zt("LOG", {
      message: `⚠️ Unknown batchId ${t.substring(0, 8)}... — skipping`,
      type: "error",
    });
  z.has(a) || z.set(a, []);
  const r = z.get(a),
    o = r.length;
  r.push(e);
  const n = a + 1;
  let i = "";
  o > 0 && (i = String.fromCharCode(97 + o));
  const s = String(n).padStart(3, "0") + i;
  if (!_)
    return (
      E.total++,
      E.downloaded++,
      void zt("IMAGE_READY", { message: `🖼 #${s} generated`, stats: { ...E } })
    );
  const c = Y.get(e);
  (W.push({
    mediaId: e,
    promptIndex: a,
    fileNum: n,
    fileSuffix: i,
    type: "image",
    status: "pending",
    prompt: c?.prompt || "",
    namingSettings: w,
  }),
    E.total++,
    zt("IMAGE_READY", {
      message: `🖼 #${s} generated — downloading 2K`,
      stats: { ...E },
    }),
    Z || Vt());
}
function Lt(e, t, a) {
  if (
    (zt("LOG", {
      message: `📥 Video #${String(a + 1).padStart(3, "0")} queued for download`,
      type: "info",
    }),
    W.some((e) => e.mediaId === t && "video" === e.type))
  )
    return;
  K.add(t);
  const r = a + 1,
    o = String(r).padStart(3, "0"),
    n = Y.get(t);
  if (!y)
    return (
      E.total++,
      E.downloaded++,
      void zt("IMAGE_READY", { message: `🎬 #${o} generated`, stats: { ...E } })
    );
  (W.push({
    mediaId: t,
    videoUrl: e,
    promptIndex: a,
    fileNum: r,
    fileSuffix: "",
    type: "video",
    status: "pending",
    prompt: n?.prompt || "",
    namingSettings: w,
    workflowId: n?.workflowId || null,
    videoAspectRatio: w?.videoRatio || "landscape",
  }),
    E.total++,
    zt("IMAGE_READY", {
      message: `🎬 #${o} generated — downloading`,
      stats: { ...E },
    }),
    zt("LOG", {
      message: `📥 Queue now has ${W.length} items, worker running: ${Z}`,
      type: "info",
    }),
    Z || Vt());
}
function xt(e, t) {
  return new Promise((a, r) => {
    chrome.downloads.download(
      { url: e, filename: t, saveAs: !1, conflictAction: "uniquify" },
      (e) => {
        chrome.runtime.lastError
          ? r(new Error(chrome.runtime.lastError.message))
          : (re.set(e, t), a(e));
      },
    );
  });
}
function Nt(e) {
  return new Promise((t) => {
    (oe.set(e, () => {
      (re.delete(e), t());
    }),
      setTimeout(() => {
        oe.has(e) && (oe.delete(e), re.delete(e), t());
      }, 6e4));
  });
}
async function Dt(e, t, a) {
  const r = String(e.fileNum).padStart(3, "0") + (e.fileSuffix || ""),
    o = "video" === e.type ? "mp4" : "png",
    n = Rt(h, e.fileNum, e.fileSuffix, o, e.namingSettings, e.prompt);
  for (let e = 0; e < 15; e++) {
    try {
      if ("complete" === (await chrome.tabs.get(c)).status) break;
    } catch (e) {}
    await we(1e3);
  }
  ((e.status = "downloading"),
    q++,
    zt("DOWNLOAD_STARTED", { mediaId: e.mediaId }));
  try {
    "image" === e.type
      ? await Ut(e, r, n, t, a)
      : "video" === e.type && (await Bt(e, r, n, t, a));
  } catch (t) {
    e.retried
      ? ((e.status = "failed"),
        E.failed++,
        zt("LOG", { message: `❌ #${r} download failed`, type: "error" }),
        zt("DOWNLOAD_FAILED", { mediaId: e.mediaId }))
      : ((e.retried = !0),
        (e.status = "pending"),
        zt("LOG", { message: `⟳ #${r} retrying...`, type: "warn" }));
  }
  q--;
}
async function Ut(e, t, a, r, o) {
  let n = null,
    i = r;
  null === ce && (ce = "standard");
  const s = "4k" === I && !N,
    c = "standard" === I;
  if (s) {
    if (((n = await $t(e, t, i, o)), n?.success && n.base64))
      return (
        await jt(e, t, a, n.base64),
        void ((null !== ce && "standard" !== ce) || (ce = "4k"))
      );
    i = await Qe(!0);
  }
  if (!c && !R && ((n = await Gt(e, t, i, o)), n?.success && n.base64))
    return (
      await jt(e, t, a, n.base64),
      void (s
        ? "4k" === ce
          ? (ce = "4k_with_fallback")
          : (null !== ce && "standard" !== ce) || (ce = "4k_with_fallback")
        : (null !== ce && "standard" !== ce) || (ce = "2k"))
    );
  (await Ht(e, t, a),
    "4k" === ce
      ? (ce = "4k_with_fallback")
      : "2k" === ce
        ? (ce = "2k_with_fallback")
        : null === ce && (ce = "standard"));
}
async function $t(e, t, a, r) {
  let o = null,
    n = a;
  for (let a = 0; a <= 3; a++) {
    const i = Date.now() - L;
    if (i < x) {
      const e = x - i;
      await we(e);
    }
    if (((o = await at(e.mediaId, r, n, "4k")), o?.success))
      return ((x = 5e3), Q !== J && (Q = J), o);
    const s = o?.error || "",
      c = o?.status,
      l = s.includes("429"),
      d = s.includes("500"),
      u = 403 === c || s.includes("403"),
      p = s.includes("DAILY_QUOTA_REACHED") || s.includes("RESOURCE_EXHAUSTED"),
      m = s.includes("permission") || s.includes("PERMISSION_DENIED");
    if (u && m)
      return (
        (N = !0),
        Kt(
          "⚠️ 4K upscale requires Google AI Ultra — downloading in 2K instead",
          "warn",
        ),
        null
      );
    if (l && p)
      return (
        (N = !0),
        Kt(
          "⚠️ Your Google account's 4K upscale limit reached — switching to 2K",
          "warn",
        ),
        null
      );
    if (u) return null;
    if ((!l && !d) || 3 === a) break;
    if (l)
      ((L = Date.now()),
        k++,
        (x = Math.min(1.5 * x, 2e4)),
        1 !== Q && ((Q = 1), Kt("⏳ 4K rate limited — slowing down", "warn")),
        zt("LOG", {
          message: `🛑 4K upscale ${t} rate limited — cooldown ${(x / 1e3).toFixed(1)}s (${a + 1}/3)`,
          type: "warn",
        }));
    else {
      const e = 1500 * Math.pow(1.5, a) + 500 * Math.random();
      (zt("LOG", {
        message: `⏳ 4K upscale ${t} server error — retry in ${(e / 1e3).toFixed(1)}s (${a + 1}/3)`,
        type: "warn",
      }),
        await we(e));
    }
    n = await Qe(!0);
  }
  return null;
}
async function Gt(e, t, a, r) {
  let o = null,
    n = a;
  for (let a = 0; a <= 3; a++) {
    const i = Date.now() - S;
    if (i < M) {
      const e = M - i;
      await we(e);
    }
    if (((o = await at(e.mediaId, r, n, "2k")), o?.success))
      return ((M = 5e3), Q !== J && (Q = J), o);
    const s = o?.error || "",
      c = s.includes("429"),
      l = s.includes("500"),
      d = s.includes("DAILY_QUOTA_REACHED") || s.includes("RESOURCE_EXHAUSTED");
    if (c && d)
      return (
        (R = !0),
        Kt(
          "⚠️ Your Google account's 2K upscale limit reached — switching to standard quality",
          "warn",
        ),
        null
      );
    if ((!c && !l) || 3 === a) break;
    if (c)
      ((S = Date.now()),
        P++,
        (M = Math.min(1.5 * M, 2e4)),
        1 !== Q && ((Q = 1), Kt("⏳ Rate limited — slowing down", "warn")),
        zt("LOG", {
          message: `🛑 Upscale ${t} rate limited — global cooldown ${(M / 1e3).toFixed(1)}s (${a + 1}/3)`,
          type: "warn",
        }));
    else {
      const e = 1500 * Math.pow(1.5, a) + 500 * Math.random();
      (zt("LOG", {
        message: `⏳ Upscale ${t} server error — retry in ${(e / 1e3).toFixed(1)}s (${a + 1}/3)`,
        type: "warn",
      }),
        await we(e));
    }
    n = await Qe(!0);
  }
  return null;
}
async function Ft(e, t, a, r) {
  let o = a;
  for (let a = 0; a <= 3; a++) {
    const n = Date.now() - j;
    if (n < H) {
      const e = H - n;
      await we(e);
    }
    try {
      const t = await ot(
        e.mediaId,
        e.workflowId,
        r,
        o,
        e.videoAspectRatio || "landscape",
      );
      if (t?.upsampledMediaId) {
        H = 5e3;
        const a = await nt(t.upsampledMediaId, r, o, e.promptIndex);
        return a ? { success: !0, downloadUrl: a } : null;
      }
      return null;
    } catch (e) {
      const r = e.message || "",
        n = r.includes("429"),
        i = r.includes("500"),
        s =
          r.includes("DAILY_QUOTA_REACHED") || r.includes("RESOURCE_EXHAUSTED"),
        c = r.includes("403"),
        l = r.includes("permission") || r.includes("PERMISSION_DENIED");
      if ("_xY" === e.name) throw e;
      if (c && l)
        return (
          (B = !0),
          Kt(
            "⚠️ 4K video upscale requires Google AI Ultra — downloading in 1080p instead",
            "warn",
          ),
          null
        );
      if (n && s)
        return (
          (B = !0),
          Kt(
            "⚠️ Your Google account's 4K video upscale limit reached — switching to 1080p",
            "warn",
          ),
          null
        );
      if (c) return null;
      if ((!n && !i) || 3 === a) break;
      if (n)
        ((j = Date.now()),
          F++,
          (H = Math.min(1.5 * H, 3e4)),
          zt("LOG", {
            message: `🛑 4K video upscale ${t} rate limited — cooldown ${(H / 1e3).toFixed(1)}s (${a + 1}/3)`,
            type: "warn",
          }));
      else {
        const e = 5e3 * Math.pow(2, a) + 2e3 * Math.random();
        (zt("LOG", {
          message: `⏳ 4K video upscale ${t} server error — retry in ${(e / 1e3).toFixed(0)}s (${a + 1}/3)`,
          type: "warn",
        }),
          await we(e));
      }
      o = await Qe(!0);
    }
  }
  return null;
}
async function jt(e, t, a, r) {
  const o = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: (e) => {
        const t = atob(e),
          a = new Uint8Array(t.length);
        for (let e = 0; e < t.length; e++) a[e] = t.charCodeAt(e);
        return URL.createObjectURL(new Blob([a], { type: "image/png" }));
      },
      args: [r],
    }),
    n = o?.[0]?.result;
  if (!n) throw new Error("Failed to create blob URL");
  const i = await xt(n, a);
  (await Nt(i),
    chrome.scripting
      .executeScript({
        target: { tabId: c },
        world: "MAIN",
        func: (e) => URL.revokeObjectURL(e),
        args: [n],
      })
      .catch(() => {}),
    (e.status = "done"),
    E.downloaded++,
    zt("DOWNLOAD_COMPLETE", {
      message: `✅ #${t} saved (${((3 * r.length) / 4 / 1024 / 1024).toFixed(1)}MB)`,
      stats: { ...E },
      mediaId: e.mediaId,
    }));
}
async function Ht(e, t, a) {
  if (!e.mediaId) throw new Error("No mediaId available for standard download");
  Kt(`📥 #${t} downloading standard quality`, "info");
  const r = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${e.mediaId}`,
    o = await chrome.scripting.executeScript({
      target: { tabId: c },
      world: "MAIN",
      func: async (e) => {
        try {
          return await new Promise((t) => {
            const a = new Image();
            ((a.crossOrigin = "anonymous"),
              (a.onload = () => {
                try {
                  const e = document.createElement("canvas");
                  ((e.width = a.naturalWidth),
                    (e.height = a.naturalHeight),
                    e.getContext("2d").drawImage(a, 0, 0),
                    e.toBlob((e) => {
                      t(
                        e
                          ? { url: URL.createObjectURL(e), size: e.size }
                          : { error: "Canvas toBlob failed" },
                      );
                    }, "image/png"));
                } catch (e) {
                  t({ error: "Canvas error: " + e.message });
                }
              }),
              (a.onerror = () => {
                t({ error: "Image load failed" });
              }),
              (a.src = e));
          });
        } catch (e) {
          return { error: e.message };
        }
      },
      args: [r],
    }),
    n = o?.[0]?.result;
  if (!n?.url)
    throw new Error(
      "Failed to fetch standard image: " + (n?.error || "unknown"),
    );
  const i = await xt(n.url, a);
  (await Nt(i),
    chrome.scripting
      .executeScript({
        target: { tabId: c },
        world: "MAIN",
        func: (e) => URL.revokeObjectURL(e),
        args: [n.url],
      })
      .catch(() => {}),
    (e.status = "done"),
    E.downloaded++,
    zt("DOWNLOAD_COMPLETE", {
      message: `✅ #${t} saved (${(n.size / 1024 / 1024).toFixed(1)}MB)`,
      stats: { ...E },
      mediaId: e.mediaId,
    }));
}
async function Bt(e, t, a, r, o) {
  const n = "4k" === A && e.workflowId && !B,
    i = ("1080p" === A || "4k" === A) && e.workflowId && !$;
  let s = null,
    l = "720p";
  if (n) {
    const a = Date.now() - j;
    if (a < H) {
      const e = H - a;
      await we(e);
    }
    zt("LOG", {
      message: `🎬 Upscaling #${t} to 4K (this may take several minutes)...`,
      type: "info",
    });
    for (let e = 0; e < 30; e++) {
      try {
        if (!c) {
          await we(2e3);
          continue;
        }
        if ("complete" === (await chrome.tabs.get(c)).status) break;
      } catch (e) {}
      await we(1e3);
    }
    await we(5e3);
    try {
      const a = await Ft(e, t, r, o);
      a?.success && a.downloadUrl
        ? ((s = a.downloadUrl), (l = "4K"))
        : zt("LOG", {
            message: `⚠️ #${t} 4K upscale failed — trying 1080p`,
            type: "warn",
          });
    } catch (e) {
      if ("_xY" === e.name) throw e;
      zt("LOG", {
        message: `⚠️ #${t} 4K upscale error: ${e.message} — trying 1080p`,
        type: "warn",
      });
    }
  }
  if (s || !i || $) !s && "4k" === A && B && !$ && e.workflowId;
  else {
    const a = Date.now() - D;
    if (a < U) {
      const e = U - a;
      await we(e);
    }
    if (
      (zt("LOG", { message: `🎬 Upscaling #${t} to 1080p...`, type: "info" }),
      !n)
    ) {
      for (let e = 0; e < 30; e++) {
        try {
          if (!c) {
            await we(2e3);
            continue;
          }
          if ("complete" === (await chrome.tabs.get(c)).status) break;
        } catch (e) {}
        await we(1e3);
      }
      await we(5e3);
    }
    try {
      let a = null,
        n = await Qe(!0);
      for (let i = 0; i <= 3; i++)
        try {
          ((a = await rt(
            e.mediaId,
            e.workflowId,
            o,
            n || r,
            e.videoAspectRatio || "landscape",
          )),
            (U = 5e3),
            Q !== J && (Q = J));
          break;
        } catch (e) {
          const r = e.message || "",
            o = r.includes("429"),
            s = r.includes("500"),
            c =
              r.includes("DAILY_QUOTA_REACHED") ||
              r.includes("RESOURCE_EXHAUSTED");
          if ("_xY" === e.name) throw e;
          if (o && c) {
            (($ = !0),
              Kt(
                "⚠️ Your Google account's 1080p upscale limit reached — switching to 720p for remaining videos",
                "warn",
              ),
              (a = null));
            break;
          }
          if (
            (o &&
              ((D = Date.now()),
              G++,
              (U = Math.min(1.5 * U, 3e4)),
              1 !== Q &&
                ((Q = 1),
                Kt("⏳ Video upscale rate limited — slowing down", "warn")),
              zt("LOG", {
                message: `🛑 Video upscale ${t} rate limited — cooldown ${(U / 1e3).toFixed(1)}s (${i + 1}/3)`,
                type: "warn",
              })),
            (o || s) && i < 3)
          ) {
            const e = 5e3 * Math.pow(2, i) + 2e3 * Math.random();
            (zt("LOG", {
              message: `⏳ Video upscale retry ${i + 1}/3 in ${(e / 1e3).toFixed(0)}s...`,
              type: "warn",
            }),
              await we(e),
              (n = await Qe(!0)));
            continue;
          }
          throw e;
        }
      if (a?.upsampledMediaId) {
        const i = await nt(a.upsampledMediaId, o, n || r, e.promptIndex);
        i
          ? ((s = i), (l = "1080p"))
          : zt("LOG", {
              message: `⚠️ #${t} 1080p upscale polling failed — downloading 720p`,
              type: "warn",
            });
      }
    } catch (e) {
      if ("_xY" === e.name) throw e;
      zt("LOG", {
        message: `⚠️ #${t} 1080p upscale error: ${e.message} — downloading 720p`,
        type: "warn",
      });
    }
  }
  if (
    (s || ((s = e.videoUrl), s || (s = await it(e.mediaId, r)), (l = "720p")),
    !s)
  )
    throw new Error("No video URL");
  const d = await xt(s, a);
  (await Nt(d),
    (e.status = "done"),
    E.downloaded++,
    "4K" === l
      ? null === ce
        ? (ce = "4k_video")
        : "4k_video" !== ce && (ce = "4k_video_with_fallback")
      : "1080p" === l
        ? "4k_video" === ce
          ? (ce = "4k_video_with_fallback")
          : null === ce
            ? (ce = "1080p")
            : "1080p" !== ce && (ce = "1080p_with_fallback")
        : "4k_video" === ce
          ? (ce = "4k_video_with_fallback")
          : "1080p" === ce
            ? (ce = "1080p_with_fallback")
            : null === ce && (ce = "720p"),
    zt("DOWNLOAD_COMPLETE", {
      message: `✅ #${t} saved (${l})`,
      stats: { ...E },
      mediaId: e.mediaId,
    }));
}
async function Vt() {
  if (Z) return;
  Z = !0;
  let e = 0;
  for (;;) {
    const t = W.filter((e) => "pending" === e.status).sort(
      (e, t) => e.fileNum - t.fileNum,
    );
    if (0 === t.length) {
      (e++, await we(1e3));
      const t = E.downloaded + E.failed,
        a = E.total;
      if (a > 0 && t >= a && !f) break;
      if (!f && 0 === a && e > 10) break;
      if (f) {
        e = 0;
        continue;
      }
      if (e > 120) {
        zt("LOG", {
          message: `⏰ Downloads timed out — ${E.downloaded}/${E.total} saved`,
          type: "warn",
        });
        break;
      }
      continue;
    }
    if (((e = 0), !c)) {
      await we(1e3);
      continue;
    }
    const a = await Qe(),
      r = await Xe();
    if (!a || !r) {
      ((d = null), await we(2e3));
      continue;
    }
    const o = "4k" !== A || B ? Q : 1,
      n = Math.min(Q, o) - q;
    if (n <= 0) {
      await we(300);
      continue;
    }
    const i = Date.now() - S;
    if (i < M) {
      const e = M - i;
      await we(e);
      continue;
    }
    const s = t.slice(0, n);
    for (const e of s) (Dt(e, a, r), await we(300));
    zt("STATS_UPDATE", { stats: { ...E } });
  }
  for (; q > 0; ) await we(300);
  ((Z = !1),
    E.total > 0 &&
      Kt(
        `🏁 ${E.downloaded} image${1 !== E.downloaded ? "s" : ""} saved${E.failed > 0 ? ` · ${E.failed} failed` : ""}`,
        E.failed > 0 ? "warn" : "success",
      ),
    zt("STATS_UPDATE", { stats: { ...E } }));
}
function zt(e, t) {
  const a = {
    type: "FROM_BACKGROUND",
    subType: e,
    message: t.message || "",
    stats: t.stats || null,
    promptIndex: t.promptIndex,
    status: t.status,
    logType: t.type || "info",
    logLevel: t.level || "user",
    mediaId: t.mediaId || null,
    fifeUrl: t.fifeUrl || null,
    mediaType: t.mediaType || null,
    prompt: t.prompt || null,
    videoUrl: t.videoUrl || null,
    workflowId: t.workflowId || null,
    totalPrompts: t.totalPrompts,
    successfulPrompts: t.successfulPrompts,
    failedPrompts: t.failedPrompts,
    totalImages: t.totalImages,
  };
  chrome.runtime.sendMessage(a).catch(() => {});
}
function Kt(e, t = "info") {
  zt("LOG", { message: e, type: t, level: "user" });
}
function Yt(e, t = "info") {
  zt("LOG", { message: e, type: t, level: "debug" });
}
(chrome.downloads.onChanged.addListener((e) => {
  if (
    e.state &&
    ("complete" === e.state.current || "interrupted" === e.state.current)
  ) {
    const t = oe.get(e.id);
    t && (oe.delete(e.id), t());
  }
}),
  chrome.downloads.onDeterminingFilename.addListener((e, t) => {
    const a = re.get(e.id);
    t(
      a
        ? { filename: a, conflictAction: "uniquify" }
        : { filename: e.filename || "download", conflictAction: "uniquify" },
    );
  }),
  chrome.runtime.onMessage.addListener((e, a, r) => {
    if ("FLOW_PAGE_READY" === e.type) {
      const t = a?.tab;
      return (
        t && Ie(e.url || t.url)
          ? r({
              ok: !0,
              state: setFlowConnectionFromTab(t, {
                url: e.url || t.url,
                projectId: e.projectId,
              }),
            })
          : r({ ok: !1 }),
        !0
      );
    }
    if ("CHECK_CONNECTION" === e.type)
      return (
        (e.deep ? Ve() : ze())
          .then((e) => r({ state: e }))
          .catch((e) =>
            r({
              state: {
                status: "disconnected",
                lastError: e.message,
                lastCheck: Date.now(),
              },
            }),
          ),
        !0
      );
    if ("GET_CONNECTION_STATE" === e.type)
      return (r({ state: { ..._vD, _v5e: ne } }), !0);
    if ("SET_FINGERPRINT" === e.type)
      return (xe(e.fingerprint), r({ ok: !0 }), !0);
    if ("CLAIM_OFFER" === e.type)
      return (r({ ok: !1, error: "Account features removed" }), !0);
    if ("SIGN_IN" === e.type)
      return (
        e.fingerprint && xe(e.fingerprint),
        Ee()
          .then((e) => r({ ok: !0, user: e, plan: s }))
          .catch((e) => r({ ok: !1, error: e.message })),
        !0
      );
    if ("SIGN_OUT" === e.type) return (Te().then(() => r({ ok: !0 })), !0);
    if ("GET_AUTH_STATE" === e.type) return (r({ user: i, plan: s }), !0);
    if ("GET_PLAN" === e.type)
      return (s ? r({ plan: s }) : Se().then((e) => r({ plan: e })), !0);
    if ("REFRESH_PLAN" === e.type)
      return (Se(!0).then((e) => r({ plan: e })), !0);
    if ("GET_PORTAL_URL" === e.type)
      return (r({ ok: !1, error: "Account features removed" }), !0);
    if ("START_ACTIVATION_POLLING" === e.type) return (r({ ok: !0 }), !0);
    if ("STOP_ACTIVATION_POLLING" === e.type) return (We(), r({ ok: !0 }), !0);
    if ("GET_PREVIEWS" === e.type) {
      const e = [];
      for (const [t, a] of Y)
        e.push({
          mediaId: t,
          fifeUrl: a.fifeUrl,
          promptIndex: a.promptIndex,
          prompt: a.prompt?.substring(0, 60),
          type: a.type,
        });
      return (
        e.sort((e, t) => e.promptIndex - t.promptIndex),
        r({ previews: e }),
        !0
      );
    }
    if ("GET_FULL_STATE" === e.type) {
      const e = [];
      for (const [t, a] of Y) {
        const r = (z.get(a.promptIndex) || []).indexOf(t),
          o = r > 0 ? String.fromCharCode(97 + r) : "";
        e.push({
          mediaId: t,
          fifeUrl: a.fifeUrl,
          videoUrl:
            "video" === a.type
              ? `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t}`
              : null,
          promptIndex: a.promptIndex,
          prompt: a.prompt,
          type: a.type,
          workflowId: a.workflowId || null,
          suffix: o,
          seed: a.seed,
        });
      }
      return (
        r({ running: f, stats: { ...E }, items: e, downloadFolder: h, _vC: g }),
        !0
      );
    }
    if ("DOWNLOAD_SINGLE" === e.type) {
      const { mediaId: t, mediaType: a, promptIndex: o, folder: n } = e,
        i = n || h || "turboflow";
      return c
        ? ((async () => {
            try {
              const e = await Qe(),
                n = await Xe();
              if (!e || !n) throw new Error("Missing auth/project");
              const s = void 0 !== o ? o + 1 : 1;
              let l = "";
              if (z.has(o)) {
                const e = z.get(o).indexOf(t);
                e > 0 && (l = String.fromCharCode(97 + e));
              }
              const d = "video" === a ? "mp4" : "png",
                u = Y.get(t)?.prompt || "",
                p = Rt(i, s, l, d, w, u),
                m = String(s).padStart(3, "0") + l;
              if (
                (zt("LOG", {
                  message: `📥 Manual download: #${m}.${d}`,
                  type: "info",
                }),
                "video" === a)
              ) {
                const e = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t}`,
                  a = await xt(e, p);
                (await Nt(a),
                  zt("LOG", {
                    message: `✅ #${m}.${d} saved`,
                    type: "success",
                  }),
                  zt("DOWNLOAD_COMPLETE", {
                    message: `✓ ${m}.${d} saved manually`,
                    stats: { ...E },
                    mediaId: t,
                  }));
              } else {
                let a = await at(t, n, e);
                if (a?.success && a.base64) {
                  const e = await chrome.scripting.executeScript({
                      target: { tabId: c },
                      world: "MAIN",
                      func: (e) => {
                        const t = atob(e),
                          a = new Uint8Array(t.length);
                        for (let e = 0; e < t.length; e++)
                          a[e] = t.charCodeAt(e);
                        return URL.createObjectURL(
                          new Blob([a], { type: "image/png" }),
                        );
                      },
                      args: [a.base64],
                    }),
                    r = e?.[0]?.result;
                  if (!r) throw new Error("Failed to create blob URL");
                  const o = await xt(r, p);
                  (await Nt(o),
                    chrome.scripting
                      .executeScript({
                        target: { tabId: c },
                        world: "MAIN",
                        func: (e) => URL.revokeObjectURL(e),
                        args: [r],
                      })
                      .catch(() => {}));
                  const n = ((3 * a.base64.length) / 4 / 1024 / 1024).toFixed(
                    1,
                  );
                  (zt("LOG", {
                    message: `✅ #${m}.${d} (${n}MB 2K) saved`,
                    type: "success",
                  }),
                    zt("DOWNLOAD_COMPLETE", {
                      message: `✓ ${m}.${d} (${n}MB) saved manually`,
                      stats: { ...E },
                      mediaId: t,
                    }));
                } else {
                  const e = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t}`,
                    a = await chrome.scripting.executeScript({
                      target: { tabId: c },
                      world: "MAIN",
                      func: async (e) =>
                        await new Promise((t) => {
                          const a = new Image();
                          ((a.crossOrigin = "anonymous"),
                            (a.onload = () => {
                              try {
                                const e = document.createElement("canvas");
                                ((e.width = a.naturalWidth),
                                  (e.height = a.naturalHeight),
                                  e.getContext("2d").drawImage(a, 0, 0),
                                  e.toBlob((e) => {
                                    t(
                                      e
                                        ? {
                                            url: URL.createObjectURL(e),
                                            size: e.size,
                                          }
                                        : { error: "Canvas toBlob failed" },
                                    );
                                  }, "image/png"));
                              } catch (e) {
                                t({ error: "Canvas error: " + e.message });
                              }
                            }),
                            (a.onerror = () =>
                              t({ error: "Image load failed" })),
                            (a.src = e));
                        }),
                      args: [e],
                    }),
                    r = a?.[0]?.result;
                  if (!r?.url)
                    throw new Error(
                      "Standard download failed: " + (r?.error || "unknown"),
                    );
                  const o = await xt(r.url, p);
                  (await Nt(o),
                    chrome.scripting
                      .executeScript({
                        target: { tabId: c },
                        world: "MAIN",
                        func: (e) => URL.revokeObjectURL(e),
                        args: [r.url],
                      })
                      .catch(() => {}),
                    zt("LOG", {
                      message: `✅ #${m}.${d} (standard) saved`,
                      type: "success",
                    }),
                    zt("DOWNLOAD_COMPLETE", {
                      message: `✓ ${m}.${d} saved manually (standard)`,
                      stats: { ...E },
                      mediaId: t,
                    }));
                }
              }
              r({ ok: !0 });
            } catch (e) {
              (zt("LOG", {
                message: `❌ Manual download failed: ${e.message}`,
                type: "error",
              }),
                r({ ok: !1, error: e.message }));
            }
          })(),
          !0)
        : (r({ ok: !1, error: "No Flow tab" }), !0);
    }
    if ("DOWNLOAD_MULTIPLE" === e.type) {
      const { items: t, folder: a, quality: o } = e,
        n = a || h || "turboflow",
        i = "standard" === o,
        s = "4k" === o;
      if (!t || 0 === t.length) return (r({ ok: !1, error: "No items" }), !0);
      const l = i ? "standard" : "2K upscaled";
      return (
        zt("LOG", {
          message: `📥 Downloading ${t.length} items (${l}) → ${n}/ (${J}x parallel)`,
          type: "info",
        }),
        (async () => {
          if (!c)
            return void zt("LOG", { message: "❌ No Flow tab", type: "error" });
          const a = await Qe(),
            r = await Xe();
          if (!a || !r)
            return void zt("LOG", {
              message: "❌ Missing auth/project",
              type: "error",
            });
          const d = t.map((e) => {
            const t = void 0 !== e.promptIndex ? e.promptIndex : 0,
              a = t + 1;
            let r = "";
            if (z.has(t)) {
              const a = z.get(t).indexOf(e.mediaId);
              a > 0 && (r = String.fromCharCode(97 + a));
            }
            return {
              mediaId: e.mediaId,
              type: e.type || "image",
              promptIndex: t,
              fileNum: a,
              fileSuffix: r,
              status: "pending",
              workflowId: e.workflowId || null,
              isPortrait: e.isPortrait || !1,
            };
          });
          let u = 0,
            p = 0,
            m = 0;
          async function f(t) {
            const l = "video" === t.type ? "mp4" : "png",
              d = {
                naming: e.naming || "numbered",
                namingPrefix: e.namingPrefix || "",
                namingSeparator:
                  void 0 !== e.namingSeparator ? e.namingSeparator : "-",
              },
              f = Y.get(t.mediaId)?.prompt || "",
              g = Rt(n, t.fileNum, t.fileSuffix, l, d, f),
              w = String(t.fileNum).padStart(3, "0") + (t.fileSuffix || "");
            (m++, zt("DOWNLOAD_STARTED", { mediaId: t.mediaId }));
            try {
              if ("video" === t.type) {
                const n = e.videoQuality || o || "standard";
                let i = null,
                  s = "720p";
                if ("4k" === n) {
                  const o = Y.get(t.mediaId),
                    n = t.workflowId || o?.workflowId;
                  if (n) {
                    try {
                      zt("LOG", {
                        message: `🎬 Upscaling #${w} to 4K (this may take several minutes)...`,
                        type: "info",
                      });
                      const o = await ot(
                        t.mediaId,
                        n,
                        r,
                        a,
                        t.isPortrait
                          ? "portrait"
                          : e.videoAspectRatio || "landscape",
                      );
                      o?.upsampledMediaId &&
                        ((i = await nt(
                          o.upsampledMediaId,
                          r,
                          a,
                          t.promptIndex,
                        )),
                        i && (s = "4K"));
                    } catch (e) {
                      zt("LOG", {
                        message: `⚠️ 4K upscale failed: ${e.message} — trying 1080p`,
                        type: "warn",
                      });
                    }
                    if (!i)
                      try {
                        const o = await rt(
                          t.mediaId,
                          n,
                          r,
                          a,
                          t.isPortrait
                            ? "portrait"
                            : e.videoAspectRatio || "landscape",
                        );
                        o?.upsampledMediaId &&
                          ((i = await nt(
                            o.upsampledMediaId,
                            r,
                            a,
                            t.promptIndex,
                          )),
                          i && (s = "1080p"));
                      } catch (e) {}
                  } else
                    zt("LOG", {
                      message: `⚠️ #${w} cannot upscale to 4K — workflow ID missing (likely from older session). Downloading 720p.`,
                      type: "warn",
                    });
                } else if ("1080p" === n) {
                  const o = Y.get(t.mediaId),
                    n = t.workflowId || o?.workflowId;
                  if (n)
                    try {
                      zt("LOG", {
                        message: `🎬 Upscaling #${w} to 1080p...`,
                        type: "info",
                      });
                      const o = await rt(
                        t.mediaId,
                        n,
                        r,
                        a,
                        t.isPortrait
                          ? "portrait"
                          : e.videoAspectRatio || "landscape",
                      );
                      o?.upsampledMediaId &&
                        ((i = await nt(
                          o.upsampledMediaId,
                          r,
                          a,
                          t.promptIndex,
                        )),
                        i && (s = "1080p"));
                    } catch (e) {
                      zt("LOG", {
                        message: `⚠️ Upscale failed: ${e.message} — using 720p`,
                        type: "warn",
                      });
                    }
                }
                i ||
                  ((i = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t.mediaId}`),
                  (s = "720p"));
                const c = await xt(i, g);
                (await Nt(c),
                  u++,
                  zt("DOWNLOAD_COMPLETE", {
                    message: `✓ ${w}.${l} saved (${s})`,
                    stats: { ...E },
                    mediaId: t.mediaId,
                  }));
              } else if (i) {
                const e = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t.mediaId}`;
                for (let e = 0; e < 15; e++) {
                  try {
                    if ("complete" === (await chrome.tabs.get(c)).status) break;
                  } catch (e) {}
                  await we(1e3);
                }
                const a = await chrome.scripting.executeScript({
                    target: { tabId: c },
                    world: "MAIN",
                    func: async (e) =>
                      await new Promise((t) => {
                        const a = new Image();
                        ((a.crossOrigin = "anonymous"),
                          (a.onload = () => {
                            try {
                              const e = document.createElement("canvas");
                              ((e.width = a.naturalWidth),
                                (e.height = a.naturalHeight),
                                e.getContext("2d").drawImage(a, 0, 0),
                                e.toBlob((e) => {
                                  t(
                                    e
                                      ? {
                                          url: URL.createObjectURL(e),
                                          size: e.size,
                                        }
                                      : { error: "Canvas toBlob failed" },
                                  );
                                }, "image/png"));
                            } catch (e) {
                              t({ error: "Canvas error: " + e.message });
                            }
                          }),
                          (a.onerror = () => t({ error: "Image load failed" })),
                          (a.src = e));
                      }),
                    args: [e],
                  }),
                  r = a?.[0]?.result;
                if (!r?.url)
                  throw new Error(
                    "Standard download failed: " + (r?.error || "unknown"),
                  );
                const o = await xt(r.url, g);
                (await Nt(o),
                  chrome.scripting
                    .executeScript({
                      target: { tabId: c },
                      world: "MAIN",
                      func: (e) => URL.revokeObjectURL(e),
                      args: [r.url],
                    })
                    .catch(() => {}));
                const n = (r.size / 1024 / 1024).toFixed(1);
                (u++,
                  zt("DOWNLOAD_COMPLETE", {
                    message: `✅ #${w}.${l} saved (${n}MB standard)`,
                    stats: { ...E },
                    mediaId: t.mediaId,
                  }));
              } else {
                const e = s && !N ? "4k" : "2k",
                  o = "4k" === e ? Date.now() - L : Date.now() - S,
                  n = "4k" === e ? x : M;
                o < n && (await we(n - o));
                let i = a,
                  d = null,
                  p = "4k" === e ? N : R;
                if (!p)
                  for (let a = 0; a <= 3; a++) {
                    if (((d = await at(t.mediaId, r, i, e)), d?.success)) {
                      M = 5e3;
                      break;
                    }
                    const o = d?.error || "",
                      n = o.includes("429"),
                      s =
                        o.includes("DAILY_QUOTA_REACHED") ||
                        o.includes("RESOURCE_EXHAUSTED");
                    if (n && s) {
                      ("4k" === e
                        ? ((N = !0),
                          zt("LOG", {
                            message:
                              "🚫 4K upscale quota reached — falling back to 2K",
                            type: "warn",
                          }))
                        : ((R = !0),
                          zt("LOG", {
                            message:
                              "🚫 Upscale quota reached — remaining items will use standard quality",
                            type: "warn",
                          })),
                        (p = !0),
                        (d = null));
                      break;
                    }
                    const c = o.includes("403"),
                      l =
                        o.includes("permission") ||
                        o.includes("PERMISSION_DENIED");
                    if ("4k" === e && c && l) {
                      ((N = !0),
                        zt("LOG", {
                          message: "⚠️ 4K requires Google AI Ultra — using 2K",
                          type: "warn",
                        }),
                        (p = !0),
                        (d = null));
                      break;
                    }
                    if ((!n && !o.includes("500")) || 3 === a) break;
                    n &&
                      ("4k" === e
                        ? ((L = Date.now()), (x = Math.min(1.5 * x, 2e4)))
                        : ((S = Date.now()), (M = Math.min(1.5 * M, 2e4))));
                    const u = 2e3 * Math.pow(1.5, a) + 500 * Math.random();
                    (await we(u), (i = await Qe(!0)));
                  }
                if (d?.success && d.base64) {
                  const a = await chrome.scripting.executeScript({
                      target: { tabId: c },
                      world: "MAIN",
                      func: (e) => {
                        const t = atob(e),
                          a = new Uint8Array(t.length);
                        for (let e = 0; e < t.length; e++)
                          a[e] = t.charCodeAt(e);
                        return URL.createObjectURL(
                          new Blob([a], { type: "image/png" }),
                        );
                      },
                      args: [d.base64],
                    }),
                    r = a?.[0]?.result;
                  if (!r) throw new Error("Failed to create blob URL");
                  const o = await xt(r, g);
                  (await Nt(o),
                    chrome.scripting
                      .executeScript({
                        target: { tabId: c },
                        world: "MAIN",
                        func: (e) => URL.revokeObjectURL(e),
                        args: [r],
                      })
                      .catch(() => {}));
                  const n = ((3 * d.base64.length) / 4 / 1024 / 1024).toFixed(
                    1,
                  );
                  (u++,
                    zt("DOWNLOAD_COMPLETE", {
                      message: `✓ ${w}.${l} (${n}MB ${"4k" === e ? "4K" : "2K"})`,
                      stats: { ...E },
                      mediaId: t.mediaId,
                    }));
                } else {
                  const e = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t.mediaId}`,
                    a = await chrome.scripting.executeScript({
                      target: { tabId: c },
                      world: "MAIN",
                      func: async (e) =>
                        await new Promise((t) => {
                          const a = new Image();
                          ((a.crossOrigin = "anonymous"),
                            (a.onload = () => {
                              try {
                                const e = document.createElement("canvas");
                                ((e.width = a.naturalWidth),
                                  (e.height = a.naturalHeight),
                                  e.getContext("2d").drawImage(a, 0, 0),
                                  e.toBlob((e) => {
                                    t(
                                      e
                                        ? {
                                            url: URL.createObjectURL(e),
                                            size: e.size,
                                          }
                                        : { error: "Canvas toBlob failed" },
                                    );
                                  }, "image/png"));
                              } catch (e) {
                                t({ error: "Canvas error: " + e.message });
                              }
                            }),
                            (a.onerror = () =>
                              t({ error: "Image load failed" })),
                            (a.src = e));
                        }),
                      args: [e],
                    }),
                    r = a?.[0]?.result;
                  if (!r?.url)
                    throw new Error(
                      "Standard download failed: " + (r?.error || "unknown"),
                    );
                  const o = await xt(r.url, g);
                  (await Nt(o),
                    chrome.scripting
                      .executeScript({
                        target: { tabId: c },
                        world: "MAIN",
                        func: (e) => URL.revokeObjectURL(e),
                        args: [r.url],
                      })
                      .catch(() => {}),
                    u++,
                    zt("DOWNLOAD_COMPLETE", {
                      message: `✓ ${w}.${l} (standard)`,
                      stats: { ...E },
                      mediaId: t.mediaId,
                    }));
                }
              }
            } catch (e) {
              (p++,
                zt("LOG", {
                  message: `❌ #${String(t.fileNum).padStart(3, "0")}${t.fileSuffix || ""} failed: ${e.message}`,
                  type: "error",
                }),
                zt("DOWNLOAD_FAILED", { mediaId: t.mediaId }));
            }
            m--;
          }
          const g = Q;
          let w,
            h = 0;
          const _ = new Promise((e) => {
            w = e;
          });
          (await (async function e() {
            for (; h < d.length && m < g; )
              (f(d[h++]).then(() => {
                u + p >= d.length
                  ? (zt("LOG", {
                      message: `✅ Download complete: ${u} saved${p > 0 ? `, ${p} failed` : ""} (${l})`,
                      type: u > 0 ? "success" : "error",
                    }),
                    w())
                  : e();
              }),
                await we(300));
          })(),
            await _);
        })(),
        r({ ok: !0 }),
        !0
      );
    }
    if ("UPLOAD_IMAGE" === e.type)
      return (
        (async () => {
          try {
            const t = await tt(e.base64Data, e.fileName, e.mimeType);
            r({ ok: !0, mediaId: t });
          } catch (e) {
            (zt("LOG", {
              message: `❌ Upload failed: ${e.message}`,
              type: "error",
            }),
              r({ ok: !1, error: e.message }));
          }
        })(),
        !0
      );
    if ("GET_PAGE_STATE" === e.type)
      return c
        ? (chrome.tabs.sendMessage(c, { type: "GET_PAGE_STATE" }, (e) => r(e)),
          !0)
        : (r({ hasEditor: !1 }), !0);
    if ("GET_ALL_IMAGES" === e.type)
      return c
        ? (chrome.tabs.sendMessage(c, { type: "GET_ALL_IMAGES" }, (e) => r(e)),
          !0)
        : (r({ images: [] }), !0);
    if ("START_BATCH" === e.type) {
      const t = e.prompts || [],
        a = e.settings || {};
      ((h = a.folder || "flow-auto"),
        (_ = !1 !== a.autoDownloadImages),
        (y = !1 !== a.autoDownloadVideos),
        (I = a.imageDownloadQuality || "2k"),
        (A = a.videoDownloadQuality || "standard"));
      const o = e.promptIndexMap || t.map((e, t) => t),
        n = "video" === (a.mode || "image") ? 1 : a.imageCount || 1;
      return (
        (g = t.length * n),
        zt("LOG", {
          message: `📨 START_BATCH received: ${t.length} prompts, mode=${a.mode}, expecting ${g} total images`,
          type: "info",
        }),
        (E = { total: 0, downloaded: 0, failed: 0 }),
        (d = null),
        (u = null),
        V.clear(),
        z.clear(),
        K.clear(),
        Y.clear(),
        oe.clear(),
        (W.length = 0),
        (q = 0),
        (Z = !1),
        re.clear(),
        ee(a.speedMode || "fast"),
        (Q = J),
        (S = 0),
        (M = 5e3),
        (C = !1),
        (R = !1),
        (O = 0),
        (P = 0),
        (ue = 0),
        (fe = 0),
        (ge = null),
        (T = 0),
        (v = 0),
        (b = 3e3),
        (N = !1),
        (L = 0),
        (x = 5e3),
        (k = 0),
        (B = !1),
        (j = 0),
        (H = 5e3),
        (F = 0),
        (D = 0),
        (U = 5e3),
        ($ = !1),
        (G = 0),
        (ce = null),
        St(t, a, o).catch((e) => {
          (zt("LOG", {
            message: `💀 FATAL: _dG crashed: ${e.message}`,
            type: "error",
          }),
            zt("LOG", {
              message: `Stack: ${e.stack?.substring(0, 300)}`,
              type: "error",
            }),
            _t("script_failed"));
          const a = Et();
          (Ge(0, t.length, a).catch(() => {}), (f = !1));
        }),
        r({ ok: !0 }),
        !0
      );
    }
    if ("STOP_BATCH" === e.type)
      return (
        (f = !1),
        (C = !0),
        (ut = !0),
        _t("user_stopped"),
        zt("LOG", { message: "⏹ Stopped by user", type: "warn" }),
        r({ ok: !0 }),
        !0
      );
    if ("GET_STATS" === e.type)
      return (
        r({
          stats: { ...E },
          queueLength: W.filter((e) => "pending" === e.status).length,
          downloading: Z,
          isRunning: f,
          mappedBatches: V.size,
        }),
        !0
      );
    if ("DOWNLOAD_GALLERY_2K" === e.type) {
      if (!c) return (r({ results: [] }), !0);
      const t = e.mediaIds || [];
      return (
        (h = e.folder || h),
        (g = t.length),
        t.forEach((e, t) => {
          K.has(e) ||
            (K.add(e),
            W.push({
              mediaId: e,
              fileNum: t + 1,
              promptIndex: t,
              fileSuffix: "",
              type: "image",
              status: "pending",
            }),
            E.total++);
        }),
        Z || Vt(),
        r({ ok: !0, queued: t.length }),
        !0
      );
    }
    if ("API_INTERCEPTED" === e.type) {
      if (_vD._recovering) return;
      if (
        "VIDEO_GENERATE_RESPONSE" === e.eventType ||
        "VIDEO_STATUS_CHECK" === e.eventType
      )
        return;
      if (void 0 !== w?.videoRatio && f) return;
      if (
        "WORKFLOW_UPDATE" === e.eventType &&
        e.data?.metadata?.primaryMediaId
      ) {
        const t = e.data.metadata.primaryMediaId,
          a = e.data.metadata.batchId;
        if (a && t && !K.has(t)) {
          const e = Y.get(t);
          (e && "video" === e.type) || kt(t, a);
        }
      }
      if ("BATCH_GENERATE_RESPONSE" === e.eventType && e.data?.workflows)
        for (const t of e.data.workflows) {
          const e = t?.metadata?.batchId,
            a = t?.metadata?.primaryMediaId;
          if (e && a && !K.has(a)) {
            const t = Y.get(a);
            (t && "video" === t.type) || kt(a, e);
          }
        }
    }
    return !1;
  }),
  ve(),
  chrome.storage.local
    .get(["turboflowGoogleTier", "turboflowGoogleTierAt"])
    .then((e) => {
      e.turboflowGoogleTier &&
        (Date.now() - (e.turboflowGoogleTierAt || 0)) / 36e5 < 24 &&
        (ne = e.turboflowGoogleTier);
    })
    .catch(() => {}));
