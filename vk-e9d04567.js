const r = (e) => document.querySelector(e),
  o = (e) => document.querySelectorAll(e),
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
let s = null,
  i = null;
const l = {
  queue: [],
  batches: [],
  activeBatchId: null,
  gallery: [],
  mode: "image",
  singlePromptMode: !1,
  stripTagsOnSave: !1,
  speedMode: "fast",
  settings: {
    imageModel: "NARWHAL",
    imageRatio: "IMAGE_ASPECT_RATIO_LANDSCAPE",
    imageCount: 2,
    videoQuality: "lite",
    videoRatio: "landscape",
    videoMode: "text",
    videoCount: 1,
    videoDuration: 8,
    autoDownloadImages: !0,
    autoDownloadVideos: !0,
    imageDownloadQuality: "standard",
    videoDownloadQuality: "standard",
    folder: "turboflow",
    namingSeparator: "-",
    startNumber: 1,
  },
  startFrameMediaId: null,
  endFrameMediaId: null,
  referenceMediaIds: [],
  imageReferenceMediaIds: [],
  stats: { total: 0, downloaded: 0, failed: 0 },
  avgTimePerImage: null,
  batchStartTime: null,
  promptReferenceMap: {},
  promptStartFrameMap: {},
  promptEndFrameMap: {},
  referenceMode: "shared",
};
let d = [],
  c = null,
  p = !1,
  m = null;
const u = new Map(),
  g = new Set();
let f = !1,
  h = 0;
const b = new Set(),
  v = new Set();
let y = [],
  w = null,
  I = null,
  E = [],
  k = 10,
  M = null,
  $ = [],
  L = 0,
  x = !1,
  S = !0,
  _ = { all: 0, errors: 0, activity: 0 },
  P = "all",
  A = !1,
  T = null,
  C = null,
  R = 0,
  F = null,
  D = 0,
  N = !1,
  q = 0,
  O = !1,
  U = !1,
  B = !1,
  j = !1,
  G = !1,
  H = !1,
  Q = [],
  W = [],
  V = [],
  z = [],
  Y = null,
  K = [];
function J() {
  chrome.storage.local.set({
    flowAutoQueue: l.queue,
    flowAutoSettings: l.settings,
    flowAutoMode: l.mode,
    flowAutoRefMap: l.promptReferenceMap,
    flowAutoRefMode: l.referenceMode,
    flowAutoStartFrameMap: l.promptStartFrameMap,
    flowAutoEndFrameMap: l.promptEndFrameMap,
    flowAutoSinglePromptMode: l.singlePromptMode,
    flowAutoStripTagsOnSave: l.stripTagsOnSave,
    flowAutoSpeedMode: l.speedMode,
  });
}
function X() {
  chrome.storage.local.set({
    flowAutoBatches: l.batches,
    flowAutoAvgTime: l.avgTimePerImage,
  });
}
async function Z() {
  const e = await chrome.storage.local.get([
    "flowAutoQueue",
    "flowAutoSettings",
    "flowAutoMode",
    "flowAutoRefMap",
    "flowAutoRefMode",
    "flowAutoStartFrameMap",
    "flowAutoEndFrameMap",
    "flowAutoSinglePromptMode",
    "flowAutoStripTagsOnSave",
    "flowAutoSpeedMode",
    "flowAutoSlowMode",
  ]);
  if (
    (e.flowAutoQueue && (l.queue = e.flowAutoQueue),
    e.flowAutoMode &&
      ((l.mode = e.flowAutoMode),
      o("[data-mode]").forEach((e) =>
        e.classList.toggle("active", e.dataset.mode === l.mode),
      ),
      (r("#image-settings").style.display =
        "image" === l.mode ? "block" : "none"),
      (r("#video-settings").style.display =
        "video" === l.mode ? "block" : "none")),
    e.flowAutoSettings)
  ) {
    ((l.settings = { ...l.settings, ...e.flowAutoSettings }),
      (r("#setting-autodownload-images").checked =
        !1 !== l.settings.autoDownloadImages),
      (r("#setting-autodownload-videos").checked =
        !1 !== l.settings.autoDownloadVideos),
      (r("#setting-image-quality").value =
        l.settings.imageDownloadQuality || "2k"),
      (r("#setting-video-quality-dl").value =
        l.settings.videoDownloadQuality || "standard"),
      "IMAGEN_3_5" === l.settings.imageModel &&
        (l.settings.imageModel = "GEM_PIX_2"));
    const t = !1 !== l.settings.autoDownloadImages;
    ((r("#setting-image-quality-row").style.opacity = t ? "1" : "0.4"),
      (r("#setting-image-quality").disabled = !t));
    const a = !1 !== l.settings.autoDownloadVideos;
    ((r("#setting-video-quality-row").style.opacity = a ? "1" : "0.4"),
      (r("#setting-video-quality-dl").disabled = !a),
      (r("#setting-folder").value = l.settings.folder || "turboflow"),
      (r("#setting-image-model").value = l.settings.imageModel || "GEM_PIX_2"),
      (r("#setting-video-quality").value = l.settings.videoQuality || "fast"),
      (r("#setting-naming").value = l.settings.naming || "numbered"));
    const n = "prefix" === l.settings.naming;
    ((r("#setting-prefix-row").style.display = n ? "flex" : "none"),
      (r("#setting-separator-row").style.display = n ? "flex" : "none"),
      (r("#setting-separator").value =
        void 0 !== l.settings.namingSeparator
          ? l.settings.namingSeparator
          : "-"),
      (r("#setting-start-number").value = l.settings.startNumber || 1),
      o("[data-img-ratio]").forEach((e) =>
        e.classList.toggle(
          "active",
          e.dataset.imgRatio === l.settings.imageRatio,
        ),
      ),
      o("[data-img-count]").forEach((e) =>
        e.classList.toggle(
          "active",
          parseInt(e.dataset.imgCount) === l.settings.imageCount,
        ),
      ),
      o("[data-vid-ratio]").forEach((e) =>
        e.classList.toggle(
          "active",
          e.dataset.vidRatio === l.settings.videoRatio,
        ),
      ),
      o("[data-vid-count]").forEach((e) =>
        e.classList.toggle(
          "active",
          parseInt(e.dataset.vidCount) === (l.settings.videoCount || 1),
        ),
      ),
      o("[data-vid-duration]").forEach((e) =>
        e.classList.toggle(
          "active",
          parseInt(e.dataset.vidDuration) === (l.settings.videoDuration || 8),
        ),
      ),
      o("[data-vid-mode]").forEach((e) =>
        e.classList.toggle(
          "active",
          e.dataset.vidMode === (l.settings.videoMode || "text"),
        ),
      ),
      "quality" === l.settings.videoQuality &&
        (r('[data-vid-mode="reference"]')?.classList.add("locked"),
        "reference" === l.settings.videoMode &&
          ((l.settings.videoMode = "text"),
          o("[data-vid-mode]").forEach((e) =>
            e.classList.toggle("active", "text" === e.dataset.vidMode),
          ))),
      "video" === l.mode && Wn());
  }
  (e.flowAutoRefMap && (l.promptReferenceMap = e.flowAutoRefMap),
    e.flowAutoRefMode && (l.referenceMode = e.flowAutoRefMode),
    e.flowAutoStartFrameMap &&
      (l.promptStartFrameMap = e.flowAutoStartFrameMap),
    e.flowAutoEndFrameMap && (l.promptEndFrameMap = e.flowAutoEndFrameMap),
    void 0 !== e.flowAutoSinglePromptMode &&
      (l.singlePromptMode = e.flowAutoSinglePromptMode),
    void 0 !== e.flowAutoStripTagsOnSave &&
      (l.stripTagsOnSave = e.flowAutoStripTagsOnSave),
    void 0 !== e.flowAutoSpeedMode
      ? (l.speedMode = e.flowAutoSpeedMode)
      : void 0 !== e.flowAutoSlowMode &&
        ((l.speedMode = e.flowAutoSlowMode ? "slow" : "fast"),
        chrome.storage.local.set({ flowAutoSpeedMode: l.speedMode }),
        chrome.storage.local.remove("flowAutoSlowMode")));
  const t = await chrome.storage.local.get([
    "flowAutoBatches",
    "flowAutoAvgTime",
  ]);
  (t.flowAutoBatches &&
    ((l.batches = t.flowAutoBatches),
    l.batches.forEach((e) => {
      ("done" !== e.status && "partial" !== e.status) || (e.collapsed = !0);
    }),
    Sn()),
    t.flowAutoAvgTime && (l.avgTimePerImage = t.flowAutoAvgTime),
    Ia(),
    ka(),
    Ea(),
    "function" == typeof Ue && Ue(),
    "function" == typeof tr && tr(),
    "function" == typeof er && er(),
    "function" == typeof Qn && Qn());
  const a = document.querySelector("#single-prompt-toggle");
  a && (a.checked = l.singlePromptMode);
}
function ee() {
  const e = u,
    t = g;
  if (e.size > 3e3) {
    const a = [...e.entries()].sort(
      (e, t) => e[1].promptIndex - t[1].promptIndex,
    );
    a.slice(0, a.length - 3e3).forEach(([a]) => {
      (e.delete(a), t.delete(a));
    });
  }
  const a = [];
  for (const [t, n] of e) {
    let e = n.fifeUrl;
    (n.isPlaceholder ||
      "video" === n.type ||
      !t ||
      t.startsWith("placeholder-") ||
      (e = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t}`),
      a.push({
        mediaId: t,
        promptIndex: n.promptIndex,
        prompt: n.prompt || "",
        fifeUrl: e,
        videoUrl: n.videoUrl || null,
        status: n.status || "ready",
        type: n.type || "image",
        suffix: n.suffix || "",
        isPortrait: n.isPortrait || !1,
        ratioClass: n.ratioClass || null,
        isPlaceholder: n.isPlaceholder || !1,
        originalIndex: n.originalIndex,
        workflowId: n.workflowId || null,
        refThumbs: n.refThumbs || [],
        batchId: n.batchId || null,
        batchName: n.batchName || null,
      }));
  }
  chrome.storage.local.set({ turboflowGallery: a });
}
async function te() {
  const e = await chrome.storage.local.get("turboflowGallery");
  if (e.turboflowGallery && Array.isArray(e.turboflowGallery)) {
    for (const t of e.turboflowGallery) {
      if (!t.mediaId) continue;
      let e = t.fifeUrl || null;
      (t.isPlaceholder ||
        "video" === t.type ||
        !t.mediaId ||
        t.mediaId.startsWith("placeholder-") ||
        (e = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t.mediaId}`),
        u.set(t.mediaId, {
          mediaId: t.mediaId,
          promptIndex: t.promptIndex,
          prompt: t.prompt || "",
          fifeUrl: e,
          videoUrl: t.videoUrl || null,
          status: t.status || "ready",
          type: t.type || "image",
          isPlaceholder: t.isPlaceholder || !1,
          originalIndex: t.originalIndex,
          suffix: t.suffix || "",
          isPortrait: t.isPortrait || !1,
          ratioClass: t.ratioClass || null,
          workflowId: t.workflowId || null,
          refThumbs: t.refThumbs || [],
          batchId: t.batchId || null,
          batchName: t.batchName || null,
        }));
    }
    let t = -1;
    for (const [e, a] of u) a.promptIndex > t && (t = a.promptIndex);
    ((h = t + 1), Ba());
  }
}
function ae() {
  const e = y.filter((e) => !e.uploading);
  chrome.storage.local.set({ turboflowImageLibrary: e });
}
async function ne() {
  const e = await chrome.storage.local.get("turboflowImageLibrary");
  e.turboflowImageLibrary &&
    Array.isArray(e.turboflowImageLibrary) &&
    ((y = e.turboflowImageLibrary), kt());
}
function re() {
  chrome.storage.local.set({ turboflowMapperImages: K });
}
async function oe() {
  const e = await chrome.storage.local.get("turboflowMapperImages");
  e.turboflowMapperImages &&
    Array.isArray(e.turboflowMapperImages) &&
    (K = e.turboflowMapperImages);
}
function se(e) {
  const t = document.createElement("div");
  return ((t.textContent = e), t.innerHTML);
}
function ie(e) {
  return new Promise((t) => setTimeout(t, e));
}
function le(e, t = {}) {
  return;
}
function de() {
  return {
    usedMapper: O,
    usedAutoChain: U,
    usedTags: B,
    usedLibrary: j,
    usedVideo: G,
  };
}
function ce(e, t, a = 120, n = 0.7) {
  return new Promise((r) => {
    const o = new Image();
    ((o.onload = () => {
      const e = document.createElement("canvas");
      let t = o.width,
        s = o.height;
      (t > s
        ? t > a && ((s = Math.round((s * a) / t)), (t = a))
        : s > a && ((t = Math.round((t * a) / s)), (s = a)),
        (e.width = t),
        (e.height = s),
        e.getContext("2d").drawImage(o, 0, 0, t, s),
        r(e.toDataURL("image/jpeg", n)));
    }),
      (o.onerror = () => r(null)),
      (o.src = `data:${t};base64,${e}`));
  });
}
function pe(e) {
  return !!e && !["PAYGATE_TIER_NOT_PAID", "PAYGATE_TIER_ONE"].includes(e);
}
function me() {
  const e = [];
  (e.push(String(navigator.hardwareConcurrency || 0)),
    e.push(String(window.devicePixelRatio || 1)),
    e.push(String(navigator.maxTouchPoints || 0)));
  const t = navigator.userAgent || "";
  t.includes("Windows")
    ? e.push("Windows")
    : t.includes("Mac")
      ? e.push("Mac")
      : t.includes("CrOS")
        ? e.push("ChromeOS")
        : t.includes("Linux")
          ? e.push("Linux")
          : t.includes("Android")
            ? e.push("Android")
            : e.push("unknown");
  try {
    e.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown");
  } catch (t) {
    e.push("unknown");
  }
  e.push(String(screen.colorDepth || 0));
  try {
    const t = document.createElement("canvas");
    ((t.width = 200), (t.height = 50));
    const a = t.getContext("2d");
    ((a.textBaseline = "top"),
      (a.font = "14px Arial"),
      (a.fillStyle = "#f60"),
      a.fillRect(50, 0, 100, 50),
      (a.fillStyle = "#069"),
      a.fillText("TurboFlow:fp", 2, 15),
      (a.fillStyle = "rgba(102, 204, 0, 0.7)"),
      a.fillText("TurboFlow:fp", 4, 17),
      a.beginPath(),
      a.arc(50, 25, 20, 0, 2 * Math.PI),
      (a.fillStyle = "#a8c7fa"),
      a.fill());
    const n = t.toDataURL();
    let r = 0,
      o = 5381;
    for (let e = 0; e < n.length; e++) {
      const t = n.charCodeAt(e);
      ((r = (r << 5) - r + t), (r &= r), (o = ((o << 5) + o) ^ t), (o &= o));
    }
    e.push("c:" + (r >>> 0).toString(36) + ":" + (o >>> 0).toString(36));
  } catch (t) {
    e.push("canvas-error");
  }
  try {
    const t = document.createElement("canvas"),
      a = t.getContext("webgl") || t.getContext("experimental-webgl");
    if (a) {
      const t = a.getExtension("WEBGL_debug_renderer_info");
      (t
        ? (e.push(a.getParameter(t.UNMASKED_VENDOR_WEBGL) || ""),
          e.push(a.getParameter(t.UNMASKED_RENDERER_WEBGL) || ""))
        : (e.push(a.getParameter(a.VENDOR) || ""),
          e.push(a.getParameter(a.RENDERER) || "")),
        e.push(String(a.getParameter(a.MAX_TEXTURE_SIZE) || 0)),
        e.push(String(a.getParameter(a.MAX_RENDERBUFFER_SIZE) || 0)));
      const n = a.getExtension("WEBGL_lose_context");
      n && n.loseContext();
    } else e.push("webgl-unavailable");
  } catch (t) {
    e.push("webgl-error");
  }
  return e.join("|");
}
function ue() {
  const e = l.mode,
    t = l.settings.videoMode;
  return "video" === e && "text" === t
    ? "disabled"
    : "video" === e && "start_frame" === t
      ? "start_frame"
      : "video" === e && "start_end_frame" === t
        ? "start_end_frame"
        : "reference";
}
function ge() {
  return (
    Object.keys(l.promptReferenceMap).length > 0 ||
    Object.keys(l.promptStartFrameMap).length > 0 ||
    Object.keys(l.promptEndFrameMap).length > 0
  );
}
function fe(e) {
  return "mapped" === l.referenceMode
    ? l.promptReferenceMap[e] || []
    : l.imageReferenceMediaIds;
}
function he(e) {
  return "mapped" === l.referenceMode
    ? l.promptStartFrameMap[e] || null
    : l.startFrameMediaId;
}
function be() {
  ((l.promptReferenceMap = {}),
    (l.promptStartFrameMap = {}),
    (l.promptEndFrameMap = {}),
    (l.referenceMode = "shared"),
    (K = []),
    chrome.storage.local.remove([
      "flowAutoRefMap",
      "flowAutoRefMode",
      "turboflowMapperImages",
      "flowAutoStartFrameMap",
      "flowAutoEndFrameMap",
    ]),
    J());
}
function ve(e) {
  const t = K.find((t) => t.mediaId === e);
  if (t?.thumbnail) return t.thumbnail;
  const a = y.find((t) => t.mediaId === e);
  return a?.thumbnail
    ? a.thumbnail
    : void 0 !== La && La.has(e)
      ? La.get(e)
      : null;
}
function ye(e, t, a) {
  const n = {};
  for (const t of Object.values(e || {}))
    for (const e of t) {
      if (n[e]) continue;
      const t = ve(e);
      t && (n[e] = t);
    }
  for (const e of Object.values(t || {})) {
    if (!e || n[e]) continue;
    const t = ve(e);
    t && (n[e] = t);
  }
  for (const e of Object.values(a || {})) {
    if (!e || n[e]) continue;
    const t = ve(e);
    t && (n[e] = t);
  }
  return n;
}
async function we(e, t = {}) {
  const {
      maxConcurrent: a = 10,
      delayBetweenMs: n = 100,
      onProgress: r = null,
      onFileStart: o = null,
      uploadFn: s = null,
    } = t,
    i = new Array(e.length).fill(null);
  let l = 0,
    d = 0,
    c = 0,
    p = a,
    m = 0,
    u = n,
    g = 0;
  return new Promise((t) => {
    async function f(c) {
      const f = e[c];
      (d++, o && o(c, f.name));
      try {
        const e = s || _e,
          t = await e(f);
        ((i[c] = { success: !0, entry: t, fileName: f.name }),
          (m = 0),
          p < a &&
            Date.now() - g > 5e3 &&
            ((p = Math.min(p + 2, a)), (u = Math.max(u - 25, n))));
      } catch (e) {
        i[c] = { success: !1, error: e.message, fileName: f.name };
        const t = e.message || "",
          a =
            t.includes("Rejected by Google") ||
            t.includes("corrupted") ||
            t.includes("unsupported") ||
            t.includes("too large") ||
            t.includes("400") ||
            t.includes("INVALID_ARGUMENT"),
          n =
            t.includes("Script execution failed") ||
            t.includes("Cannot access") ||
            t.includes("No tab") ||
            t.includes("Frame with"),
          r =
            t.includes("429") ||
            t.includes("Rate limited") ||
            t.includes("quota");
        a ||
          (n
            ? ((p = Math.max(3, Math.floor(p / 2))),
              (u = Math.min(2 * u, 800)),
              (g = Date.now()),
              Te(
                `⚡ Upload concurrency reduced to ${p}x (Chrome overloaded)`,
                "warn",
              ))
            : r
              ? ((p = Math.max(2, Math.floor(0.6 * p))),
                (u = Math.min(2 * u, 1e3)),
                (g = Date.now()),
                Te(
                  `⏳ Upload concurrency reduced to ${p}x (rate limited)`,
                  "warn",
                ))
              : (m++,
                m >= 3 &&
                  ((p = Math.max(3, p - 2)),
                  (u = Math.min(1.5 * u, 600)),
                  (g = Date.now()))));
      }
      if ((d--, l++, r)) {
        const t = i[c];
        r(l, e.length, f.name, t.success);
      }
      (l >= e.length && (t(i), 1)) || h();
    }
    function h() {
      for (; c < e.length && d < p; )
        if ((f(c++), c < e.length && d < p)) return void setTimeout(h, u);
    }
    0 !== e.length ? h() : t(i);
  });
}
function Ie(e) {
  const t = (e || "").toLowerCase();
  return t.includes("public_error_minor_upload") ||
    t.includes("invalid_argument")
    ? "Rejected by Google — image may be corrupted, too large, or in an unsupported format. Try re-saving as JPG/PNG under 10MB."
    : t.includes("too large") ||
        t.includes("payload too large") ||
        t.includes("413")
      ? "Image file is too large. Resize or compress it and try again."
      : t.includes("unsupported") ||
          t.includes("invalid mime") ||
          t.includes("invalid image")
        ? "Unsupported image format. Use JPG, PNG, or WebP."
        : t.includes("permission") ||
            t.includes("forbidden") ||
            t.includes("403")
          ? "Access denied — your Flow session may have expired. Refresh the Flow page."
          : t.includes("401") || t.includes("unauthorized")
            ? "Session expired — refresh the Flow page and try again."
            : t.includes("429") || t.includes("rate") || t.includes("quota")
              ? "Rate limited — too many uploads. Wait a moment and try again."
              : t.includes("500") || t.includes("502") || t.includes("503")
                ? "Google server error — try again in a few seconds."
                : t.includes("failed to fetch") ||
                    t.includes("networkerror") ||
                    t.includes("network")
                  ? "Network error — check your internet connection and try again."
                  : t.includes("timeout")
                    ? "Upload timed out — check your connection and try again."
                    : t.includes("extension context invalidated") ||
                        t.includes("could not establish connection")
                      ? "Extension disconnected — reload the extension and try again."
                      : e.substring(0, 120).replace(/\{.*$/s, "").trim() ||
                        "Upload failed — unknown error.";
}
let Ee = null;
async function ke() {
  Me();
}
function Me() {
  Ee = null;
  const e = r("#announcement-bar");
  e && (e.style.display = "none");
}
async function $e() {
  if (!Ee) return;
  le("announcement_dismissed", {
    announcement_id: Ee.id,
    announcement_type: Ee.type,
    time_visible_ms: void 0 !== Ze && Ze ? Date.now() - Ze : null,
  });
  const e = await chrome.storage.local.get("turboflowDismissedAnns"),
    t = Array.isArray(e.turboflowDismissedAnns) ? e.turboflowDismissedAnns : [];
  (t.includes(Ee.id) ||
    (t.push(Ee.id),
    await chrome.storage.local.set({ turboflowDismissedAnns: t })),
    Me());
}
function Le(e, t) {
  if (!e || !t) return 0;
  const a = e.split(".").map(Number),
    n = t.split(".").map(Number);
  for (let e = 0; e < 3; e++) {
    const t = a[e] || 0,
      r = n[e] || 0;
    if (t < r) return -1;
    if (t > r) return 1;
  }
  return 0;
}
function xe() {
  try {
    return chrome.runtime.getManifest().version;
  } catch (e) {
    return "0.0.0";
  }
}
function Se() {
  const e = document.getElementById("version-badge");
  if (!e) return;
  const t = xe();
  e.textContent = "v" + t;
}
async function _e(e) {
  if (K.length >= 500)
    throw new Error(
      "Mapper image limit reached (500). Save mapping and start a new batch.",
    );
  const t = await Vn(e),
    a = await ce(t, e.type, 30, 0.5);
  if (!a) throw new Error('Failed to create thumbnail for "' + e.name + '"');
  let n = null;
  for (let r = 0; r <= 3; r++)
    try {
      const o = await chrome.runtime.sendMessage({
        type: "UPLOAD_IMAGE",
        base64Data: t,
        fileName: e.name,
        mimeType: e.type || "image/jpeg",
      });
      if (!o.ok) {
        const t = o.error || "Upload failed";
        if (
          t.includes("400") ||
          t.includes("INVALID_ARGUMENT") ||
          t.includes("INVALID_REQUEST") ||
          t.includes("Bad request") ||
          t.includes("unsupported") ||
          t.includes("too large")
        )
          throw new Error(t);
        if (
          (t.includes("Failed to fetch") ||
            t.includes("NetworkError") ||
            t.includes("network") ||
            t.includes("timeout") ||
            t.includes("Script execution failed") ||
            t.includes("429") ||
            t.includes("500") ||
            t.includes("502") ||
            t.includes("503")) &&
          r < 3
        ) {
          n = t;
          const a = 1500 * Math.pow(1.5, r) + 500 * Math.random();
          (Te(
            `⟳ Upload "${e.name}" failed — retry ${r + 1}/3 in ${(a / 1e3).toFixed(1)}s`,
            "warn",
          ),
            await ie(a));
          continue;
        }
        throw new Error(t);
      }
      const s = {
        id:
          "map-" +
          Date.now() +
          "-" +
          Math.random().toString(36).substring(2, 7),
        mediaId: o.mediaId,
        fileName: e.name,
        thumbnail: a,
        mimeType: e.type || "image/jpeg",
      };
      return (K.push(s), re(), s);
    } catch (t) {
      n = t.message || String(t);
      const a =
          n.includes("Extension context invalidated") ||
          n.includes("Could not establish connection") ||
          n.includes("Receiving end does not exist"),
        o =
          n.includes("400") ||
          n.includes("INVALID_ARGUMENT") ||
          n.includes("INVALID_REQUEST") ||
          n.includes("Bad request") ||
          n.includes("unsupported") ||
          n.includes("too large");
      if (a || o) throw new Error(Ie(n));
      if (r < 3) {
        const t = 1500 * Math.pow(1.5, r) + 500 * Math.random();
        (Te(
          `⟳ Upload "${e.name}" error — retry ${r + 1}/3 in ${(t / 1e3).toFixed(1)}s`,
          "warn",
        ),
          await ie(t));
        continue;
      }
    }
  throw new Error(Ie(n || "Upload failed after 3 retries"));
}
const Pe = r("#log-list");
function Ae(e) {
  return "error" === e || "warn" === e ? "error" : "activity";
}
function Te(e, t = "info", a = "user") {
  if ("debug" === a && !A) return;
  const n = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    o = document.createElement("div"),
    s = Ae(t);
  ((o.className = `log-entry log-${t}`),
    (o.dataset.logCategory = s),
    (o.dataset.logLevel = a),
    (o.innerHTML = `<span class="log-time">${n}</span><span class="log-msg">${se(e)}</span>`),
    "all" !== P && P !== s && o.classList.add("log-hidden"));
  const i = (r("#log-search")?.value || "").toLowerCase();
  if (
    (i && !e.toLowerCase().includes(i) && o.classList.add("log-hidden"),
    Pe.appendChild(o),
    _.all++,
    "error" === s ? _.errors++ : _.activity++,
    Ce(),
    S && (Pe.scrollTop = Pe.scrollHeight),
    Pe.children.length > 2200)
  ) {
    for (let e = 0; e < 200 && Pe.firstChild; e++) {
      const e = Pe.firstChild,
        t = e?.dataset?.logCategory;
      (Pe.removeChild(e), _.all--, "error" === t ? _.errors-- : _.activity--);
    }
    Ce();
  }
}
function Ce() {
  const e = r("#lfc-all"),
    t = r("#lfc-errors"),
    a = r("#lfc-activity");
  (e && (e.textContent = _.all),
    t && (t.textContent = _.errors),
    a && (a.textContent = _.activity));
}
function Re(e) {
  P = e;
  const t = (r("#log-search")?.value || "").toLowerCase();
  Pe.querySelectorAll(".log-entry").forEach((a) => {
    const n = a.dataset.logCategory,
      r = a.dataset.logLevel,
      o = a.querySelector(".log-msg")?.textContent?.toLowerCase() || "",
      s = "all" === e || e === n,
      i = !t || o.includes(t),
      l = "debug" !== r || A;
    a.classList.toggle("log-hidden", !s || !i || !l);
  });
}
(r("#btn-clear-logs").addEventListener("click", () => {
  ((Pe.innerHTML = ""),
    (_ = { all: 0, errors: 0, activity: 0 }),
    Ce(),
    Te("Logs cleared", "info"));
}),
  o("[data-log-filter]").forEach((e) => {
    e.addEventListener("click", () => {
      (o("[data-log-filter]").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        Re(e.dataset.logFilter));
    });
  }),
  r("#log-search")?.addEventListener("input", () => {
    Re(P);
  }),
  r("#btn-autoscroll")?.addEventListener("click", () => {
    ((S = !S),
      r("#btn-autoscroll").classList.toggle("active", S),
      S && (Pe.scrollTop = Pe.scrollHeight));
  }),
  r("#btn-export-logs")?.addEventListener("click", async () => {
    const e = Pe.querySelectorAll(".log-entry"),
      t = [];
    e.forEach((e) => {
      const a = e.querySelector(".log-time")?.textContent || "",
        n = e.querySelector(".log-msg")?.textContent || "",
        r = e.classList.contains("log-error")
          ? "ERROR"
          : e.classList.contains("log-warn")
            ? "WARN"
            : e.classList.contains("log-success")
              ? "OK"
              : "INFO";
      t.push(`[${a}] [${r}] ${n}`);
    });
    const a = t.join("\n");
    try {
      await navigator.clipboard.writeText(a);
      const e = r("#btn-export-logs"),
        n = e.querySelector(".material-symbols-outlined");
      ((n.textContent = "check"),
        e.classList.add("active"),
        setTimeout(() => {
          ((n.textContent = "content_copy"), e.classList.remove("active"));
        }, 2e3),
        Te(`📋 ${t.length} log entries copied to clipboard`, "success"));
    } catch (e) {
      const t = new Blob([a], { type: "text/plain" }),
        n = URL.createObjectURL(t),
        r = document.createElement("a");
      ((r.href = n),
        (r.download = `turboflow-logs-${Date.now()}.txt`),
        r.click(),
        URL.revokeObjectURL(n),
        Te("📄 Logs exported as file", "success"));
    }
  }),
  Pe.addEventListener("scroll", () => {
    S &&
      (Pe.scrollHeight - Pe.scrollTop - Pe.clientHeight < 30 ||
        ((S = !1), r("#btn-autoscroll")?.classList.remove("active")));
  }));
const Fe = r("#status-badge");
function De(a, n, o = 5e3) {
  const s = r("#status-badge");
  ((s.textContent = a),
    (s.className = n),
    (e = !0),
    t && clearTimeout(t),
    (t = setTimeout(() => {
      ((e = null), (t = null), T && Ne(T));
    }, o)));
}
function Ne(t) {
  if (!t) return;
  if (
    ((T = t),
    t.googlePaygateTier &&
      t.googlePaygateTier !== F &&
      ((F = t.googlePaygateTier), Ue(), "function" == typeof Qn && Qn()),
    e)
  )
    return;
  const a = r("#status-badge"),
    n = r("#sc-tab"),
    o = r("#sc-project"),
    s = r("#status-error-msg"),
    i = !r("#btn-stop").disabled;
  switch (t.status) {
    case "connected":
      i
        ? ((a.textContent = "Running"), (a.className = "badge badge-running"))
        : ((a.textContent = "Connected"),
          (a.className = "badge badge-connected"));
      break;
    case "connecting":
      ((a.textContent = "Connecting..."),
        (a.className = "badge badge-connecting"));
      break;
    default:
      ((a.textContent = "Disconnected"),
        (a.className = "badge badge-disconnected"));
  }
  function l(e, t, a) {
    e &&
      (a
        ? ((e.textContent = "sync"),
          (e.className = "material-symbols-outlined status-check-icon loading"))
        : t
          ? ((e.textContent = "check_circle"),
            (e.className = "material-symbols-outlined status-check-icon ok"))
          : ((e.textContent = "cancel"),
            (e.className =
              "material-symbols-outlined status-check-icon fail")));
  }
  const d = "connecting" === t.status;
  (l(n, !!t.flowTabId),
    l(o, t.hasProject, d && !!t.flowTabId),
    t.lastError && "connected" !== t.status
      ? ((s.textContent = "💡 " + t.lastError), (s.style.display = "block"))
      : (s.style.display = "none"));
}
function qe() {
  async function e() {
    try {
      const t = await chrome.runtime.sendMessage({
        type: "CHECK_CONNECTION",
        deep: !1,
      });
      if (t?.state) {
        Ne(t.state);
        const a = "connected" === t.state.status ? 1e4 : 3e3;
        a !== R && ((R = a), clearInterval(C), (C = setInterval(e, R)));
      }
    } catch (e) {}
  }
  (C && clearInterval(C), (R = 3e3), (C = setInterval(e, 3e3)), e());
}
async function Oe() {
  try {
    const e = await chrome.runtime.sendMessage({
      type: "CHECK_CONNECTION",
      deep: !0,
    });
    if (e?.state) {
      if ((Ne(e.state), "connected" === e.state.status)) return !0;
      const t = !!e.state.flowTabId,
        a = e.state.hasProject;
      return (
        t
          ? a ||
            Gn({
              icon: "📂",
              title: "No Project Open",
              message:
                "Flow is open but you need to <strong>create or open a project</strong> first.",
              hint: 'Go to your Flow tab and create a new project or open an existing one. The status badge will update to "Connected" automatically.',
            })
          : Gn({
              icon: "🔌",
              title: "Not Connected to Flow",
              message:
                "You need an open <strong>Google Flow</strong> tab to generate images.",
              hint: '<strong>Step 1:</strong> Open <a href="https://labs.google/fx/tools/flow" target="_blank" style="color:#a8c7fa">labs.google/fx/tools/flow</a><br>\n                           <strong>Step 2:</strong> Sign in with Google if Flow asks<br>\n                           <strong>Step 3:</strong> Create or open a project<br>\n                           <strong>Step 4:</strong> Wait for the status badge to show "Connected"',
            }),
        !1
      );
    }
  } catch (e) {}
  return !1;
}
function Ue() {
  const e = !0,
    t = pe(F),
    a = !1 !== l.settings.autoDownloadImages,
    n = e && t && a,
    o = r("#setting-image-quality"),
    s = o?.querySelector('option[value="4k"]');
  if (s) {
    if (((s.disabled = !n), n)) s.textContent = "4K Upscale ⭐";
    else {
      let n = "";
      (e
        ? t
          ? a || (n = "Enable auto-download")
          : (n = "Google AI Ultra required")
        : (n = "Google account tier required"),
        (s.textContent = "4K Upscale 🔒 " + n));
    }
    n ||
      "4k" !== l.settings.imageDownloadQuality ||
      ((l.settings.imageDownloadQuality = "2k"), (o.value = "2k"), J());
  }
  const d = r("#dl-quality-4k");
  d &&
    (n
      ? ((d.style.display = "flex"),
        (d.disabled = !1),
        (d.style.opacity = "1"),
        (d.style.cursor = "pointer"))
      : ((d.style.display = "flex"),
        (d.disabled = !0),
        (d.style.opacity = "0.4"),
        (d.style.cursor = "not-allowed")));
  const c = r('[data-preview-quality="4k"]');
  c &&
    (n
      ? ((c.style.display = "flex"),
        (c.disabled = !1),
        (c.style.opacity = "1"),
        (c.style.cursor = "pointer"))
      : ((c.style.display = "flex"),
        (c.disabled = !0),
        (c.style.opacity = "0.4"),
        (c.style.cursor = "not-allowed")));
  const p = !1 !== l.settings.autoDownloadVideos,
    m = e && t && p,
    u = r("#setting-video-quality-dl"),
    g = u?.querySelector('option[value="4k"]');
  if (g) {
    if (((g.disabled = !m), m))
      g.textContent = "4K Upscale ⭐ Very slow (one at a time)";
    else {
      let a = "";
      (e
        ? t
          ? p || (a = "Enable auto-download")
          : (a = "Google AI Ultra required")
        : (a = "Google account tier required"),
        (g.textContent = "4K Upscale ⚠️ Very slow 🔒 " + a));
    }
    m ||
      "4k" !== l.settings.videoDownloadQuality ||
      ((l.settings.videoDownloadQuality = "standard"),
      (u.value = "standard"),
      J());
  }
  const f = e && t,
    h = r("#dl-quality-video-4k");
  if (h)
    if (f)
      ((h.disabled = !1),
        (h.style.opacity = "1"),
        (h.style.cursor = "pointer"),
        (h.title = ""));
    else {
      ((h.disabled = !0),
        (h.style.opacity = "0.4"),
        (h.style.cursor = "not-allowed"));
      let a = "";
      (e
        ? t || (a = "Google AI Ultra required")
        : (a = "Google account tier required"),
        (h.title = a));
    }
  const b = r('[data-preview-quality="video-4k"]');
  if (b)
    if (f)
      ((b.disabled = !1),
        (b.style.opacity = "1"),
        (b.style.cursor = "pointer"),
        (b.title = ""));
    else {
      ((b.disabled = !0),
        (b.style.opacity = "0.4"),
        (b.style.cursor = "not-allowed"));
      let a = "";
      (e
        ? t || (a = "Google AI Ultra required")
        : (a = "Google account tier required"),
        (b.title = a));
    }
  const v = e && t,
    y = r("#setting-video-quality"),
    w = y?.querySelector('option[value="relaxed"]');
  if (w) {
    if (((w.disabled = !v), v))
      w.textContent = "⏳ Veo 3.1 — Fast (Lower Priority)";
    else {
      let a = "";
      (e
        ? t || (a = "Google AI Ultra required")
        : (a = "Google account tier required"),
        (w.textContent = "⏳ Veo 3.1 — Fast (Lower Priority) 🔒 " + a));
    }
    v ||
      "relaxed" !== l.settings.videoQuality ||
      ((l.settings.videoQuality = "fast"), (y.value = "fast"), J());
  }
  const I = y?.querySelector('option[value="lite_lp"]');
  if (I) {
    if (((I.disabled = !v), v))
      I.textContent = "🎬 Veo 3.1 — Lite (Lower Priority)";
    else {
      let a = "";
      (e
        ? t || (a = "Google AI Ultra required")
        : (a = "Google account tier required"),
        (I.textContent = "🎬 Veo 3.1 — Lite (Lower Priority) 🔒 " + a));
    }
    v ||
      "lite_lp" !== l.settings.videoQuality ||
      ((l.settings.videoQuality = "lite"), (y.value = "lite"), J());
  }
}
(r("#btn-recheck")?.addEventListener("click", async (e) => {
  e.stopPropagation();
  const t = r("#btn-recheck"),
    a = t.innerHTML;
  ((t.innerHTML =
    '<div class="uploading-spinner" style="width:12px;height:12px;border-width:1.5px"></div> Checking...'),
    (t.disabled = !0));
  try {
    const e = await chrome.runtime.sendMessage({
      type: "CHECK_CONNECTION",
      deep: !0,
    });
    (e?.state && Ne(e.state),
      e?.state?.lastError && Te("Connection: " + e.state.lastError, "warn"));
  } catch (e) {
    Te("Connection check failed: " + e.message, "error");
  }
  ((t.innerHTML = a), (t.disabled = !1));
}),
  r("#status-wrapper")?.addEventListener("click", (e) => {
    e.target.closest("#btn-recheck") ||
      r("#status-wrapper").classList.toggle("detail-open");
  }),
  document.addEventListener("click", (e) => {
    e.target.closest("#status-wrapper") ||
      r("#status-wrapper")?.classList.remove("detail-open");
  }),
  qe());
const Be = r("#auth-screen"),
  je = r("#main-app"),
  Ge = document.getElementById("loading-screen");
async function He() {
  try {
    const e = await chrome.runtime.sendMessage({ type: "GET_AUTH_STATE" });
    e?.user ? ((s = e.user), (i = e.plan || LOCAL_PLAN), We()) : Qe();
  } catch (e) {
    Qe();
  }
}
function Qe() {
  (Ge && (Ge.style.display = "none"),
    Be && (Be.style.display = "block"),
    je && (je.style.display = "none"));
}
function We() {
  s = s || LOCAL_USER;
  i = i || LOCAL_PLAN;
  Ge && (Ge.style.display = "none");
  Be && (Be.style.display = "none");
  je && (je.style.display = "block");
  Ve();
  Ye();
  at().then((e) => {
    e && setTimeout(() => rt(), 500);
  });
}
function Ve() {
  const e = r("#plan-banner"),
    t = r("#plan-free"),
    a = r("#plan-pro"),
    n = r("#plan-activating"),
    o = r("#plan-footer-email");
  e && (e.style.display = "none");
  t && (t.style.display = "none");
  a && (a.style.display = "none");
  n && (n.style.display = "none");
  o && (o.textContent = "");
}
async function ze() {
  i = LOCAL_PLAN;
  Ye();
}
function Ye() {
  const e = r("#img-count-pro-badge");
  (e && (e.style.display = "none"),
    [r("#img-count-2"), r("#img-count-3"), r("#img-count-4")].forEach((e) => {
      e && e.classList.remove("locked");
    }));
  const t = r("#vid-count-pro-badge");
  (t && (t.style.display = "none"),
    [r("#vid-count-2"), r("#vid-count-3"), r("#vid-count-4")].forEach((e) => {
      e && e.classList.remove("locked");
    }));
  const a = r("#vid-mode-pro-badge");
  (a && (a.style.display = "none"),
    [r("#vid-mode-start"), r("#vid-mode-se"), r("#vid-mode-ref")].forEach(
      (e) => {
        e && e.classList.remove("locked");
      },
    ));
}
(r("#btn-google-signin")?.addEventListener("click", async () => {
  const e = me(),
    t = r("#btn-google-signin"),
    a = t?.innerHTML || "";
  t &&
    ((t.disabled = !0),
    (t.innerHTML = '<div class="uploading-spinner"></div> Signing in...'));
  try {
    const t = await chrome.runtime.sendMessage({
      type: "SIGN_IN",
      fingerprint: e,
    });
    t?.ok
      ? ((s = t.user), (i = t.plan || LOCAL_PLAN), We())
      : alert("Sign in failed: " + (t?.error || "Unknown error"));
  } catch (e) {
    alert("Sign in error: " + e.message);
  }
  t && ((t.disabled = !1), (t.innerHTML = a));
}),
  r("#btn-sign-out")?.addEventListener("click", async () => {
    (await chrome.runtime.sendMessage({ type: "SIGN_OUT" }),
      (s = null),
      (i = null),
      Qe());
  }),
  r("#btn-upgrade")?.addEventListener("click", () => {}),
  r("#btn-close-upgrade")?.addEventListener("click", () => {}),
  r("#btn-close-limit")?.addEventListener("click", () => {}),
  r("#btn-upgrade-from-limit")?.addEventListener("click", () => {}),
  r("#btn-trial-welcome-close")?.addEventListener("click", () => {}),
  r("#btn-keep-pro")?.addEventListener("click", () => {}),
  r("#btn-ban-signout")?.addEventListener("click", We),
  r("#btn-manage-sub")?.addEventListener("click", () => {}));
let Ke = null,
  Je = "yearly";
function Xe(e) {
  We();
}
let Ze = null;
function et(e) {
  Me();
}
const tt = [
  {
    type: "welcome",
    icon: "⚡",
    title: "Welcome to TurboFlow!",
    desc: "Let's take a quick tour so you can start generating in under a minute.",
    btnText: "Show Me Around",
  },
  {
    type: "spotlight",
    target: ".tabs",
    icon: "📑",
    title: "Your 5 Tabs",
    desc: "<strong>Control</strong> — settings & prompts<br><strong>Queue</strong> — batch management & auto-chaining<br><strong>Gallery</strong> — view, select & download results<br><strong>Library</strong> — save & tag reference images<br><strong>Logs</strong> — detailed activity log",
    position: "bottom",
  },
  {
    type: "spotlight",
    target: '[data-mode="image"]',
    icon: "🎨",
    title: "Generation Mode",
    desc: "Switch between <strong>Image</strong> and <strong>Video</strong> generation. Each has its own settings — models, aspect ratios, and modes.",
    position: "bottom",
    targetParent: ".pill-group",
  },
  {
    type: "spotlight",
    target: "#setting-image-model",
    icon: "🤖",
    title: "AI Model",
    desc: "<strong>Nano Banana Pro</strong> — newest, best quality<br><strong>Nano Banana 2</strong> — fast, reliable<br><br>Both are Google's latest image models.",
    position: "bottom",
  },
  {
    type: "spotlight",
    target: '[data-img-ratio="IMAGE_ASPECT_RATIO_LANDSCAPE"]',
    icon: "📐",
    title: "Aspect Ratio",
    desc: "Choose <strong>Landscape</strong> (16:9) or <strong>Portrait</strong> (9:16). This applies to every image in the batch.",
    position: "bottom",
    targetParent: ".pill-group",
  },
  {
    type: "spotlight",
    target: '[data-img-count="1"]',
    icon: "✖️",
    title: "Images Per Prompt",
    desc: "Generate <strong>1 to 4 variants</strong> per prompt. Great for exploring different interpretations of the same idea.",
    position: "bottom",
    targetParent: ".pill-group",
  },
  {
    type: "spotlight",
    target: "#img-reference-section",
    icon: "🖼️",
    title: "Reference Images",
    desc: "<strong>Add Reference Images (Same for All)</strong> — pick images from your Library to guide every prompt's style.<br><br><strong>Assign Different Image for Each Prompt</strong> — give each prompt its own reference image. Supports auto 1:1 mapping, @tag matching, and bulk upload.",
    position: "top",
  },
  {
    type: "spotlight",
    target: ".settings-card",
    icon: "⚙️",
    title: "Download & File Settings",
    desc: "<strong>Save folder</strong> — organizes downloads per project<br><strong>Auto-download</strong> — images and videos downloading automatically<br><strong>Quality</strong> — choose 2K or Standard for images, 720p or 1080p for videos<br><strong>Naming</strong> — numbered, prompt-based, or custom prefix",
    position: "top",
  },
  {
    type: "spotlight",
    target: "#prompt-input",
    icon: "✍️",
    title: "Your Prompts",
    desc: "Type one prompt per line. Each line = one generation.<br><br>You can <strong>import a .txt file</strong> with the upload button. Paste 10 or 500 — TurboFlow handles it all.<br><br>💡 When you assign different images per prompt, the textarea locks to keep prompts synced with their images.",
    position: "top",
  },
  {
    type: "spotlight",
    target: "#btn-start",
    icon: "🚀",
    title: "Generate Now",
    desc: "Click to <strong>start generating immediately</strong>. Prompts fire and the results appear live in the Gallery tab.",
    position: "top",
  },
  {
    type: "spotlight",
    target: "#btn-add-queue",
    icon: "📋",
    title: "Add to Queue",
    desc: "Don't want to run now? Add prompts to the <strong>Queue</strong> instead.<br><br>Stack multiple batches with different settings, then hit <strong>Run All</strong> — they <strong>auto-run</strong> one after another. You can also duplicate, retry failed prompts, and import/export batches.",
    position: "top",
  },
  {
    type: "spotlight",
    target: '[data-tab="gallery"]',
    icon: "🖼",
    title: "Gallery",
    desc: "All generated images and videos appear here, <strong>grouped by prompt</strong>.<br><br><strong>Select</strong> items individually or all at once, then <strong>download</strong> in your preferred quality — 2K upscaled, standard, 720p, or 1080p.",
    position: "bottom",
  },
  {
    type: "spotlight",
    target: '[data-tab="library"]',
    icon: "📚",
    title: "Image Library",
    desc: "Upload images to use as <strong>references, start frames, or end frames</strong> across all your batches.<br><br>💡 <strong>Tag images</strong> with @names (e.g. @hero, @logo) then use those @tags in your prompts — the <strong>Auto-Tag</strong> mapper will match them automatically.",
    position: "bottom",
  },
  {
    type: "welcome",
    icon: "🎉",
    title: "You're All Set!",
    desc: "Open Google Flow, type your prompts, and hit generate.<br>TurboFlow handles the rest.<br><br>💡 <strong>Tip:</strong> Check the <strong>Logs tab</strong> for detailed status on every generation.",
    btnText: "Start Creating",
    isFinal: !0,
  },
];
async function at() {
  return !(await chrome.storage.local.get("turboflowOnboardingDone"))
    .turboflowOnboardingDone;
}
async function nt() {
  await chrome.storage.local.set({ turboflowOnboardingDone: !0 });
}
function rt() {
  ((D = 0), (N = !0), document.body.classList.add("onboarding-active"), it());
}
function ot() {
  ((N = !1), document.body.classList.remove("onboarding-active"));
  const e = document.getElementById("onboarding-container");
  (e && (e.innerHTML = ""),
    nt(),
    i?.trial &&
      i?.trialEndsAt &&
      new Date(i.trialEndsAt).getTime() - Date.now() > 0 &&
      setTimeout(() => lt(), 500));
}
function st() {
  (chrome.storage.local.remove("turboflowOnboardingDone"), rt());
}
function it() {
  const e = document.getElementById("onboarding-container");
  if (!e) return;
  const t = tt[D];
  if (!t) return void ot();
  const a = tt.length,
    n = tt
      .map(
        (e, t) =>
          `<div class="onboarding-dot ${t === D ? "active" : t < D ? "completed" : ""}"></div>`,
      )
      .join("");
  if ("welcome" === t.type)
    e.innerHTML = `\n            <div class="onboarding-overlay"></div>\n            <div class="onboarding-welcome">\n                <div class="onboarding-welcome-card">\n                    <div class="onboarding-welcome-icon">${t.icon}</div>\n                    <h2 class="onboarding-welcome-title">${t.title}</h2>\n                    <p class="onboarding-welcome-desc">${t.desc.replace(/\n/g, "<br>")}</p>\n                    <div class="onboarding-step-indicator" style="justify-content:center;margin-bottom:16px">\n                        ${n}\n                    </div>\n                    <button class="onboarding-btn-start" id="onboarding-next">\n                        ${t.btnText || "Next"}\n                    </button>\n                    <br>\n                    ${t.isFinal ? "" : '<button class="onboarding-skip-tour" id="onboarding-skip">Skip tour</button>'}\n                </div>\n            </div>\n        `;
  else if ("spotlight" === t.type) {
    let r = document.querySelector(t.target);
    if (!r) return (D++, void it());
    if (t.targetParent) {
      const e = r.closest(t.targetParent);
      e && (r = e);
    }
    (r.scrollIntoView({ behavior: "smooth", block: "nearest" }),
      setTimeout(() => {
        const o = r.getBoundingClientRect(),
          s = window.innerHeight,
          i = `\n                top: ${o.top - 6}px;\n                left: ${o.left - 6}px;\n                width: ${o.width + 12}px;\n                height: ${o.height + 12}px;\n            `;
        let l = "",
          d = "",
          c = t.position;
        const p = s - o.bottom,
          m = o.top;
        "bottom" === c && p < 200
          ? (c = "top")
          : "top" === c && m < 200 && (c = "bottom");
        let u = o.left;
        (u + 300 > window.innerWidth - 12 && (u = window.innerWidth - 300 - 12),
          (u = Math.max(12, u)),
          "bottom" === c
            ? ((l = `top: ${o.bottom + 16}px; left: ${u}px;`),
              (d = "arrow-top"))
            : "top" === c &&
              ((l = `bottom: ${s - o.top + 16}px; left: ${u}px;`),
              (d = "arrow-bottom")),
          (l += ` max-width: ${Math.min(300, window.innerWidth - 24)}px;`));
        const g = o.left + o.width / 2;
        l += ` --arrow-left: ${Math.max(16, Math.min(g - u, 284))}px;`;
        const f = D === a - 1 ? "Finish" : "Next";
        e.innerHTML = `\n                <div class="onboarding-spotlight spotlight-pulse" style="${i}"></div>\n                <div class="onboarding-tooltip ${d}" style="${l}">\n                    <div class="onboarding-step-indicator">\n                        ${n}\n                    </div>\n                    <div class="onboarding-icon">${t.icon}</div>\n                    <div class="onboarding-title">${t.title}</div>\n                    <div class="onboarding-desc">${t.desc}</div>\n                    <div class="onboarding-actions">\n                        <button class="onboarding-btn-skip" id="onboarding-skip">Skip</button>\n                        <button class="onboarding-btn-next" id="onboarding-next">\n                            ${f}\n                            <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>\n                        </button>\n                    </div>\n                </div>\n            `;
      }, 150));
  }
  setTimeout(() => {
    (document
      .getElementById("onboarding-next")
      ?.addEventListener("click", () => {
        (D++,
          D >= a
            ? (le("onboarding_step", { step: a, completed: !0 }), ot())
            : (le("onboarding_step", { step: D }), it()));
      }),
      document
        .getElementById("onboarding-skip")
        ?.addEventListener("click", () => {
          (le("onboarding_step", { step: D, skipped: !0 }), ot());
        }));
  }, 200);
}
function lt() {
  const e = r("#trial-welcome-modal");
  if (!e) return;
  const t = new Date(i.trialEndsAt).getTime() - Date.now(),
    a = Math.ceil(t / 36e5);
  ((r("#trial-welcome-hours").textContent = a + "h"),
    (e.style.display = "flex"));
}
function dt() {
  return "lib-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
}
function ct() {
  const e = JSON.stringify(y),
    t = new Blob([e]).size;
  return t < 1024
    ? t + " B"
    : t < 1048576
      ? (t / 1024).toFixed(1) + " KB"
      : (t / 1048576).toFixed(1) + " MB";
}
function pt(e) {
  return y.find((t) => t.mediaId === e);
}
function mt(e, t) {
  if (!t) return !1;
  if (
    !(t = t
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .substring(0, 20))
  )
    return !1;
  const a = y.find((a) => a.tag === t && a.id !== e);
  if (a)
    return (
      Te(`⚠️ Tag "@${t}" is already used by "${a.fileName}"`, "warn"),
      !1
    );
  const n = y.find((t) => t.id === e);
  return (
    !!n &&
    ((n.tag = t),
    ae(),
    kt(),
    Te(`🏷️ Tagged "${n.fileName}" as @${t}`, "info"),
    !0)
  );
}
function ut(e) {
  const t = y.find((t) => t.id === e);
  if (!t || !t.tag) return;
  const a = t.tag;
  ((t.tag = null),
    ae(),
    kt(),
    Te(`🏷️ Removed @${a} tag from "${t.fileName}"`, "info"));
}
function gt() {
  return y.filter((e) => e.tag && e.mediaId && !e.uploading);
}
function ft(e) {
  return e
    ? ((e = e.toLowerCase()),
      y.find((t) => t.tag === e && t.mediaId && !t.uploading) || null)
    : null;
}
function ht(e) {
  if (!e) return "img";
  let t = e.replace(/\.[^.]+$/, "");
  return (
    (t = t.toLowerCase().replace(/[^a-z0-9_-]+/g, "-")),
    (t = t.replace(/-+/g, "-").replace(/^-+|-+$/g, "")),
    (t = t.substring(0, 20).replace(/-+$/, "")),
    t || "img"
  );
}
function bt(e, t) {
  const a = (e) => y.some((a) => a.tag === e && a.id !== t);
  if (!a(e)) return e;
  for (let t = 2; t <= 99; t++) {
    const n = "-" + t,
      r = 20 - n.length,
      o = e.substring(0, r) + n;
    if (!a(o)) return o;
  }
  return null;
}
function vt() {
  const e = y.filter((e) => e.mediaId && !e.uploading && !e.tag);
  if (0 === e.length) return void Te("✓ All images are already tagged", "info");
  let t = 0,
    a = 0;
  for (const n of e) {
    const e = bt(ht(n.fileName), n.id);
    e ? ((n.tag = e), t++) : a++;
  }
  t > 0 && (ae(), kt());
  const n = y.filter((e) => e.tag && e.id).length - t;
  let r = `🏷️ Auto-tagged ${t} image${1 !== t ? "s" : ""}`;
  (n > 0 && (r += ` (${n} already had tags)`),
    a > 0 && (r += ` — ${a} skipped`),
    Te(r, t > 0 ? "success" : "info"),
    "function" == typeof le &&
      le("library_auto_tag", { tagged: t, skipped: a }));
}
async function yt(e) {
  if (y.filter((e) => !e.uploading).length >= 500)
    return (
      Te("⚠️ Library full — max 500 images. Remove some first.", "warn"),
      null
    );
  const t = await Vn(e),
    a = await ce(t, e.type);
  if (!a)
    return (Te(`❌ Failed to create thumbnail for "${e.name}"`, "error"), null);
  const n = dt(),
    r = {
      id: n,
      mediaId: null,
      fileName: e.name,
      thumbnail: a,
      uploadedAt: Date.now(),
      mimeType: e.type || "image/jpeg",
      uploading: !0,
      tag: null,
    };
  (y.push(r), kt());
  let o = null;
  for (let a = 0; a <= 3; a++)
    try {
      const r = await chrome.runtime.sendMessage({
        type: "UPLOAD_IMAGE",
        base64Data: t,
        fileName: e.name,
        mimeType: e.type || "image/jpeg",
      });
      if (!r.ok) {
        const t = r.error || "Upload failed";
        if (
          t.includes("400") ||
          t.includes("INVALID_ARGUMENT") ||
          t.includes("INVALID_REQUEST") ||
          t.includes("Bad request") ||
          t.includes("unsupported") ||
          t.includes("too large")
        )
          return (
            (y = y.filter((e) => e.id !== n)),
            kt(),
            Te(`❌ "${e.name}" — ${Ie(t)}`, "error"),
            null
          );
        if (
          (t.includes("Failed to fetch") ||
            t.includes("NetworkError") ||
            t.includes("network") ||
            t.includes("timeout") ||
            t.includes("Script execution failed") ||
            t.includes("429") ||
            t.includes("500") ||
            t.includes("502") ||
            t.includes("503")) &&
          a < 3
        ) {
          o = t;
          const n = 1500 * Math.pow(1.5, a) + 500 * Math.random();
          (Te(
            `⟳ "${e.name}" upload retry ${a + 1}/3 in ${(n / 1e3).toFixed(1)}s`,
            "warn",
          ),
            await ie(n));
          continue;
        }
        throw new Error(t);
      }
      const s = y.find((e) => e.id === n);
      return (
        s && ((s.mediaId = r.mediaId), (s.uploading = !1)),
        ae(),
        kt(),
        Te(`📸 "${e.name}" added to library`, "success"),
        q++,
        (j = !0),
        s
      );
    } catch (t) {
      o = t.message || String(t);
      const r =
          o.includes("Extension context invalidated") ||
          o.includes("Could not establish connection") ||
          o.includes("Receiving end does not exist"),
        s =
          o.includes("400") ||
          o.includes("INVALID_ARGUMENT") ||
          o.includes("INVALID_REQUEST") ||
          o.includes("Bad request") ||
          o.includes("unsupported") ||
          o.includes("too large");
      if (r || s || a >= 3)
        return (
          (y = y.filter((e) => e.id !== n)),
          kt(),
          Te(`❌ "${e.name}" — ${Ie(o)}`, "error"),
          null
        );
      const i = 1500 * Math.pow(1.5, a) + 500 * Math.random();
      (Te(
        `⟳ "${e.name}" upload error — retry ${a + 1}/3 in ${(i / 1e3).toFixed(1)}s`,
        "warn",
      ),
        await ie(i));
    }
  return (
    (y = y.filter((e) => e.id !== n)),
    kt(),
    Te(`❌ "${e.name}" — ${Ie(o)}`, "error"),
    null
  );
}
async function wt(e, t = null) {
  const a = [];
  let n = 0,
    r = 0,
    o = 0;
  return new Promise((s) => {
    async function i(o) {
      const i = e[o];
      r++;
      const d = await yt(i);
      ((a[o] = d),
        r--,
        n++,
        t && t(n, e.length, i.name, !!d),
        (n >= e.length && (s(a), 1)) || l());
    }
    function l() {
      for (; o < e.length && r < 10; )
        if ((i(o++), o < e.length && r < 10)) return void setTimeout(l, 100);
    }
    0 !== e.length ? l() : s(a);
  });
}
function It(e) {
  const t = y.find((t) => t.id === e);
  if (!t) return;
  const a = t.fileName;
  ((y = y.filter((t) => t.id !== e)),
    t.mediaId &&
      ((l.imageReferenceMediaIds = l.imageReferenceMediaIds.filter(
        (e) => e !== t.mediaId,
      )),
      (l.referenceMediaIds = l.referenceMediaIds.filter(
        (e) => e !== t.mediaId,
      )),
      l.startFrameMediaId === t.mediaId && (l.startFrameMediaId = null),
      l.endFrameMediaId === t.mediaId && (l.endFrameMediaId = null)),
    ae(),
    kt(),
    Te(`🗑 "${a}" removed from library`, "info"));
}
function Et() {
  if (0 === y.length) return;
  const e = y.length;
  ((y = []),
    (l.imageReferenceMediaIds = []),
    (l.referenceMediaIds = []),
    (l.startFrameMediaId = null),
    (l.endFrameMediaId = null),
    ae(),
    kt(),
    Te(`🗑 Library cleared — ${e} images removed`, "info"));
}
function kt() {
  const e = r("#library-grid"),
    t = r("#library-count"),
    a = r("#library-footer"),
    n = r("#library-storage-info");
  if (!e) return;
  const o = y.filter((e) => e.thumbnail);
  if (0 === o.length)
    return (
      (e.innerHTML =
        '\n            <div class="empty-state" style="grid-column: 1/-1">\n                <span class="material-symbols-outlined">photo_library</span>\n                Upload images to use as references, start frames, or end frames across all your batches\n            </div>\n        '),
      (t.textContent = "0 images"),
      void (a.style.display = "none")
    );
  ((t.textContent = `${o.length} image${1 !== o.length ? "s" : ""}`),
    (a.style.display = "flex"),
    (n.textContent = `${o.length} images · ${ct()}`),
    (e.innerHTML =
      o
        .map((e) => {
          const t = e.uploading,
            a =
              e.fileName.length > 14
                ? e.fileName.substring(0, 11) + "..."
                : e.fileName,
            n = e.mediaId ? e.mediaId.substring(0, 12) + "..." : "uploading...";
          let r = "";
          return (
            (r = t
              ? ""
              : e.tag
                ? `\n                <div class="library-item-tag">\n                    <span class="tag-pill" data-lib-tag-id="${e.id}">\n                        @${se(e.tag)}\n                        <button class="tag-remove" data-tag-remove="${e.id}" title="Remove tag">✕</button>\n                    </span>\n                </div>\n            `
                : `\n                <div class="library-item-tag">\n                    <button class="tag-add-btn" data-tag-add="${e.id}" title="Add tag for auto-mapping">+ Tag</button>\n                    <div class="tag-input-wrapper" data-tag-input-wrapper="${e.id}" style="display:none">\n                        <input type="text" class="tag-input-field" data-tag-input="${e.id}"\n                            placeholder="tag name" maxlength="20" spellcheck="false">\n                    </div>\n                </div>\n            `),
            `\n            <div class="library-item ${t ? "uploading" : ""}" data-lib-id="${e.id}">\n                <div class="library-item-overlay">\n                    <div class="uploading-spinner"></div>\n                </div>\n                <img class="library-item-img" src="${e.thumbnail}" alt="${se(e.fileName)}" loading="lazy">\n                <div class="library-item-info">\n                    <span class="library-item-name" title="${se(e.fileName)}">${se(a)}</span>\n                    ${t ? "" : `\n                        <button class="library-item-delete" data-lib-delete="${e.id}" title="Remove">\n                            <span class="material-symbols-outlined">close</span>\n                        </button>\n                    `}\n                </div>\n                ${r}\n                <div class="library-item-mediaid">${n}</div>\n            </div>\n        `
          );
        })
        .join("") +
      '\n        <div class="library-upload-card" id="library-upload-card">\n            <span class="material-symbols-outlined">add_photo_alternate</span>\n            <span>Upload</span>\n        </div>\n    '),
    e.querySelectorAll("[data-lib-delete]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), It(e.dataset.libDelete));
      });
    }));
  const s = e.querySelector("#library-upload-card");
  (s &&
    s.addEventListener("click", () => {
      r("#library-upload-input").click();
    }),
    e.querySelectorAll("[data-tag-add]").forEach((t) => {
      t.addEventListener("click", (a) => {
        a.stopPropagation();
        const n = t.dataset.tagAdd;
        t.style.display = "none";
        const r = e.querySelector(`[data-tag-input-wrapper="${n}"]`);
        if (r) {
          r.style.display = "flex";
          const e = r.querySelector(`[data-tag-input="${n}"]`);
          e && e.focus();
        }
      });
    }),
    e.querySelectorAll("[data-tag-input]").forEach((e) => {
      const t = e.dataset.tagInput;
      (e.addEventListener("keydown", (a) => {
        if ("Enter" === a.key) {
          a.preventDefault();
          const n = e.value.trim();
          n ? mt(t, n) : kt();
        }
        "Escape" === a.key && kt();
      }),
        e.addEventListener("blur", () => {
          const a = e.value.trim();
          a ? mt(t, a) : kt();
        }),
        e.addEventListener("input", () => {
          e.value = e.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
        }));
    }),
    e.querySelectorAll("[data-tag-remove]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), ut(e.dataset.tagRemove));
      });
    }));
}
(r("#btn-library-upload")?.addEventListener("click", () => {
  r("#library-upload-input").click();
}),
  r("#library-upload-input")?.addEventListener("change", async (e) => {
    const t = Array.from(e.target.files);
    if (!t.length) return;
    const a = t.filter((e) => e.type.startsWith("image/"));
    if (a.length)
      if (await St("upload images")) {
        if (1 === a.length) await yt(a[0]);
        else {
          Te(`📤 Uploading ${a.length} images (10x parallel)...`, "info");
          const e = (await wt(a, (e, t, a, n) => {})).filter(
              (e) => null !== e,
            ).length,
            t = a.length - e;
          t > 0
            ? Te(`📤 Upload complete: ${e} succeeded, ${t} failed`, "warn")
            : Te(`📤 All ${e} images uploaded successfully`, "success");
        }
        e.target.value = "";
      } else e.target.value = "";
    else Te("⚠️ No image files selected", "warn");
  }),
  r("#btn-library-clear")?.addEventListener("click", () => {
    0 !== y.length && Et();
  }),
  r("#btn-library-autotag")?.addEventListener("click", () => {
    0 !== y.length ? vt() : Te("⚠️ Library is empty", "warn");
  }));
const Mt = r("#library-grid");
Mt &&
  (Mt.addEventListener("dragover", (e) => {
    (e.preventDefault(), Mt.classList.add("drag-over"));
  }),
  Mt.addEventListener("dragleave", () => {
    Mt.classList.remove("drag-over");
  }),
  Mt.addEventListener("drop", async (e) => {
    (e.preventDefault(), Mt.classList.remove("drag-over"));
    const t = Array.from(e.dataTransfer.files).filter((e) =>
      e.type.startsWith("image/"),
    );
    t.length &&
      (await St("upload images")) &&
      (1 === t.length
        ? await yt(t[0])
        : (Te(`📤 Uploading ${t.length} images (10x parallel)...`, "info"),
          await wt(t)));
  }));
let $t = !1,
  Lt = 0,
  xt = 0;
async function St(e) {
  try {
    const t = await chrome.runtime.sendMessage({
        type: "GET_CONNECTION_STATE",
      }),
      a = t?.state;
    return (
      !(!a || "connected" !== a.status) ||
      (Te(
        `❌ Cannot ${e} — not connected. ${a?.lastError || "Open Google Flow with a project first"}`,
        "error",
      ),
      Gn({
        icon: "🔌",
        title: "Not Connected to Flow",
        message: `You need an open Google Flow project to ${e}.`,
        hint: '<strong>Step 1:</strong> Open <a href="https://labs.google/fx/tools/flow" target="_blank" style="color:#a8c7fa">labs.google/fx</a><br><strong>Step 2:</strong> Sign in with Google if Flow asks<br><strong>Step 3:</strong> Create or open a project<br><strong>Step 4:</strong> Wait for the status badge to show "Connected"',
      }),
      !1)
    );
  } catch (t) {
    return (
      Te(`❌ Cannot ${e} — connection check failed`, "error"),
      Gn({
        icon: "🔌",
        title: "Connection Check Failed",
        message: "Could not verify connection to Google Flow.",
        hint: "Make sure you have a Flow project open and try again.",
      }),
      !1
    );
  }
}
function _t(e) {
  const t = r("#picker-upload-progress"),
    a = r("#picker-upload-progress-text");
  (t && (t.style.display = "flex"), a && (a.textContent = e), Tt(!0));
}
function Pt(e) {
  const t = r("#picker-upload-progress-text");
  t && (t.textContent = e);
}
function At() {
  const e = r("#picker-upload-progress");
  (e && (e.style.display = "none"), Tt(!1));
}
function Tt(e) {
  const t = r("#btn-picker-done"),
    a = r("#btn-picker-upload"),
    n = r("#btn-picker-upload-more");
  (r("#btn-close-picker"),
    t && (t.disabled = e),
    a && (a.disabled = e),
    n && (n.disabled = e));
}
function Ct(e) {
  ((w = e.mode || "multi"),
    (I = e.role || "image_reference"),
    (k = e.maxSelect || 10),
    (E = [...(e.currentSelection || [])]),
    (M = e.onDone || null),
    ($t = !1),
    (Lt = 0),
    (xt = 0),
    At(),
    (r("#picker-title").textContent =
      {
        start_frame: "Choose Start Frame",
        end_frame: "Choose End Frame",
        video_reference: "Choose Reference Images",
        image_reference: "Choose Reference Images",
      }[I] || "Select Image"),
    (r("#picker-modal").style.display = "flex"),
    Ft());
}
function Rt() {
  ((r("#picker-modal").style.display = "none"),
    (w = null),
    (I = null),
    (E = []),
    (M = null),
    ($t = !1),
    At());
}
function Ft() {
  const e = r("#picker-grid"),
    t = r("#picker-empty"),
    a = r("#picker-selected-count"),
    n = y.filter((e) => e.mediaId && !e.uploading);
  if (0 === n.length)
    return (
      (e.style.display = "none"),
      (t.style.display = "flex"),
      void (a.textContent = "0 selected")
    );
  ((e.style.display = "grid"),
    (t.style.display = "none"),
    (e.innerHTML = n
      .map((e) => {
        const t = E.includes(e.mediaId),
          a =
            e.fileName.length > 12
              ? e.fileName.substring(0, 9) + "..."
              : e.fileName;
        return `\n            <div class="picker-item ${t ? "selected" : ""}" data-picker-media="${e.mediaId}">\n                <div class="picker-item-check">\n                    <span class="material-symbols-outlined">check</span>\n                </div>\n                <img class="picker-item-img" src="${e.thumbnail}" alt="${se(e.fileName)}" loading="lazy">\n                <div class="picker-item-name">${se(a)}</div>\n            </div>\n        `;
      })
      .join("")),
    Dt(),
    e.querySelectorAll(".picker-item").forEach((t) => {
      t.addEventListener("click", () => {
        if ($t) return;
        const a = t.dataset.pickerMedia;
        if ("single" === w) E = E.includes(a) ? [] : [a];
        else if (E.includes(a)) E = E.filter((e) => e !== a);
        else {
          if (E.length >= k)
            return void Te(`⚠️ Maximum ${k} images allowed`, "warn");
          E.push(a);
        }
        (e.querySelectorAll(".picker-item").forEach((e) => {
          const t = e.dataset.pickerMedia;
          e.classList.toggle("selected", E.includes(t));
        }),
          Dt());
      });
    }));
}
function Dt() {
  const e = r("#picker-selected-count"),
    t = E.length;
  e.textContent =
    "single" === w
      ? 0 === t
        ? "None selected"
        : "1 selected"
      : `${t}${k < 99 ? "/" + k : ""} selected`;
}
async function Nt(e) {
  const t = Array.from(e).filter((e) => e.type.startsWith("image/"));
  if (t.length) {
    if (await St("upload images")) {
      if (
        (($t = !0),
        (Lt = t.length),
        (xt = 0),
        _t(
          `Uploading ${t.length} image${t.length > 1 ? "s" : ""}... (0/${t.length})`,
        ),
        1 === t.length)
      ) {
        const e = await yt(t[0]);
        ((xt = 1), Pt(e ? "Upload complete" : "Upload failed"));
      } else
        await wt(t, (e, t, a, n) => {
          ((xt = e), Pt(`Uploading ${t} images... (${e}/${t})`));
        });
      (($t = !1), At(), Ft());
    }
  } else Te("⚠️ No image files selected", "warn");
}
function qt() {
  Ct({
    mode: "multi",
    role: "image_reference",
    maxSelect: 10,
    currentSelection: [...l.imageReferenceMediaIds],
    onDone: (e) => {
      ((l.imageReferenceMediaIds = e), jt(), J());
    },
  });
}
function Ot() {
  Ct({
    mode: "multi",
    role: "video_reference",
    maxSelect: 10,
    currentSelection: [...l.referenceMediaIds],
    onDone: (e) => {
      ((l.referenceMediaIds = e), Gt(), J());
    },
  });
}
function Ut() {
  Ct({
    mode: "single",
    role: "start_frame",
    maxSelect: 1,
    currentSelection: l.startFrameMediaId ? [l.startFrameMediaId] : [],
    onDone: (e) => {
      ((l.startFrameMediaId = e[0] || null), Ht(), J());
    },
  });
}
function Bt() {
  Ct({
    mode: "single",
    role: "end_frame",
    maxSelect: 1,
    currentSelection: l.endFrameMediaId ? [l.endFrameMediaId] : [],
    onDone: (e) => {
      ((l.endFrameMediaId = e[0] || null), Qt(), J());
    },
  });
}
function jt() {
  const e = r("#img-reference-list");
  e &&
    (0 !== l.imageReferenceMediaIds.length
      ? ((e.innerHTML = l.imageReferenceMediaIds
          .map((e, t) => {
            const a = pt(e),
              n = a?.thumbnail || "";
            return `\n            <div class="reference-item">\n                ${n ? `<img src="${n}" alt="Reference">` : '<span style="font-size:18px">🖼</span>'}\n                <span class="ref-info">${se(a?.fileName || e.substring(0, 12) + "...")}</span>\n                <button class="btn-remove" data-remove-imgref="${t}">✕</button>\n            </div>\n        `;
          })
          .join("")),
        e.querySelectorAll("[data-remove-imgref]").forEach((e) => {
          e.addEventListener("click", () => {
            const t = parseInt(e.dataset.removeImgref);
            (l.imageReferenceMediaIds.splice(t, 1), jt(), J());
          });
        }))
      : (e.innerHTML = ""));
}
function Gt() {
  const e = r("#reference-list");
  e &&
    (0 !== l.referenceMediaIds.length
      ? ((e.innerHTML = l.referenceMediaIds
          .map((e, t) => {
            const a = pt(e),
              n = a?.thumbnail || "";
            return `\n            <div class="reference-item">\n                ${n ? `<img src="${n}" alt="Reference">` : '<span style="font-size:18px">🖼</span>'}\n                <span class="ref-info">${se(a?.fileName || e.substring(0, 12) + "...")}</span>\n                <button class="btn-remove" data-remove-vidref="${t}">✕</button>\n            </div>\n        `;
          })
          .join("")),
        e.querySelectorAll("[data-remove-vidref]").forEach((e) => {
          e.addEventListener("click", () => {
            const t = parseInt(e.dataset.removeVidref);
            (l.referenceMediaIds.splice(t, 1), Gt(), J());
          });
        }))
      : (e.innerHTML = ""));
}
function Ht() {
  const e = r("#start-frame-preview");
  if (!e) return;
  if (!l.startFrameMediaId)
    return (
      (e.className = "upload-preview"),
      (e.innerHTML =
        '\n            <button class="btn-flow-secondary" id="btn-upload-start">\n                <span class="material-symbols-outlined">photo_library</span>\n                Choose Start Frame\n            </button>\n        '),
      void e.querySelector("#btn-upload-start")?.addEventListener("click", Ut)
    );
  const t = pt(l.startFrameMediaId),
    a = t?.thumbnail || "",
    n = t?.fileName || "Start Frame";
  ((e.className = "upload-preview has-image"),
    (e.innerHTML = `\n        ${a ? `<img src="${a}" alt="Start frame">` : ""}\n        <div class="upload-info">\n            <div class="filename">${se(n)}</div>\n            <div class="media-id">${l.startFrameMediaId.substring(0, 16)}...</div>\n        </div>\n        <button class="btn-remove" id="btn-change-start">Change</button>\n        <button class="btn-remove" id="btn-remove-start">✕</button>\n    `),
    e.querySelector("#btn-change-start")?.addEventListener("click", Ut),
    e.querySelector("#btn-remove-start")?.addEventListener("click", () => {
      ((l.startFrameMediaId = null), Ht(), J());
    }));
}
function Qt() {
  const e = r("#end-frame-preview");
  if (!e) return;
  if (!l.endFrameMediaId)
    return (
      (e.className = "upload-preview"),
      (e.innerHTML =
        '\n            <button class="btn-flow-secondary" id="btn-upload-end">\n                <span class="material-symbols-outlined">photo_library</span>\n                Choose End Frame\n            </button>\n        '),
      void e.querySelector("#btn-upload-end")?.addEventListener("click", Bt)
    );
  const t = pt(l.endFrameMediaId),
    a = t?.thumbnail || "",
    n = t?.fileName || "End Frame";
  ((e.className = "upload-preview has-image"),
    (e.innerHTML = `\n        ${a ? `<img src="${a}" alt="End frame">` : ""}\n        <div class="upload-info">\n            <div class="filename">${se(n)}</div>\n            <div class="media-id">${l.endFrameMediaId.substring(0, 16)}...</div>\n        </div>\n        <button class="btn-remove" id="btn-change-end">Change</button>\n        <button class="btn-remove" id="btn-remove-end">✕</button>\n    `),
    e.querySelector("#btn-change-end")?.addEventListener("click", Bt),
    e.querySelector("#btn-remove-end")?.addEventListener("click", () => {
      ((l.endFrameMediaId = null), Qt(), J());
    }));
}
function Wt() {
  const e = ue();
  if ("disabled" === e)
    return void Te(
      "⚠️ Video text mode doesn't support per-prompt mapping",
      "warn",
    );
  let t = r("#prompt-input")
    .value.split("\n")
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
  if (0 === t.length) {
    if (
      !(
        Object.keys(l.promptStartFrameMap || {}).length > 0 &&
        l.singlePromptMode
      )
    )
      return void Gn({
        icon: "✍️",
        title: "Prompts Required",
        message:
          'Write your prompts first <strong>(one per line)</strong>, then click "Different for Each" to assign images to each one.',
        hint: "Each line in the prompt box becomes one generation. The mapper lets you assign a unique reference image to each prompt.",
      });
    {
      const e = Object.keys(l.promptStartFrameMap).filter(
        (e) => l.promptStartFrameMap[e],
      ).length;
      t = Array(e).fill("");
    }
  }
  if (((H = !0), l.singlePromptMode)) {
    const e = Object.keys(l.promptStartFrameMap).filter(
        (e) => l.promptStartFrameMap[e],
      ).length,
      a = t[0] || "";
    z = Array(Math.max(e, 1)).fill(a);
  } else z = [...t];
  ("start_frame" === e
    ? ((W = z.map((e, t) => l.promptStartFrameMap[t] || null)),
      (V = []),
      (Q = []))
    : "start_end_frame" === e
      ? ((W = z.map((e, t) => l.promptStartFrameMap[t] || null)),
        (V = z.map((e, t) => l.promptEndFrameMap[t] || null)),
        (Q = []))
      : ((Q = z.map((e, t) =>
          l.promptReferenceMap[t] ? [...l.promptReferenceMap[t]] : [],
        )),
        (W = []),
        (V = [])),
    (r("#mapper-modal-title").textContent =
      "start_frame" === e
        ? "📎 Start Frame Assignments"
        : "start_end_frame" === e
          ? "📎 Start + End Frame Assignments"
          : "📎 Reference Assignments"),
    (r("#reference-mapper-modal").style.display = "flex"));
  const a = /@[a-z0-9_-]+/i,
    n = z.some((e) => a.test(e)),
    o = r("#mapper-strip-row"),
    s = r("#mapper-strip-tags");
  (o &&
    s &&
    ((o.style.display = n ? "block" : "none"),
    (s.checked = !0 === l.stripTagsOnSave)),
    ea());
}
function Vt() {
  ((H = !1),
    (Y = null),
    (r("#reference-mapper-modal").style.display = "none"),
    ya());
}
function zt(e, t) {
  if (e === t) return;
  const a = W[e];
  ((W[e] = W[t]),
    (W[t] = a),
    ea(),
    "function" == typeof le &&
      le("mapper_action", { action: "swap_frame", mode: "start_frame" }));
}
function Yt(e, t) {
  if (e === t) return;
  const a = V[e];
  ((V[e] = V[t]),
    (V[t] = a),
    ea(),
    "function" == typeof le &&
      le("mapper_action", { action: "swap_frame", mode: "end_frame" }));
}
function Kt(e, t) {
  if (e === t) return;
  const a = Q[e] || [];
  ((Q[e] = Q[t] || []),
    (Q[t] = a),
    ea(),
    "function" == typeof le &&
      le("mapper_action", { action: "swap_frame", mode: "reference" }));
}
function Jt() {
  if (l.singlePromptMode) {
    if (!(z[0] || "").trim()) {
      const e = document.getElementById("mapper-shared-prompt-text");
      return (
        e &&
          (e.focus(),
          e.classList.add("mapper-shared-prompt-error"),
          setTimeout(() => {
            e.classList.remove("mapper-shared-prompt-error");
          }, 2e3)),
        void Gn({
          icon: "✍️",
          title: "Prompt Required",
          message:
            "You must write a prompt before saving. The prompt describes what motion or action you want for all your start frames.",
          hint: "Type a single prompt at the top of the mapper — it will apply to all your start frames.",
        })
      );
    }
  } else if (!z.some((e) => (e || "").trim().length > 0))
    return void Gn({
      icon: "✍️",
      title: "Prompts Required",
      message: "You must write at least one prompt before saving.",
      hint: "Click the edit icon next to each row to add prompts.",
    });
  const e = ue();
  let t = !1;
  "start_frame" === e
    ? ((l.promptStartFrameMap = {}),
      (l.promptEndFrameMap = {}),
      W.forEach((e, a) => {
        e && ((l.promptStartFrameMap[a] = e), (t = !0));
      }))
    : "start_end_frame" === e
      ? ((l.promptStartFrameMap = {}),
        (l.promptEndFrameMap = {}),
        W.forEach((e, a) => {
          e && ((l.promptStartFrameMap[a] = e), (t = !0));
        }),
        V.forEach((e, a) => {
          e && ((l.promptEndFrameMap[a] = e), (t = !0));
        }))
      : ((l.promptReferenceMap = {}),
        Q.forEach((e, a) => {
          e && e.length > 0 && ((l.promptReferenceMap[a] = [...e]), (t = !0));
        }));
  let a = z;
  (l.stripTagsOnSave &&
    (a = z.map((e) =>
      e
        .replace(/@[a-z0-9_-]+/gi, "")
        .replace(/\s+/g, " ")
        .replace(/\s+([,.!?;:])/g, "$1")
        .trim(),
    )),
    l.singlePromptMode
      ? (r("#prompt-input").value = a[0] || "")
      : (r("#prompt-input").value = a.join("\n")),
    Hn(),
    (l.referenceMode = t ? "mapped" : "shared"),
    J(),
    re(),
    Ia(),
    ka(),
    Ea(),
    t && (O = !0),
    Vt());
  let n = 0;
  (t &&
    (n =
      "start_frame" === e
        ? Object.keys(l.promptStartFrameMap).length
        : "start_end_frame" === e
          ? new Set([
              ...Object.keys(l.promptStartFrameMap),
              ...Object.keys(l.promptEndFrameMap),
            ]).size
          : Object.keys(l.promptReferenceMap).length),
    Te(`📎 Saved — ${n}/${z.length} prompts have images assigned`, "success"));
}
function Xt() {
  const e = !0 === l.singlePromptMode,
    t = r("#btn-mapper-all"),
    a = r("#btn-mapper-autotag"),
    n = r("#btn-mapper-clear"),
    o = r("#btn-mapper-1to1");
  (t && (t.style.display = e ? "none" : ""),
    a && (a.style.display = e ? "none" : ""),
    n && (n.style.display = e ? "none" : ""),
    o &&
      (e
        ? ((o.innerHTML =
            '<span class="material-symbols-outlined">upload_file</span> Upload Start Frames'),
          (o.title = "Upload images as start frames"))
        : ((o.innerHTML =
            '<span class="material-symbols-outlined">link</span> Auto 1:1'),
          (o.title = "Select images from PC → map 1:1 by order"))));
  const s = r("#btn-mapper-add-prompt");
  s && (s.style.display = e ? "none" : "");
  const i = document.querySelector(".mapper-add-prompt-row");
  i && (i.style.display = e ? "none" : "");
}
function Zt() {
  const e = document.getElementById("mapper-shared-prompt-text");
  e &&
    (e.addEventListener("blur", () => {
      const t = e.textContent.trim();
      t !== z[0] && z.fill(t);
    }),
    e.addEventListener("keydown", (t) => {
      ("Enter" !== t.key || t.shiftKey || (t.preventDefault(), e.blur()),
        "Escape" === t.key && ((e.textContent = z[0] || ""), e.blur()));
    }));
}
function ea() {
  const e = r("#mapper-prompt-list"),
    t = r("#mapper-prompt-count");
  if (!e) return;
  const a = ue(),
    n = "start_frame" === a,
    o = "start_end_frame" === a;
  let s = 0,
    i = [];
  for (let e = 0; e < z.length; e++)
    if (n) W[e] ? s++ : i.push(e);
    else if (o) {
      const t = !!W[e],
        a = !!V[e];
      t && a ? s++ : i.push(e);
    } else Q[e] && Q[e].length > 0 ? s++ : i.push(e);
  const d = i.length,
    c = d > 0 && s > 0;
  t.innerHTML = c
    ? `${z.length} prompts • ${s} mapped • <span class="mapper-unmapped-count">${d} unmapped</span>`
    : `${z.length} prompts • ${s} mapped`;
  const p = r("#mapper-jump-unmapped");
  if ((p && p.remove(), c)) {
    const e = r(".mapper-count-row");
    if (e) {
      const t = document.createElement("button");
      ((t.id = "mapper-jump-unmapped"),
        (t.className = "mapper-jump-btn"),
        (t.innerHTML = `<span class="material-symbols-outlined">keyboard_double_arrow_down</span> Jump to unmapped (${d})`),
        t.addEventListener("click", ha),
        e.appendChild(t));
    }
  }
  let m = "";
  l.singlePromptMode &&
    (m = `\n            <div class="mapper-shared-prompt-row">\n                <span class="mapper-shared-prompt-label">📝 Prompt:</span>\n                <span class="mapper-shared-prompt-text" id="mapper-shared-prompt-text"\n                      contenteditable="true" spellcheck="false"\n                      placeholder="Type a prompt that applies to all frames...">${se(z[0] || "")}</span>\n            </div>\n        `);
  const u = z
    .map((e, t) => {
      const a = String(t + 1).padStart(3, "0"),
        r = e.length > 60 ? e.substring(0, 57) + "..." : e;
      let i = !1;
      i = n ? !!W[t] : o ? !!W[t] && !!V[t] : Q[t] && Q[t].length > 0;
      const d = !i && s > 0 ? "mapper-row-unmapped" : "";
      let c = "";
      if (n) {
        const e = W[t];
        if (e) {
          const a = ve(e),
            n = ta(e);
          c = `\n                    <div class="mapper-prompt-refs" data-drop-start="${t}">\n                        <span class="mapper-ref-drag-handle" data-drag-start="${t}" title="Drag to swap with another prompt">\n                            <span class="material-symbols-outlined">drag_indicator</span>\n                        </span>\n                        <div class="mapper-ref-item">\n                            ${a ? `<img class="mapper-ref-thumb" src="${a}" alt="frame">` : '<div class="mapper-ref-thumb" style="display:flex;align-items:center;justify-content:center;font-size:14px">🖼</div>'}\n                            <span class="mapper-ref-label">${se(n)}</span>\n                        </div>\n                        <div class="mapper-frame-actions">\n                            <button class="mapper-frame-btn" data-mapper-change="${t}">Change</button>\n                            <button class="mapper-frame-btn remove" data-mapper-remove-frame="${t}">✕</button>\n                        </div>\n                    </div>\n                `;
        } else
          c = `\n                    <div class="mapper-prompt-refs mapper-refs-empty" data-drop-start="${t}">\n                        <span class="mapper-no-refs">\n                            ${s > 0 ? '<span class="material-symbols-outlined mapper-warning-icon">warning</span>' : ""}\n                            no start frame\n                        </span>\n                        <button class="mapper-add-btn" data-mapper-add="${t}">\n                            <span class="material-symbols-outlined">add</span>\n                            Set Frame\n                        </button>\n                    </div>\n                `;
      } else if (o) {
        const e = W[t],
          a = V[t];
        let n = "";
        if (e) {
          const a = ve(e),
            r = ta(e);
          n = `\n                    <div class="mapper-frame-row" data-drop-start="${t}">\n                        <span class="mapper-frame-label">Start:</span>\n                        <span class="mapper-ref-drag-handle" data-drag-start="${t}" title="Drag to swap with another prompt's start frame">\n                            <span class="material-symbols-outlined">drag_indicator</span>\n                        </span>\n                        <div class="mapper-ref-item">\n                            ${a ? `<img class="mapper-ref-thumb" src="${a}" alt="start">` : '<div class="mapper-ref-thumb" style="display:flex;align-items:center;justify-content:center;font-size:14px">🖼</div>'}\n                            <span class="mapper-ref-label">${se(r)}</span>\n                        </div>\n                        <div class="mapper-frame-actions">\n                            <button class="mapper-frame-btn" data-mapper-change-start="${t}">Change</button>\n                            <button class="mapper-frame-btn remove" data-mapper-remove-start="${t}">✕</button>\n                        </div>\n                    </div>\n                `;
        } else
          n = `\n                    <div class="mapper-frame-row mapper-frame-row-empty" data-drop-start="${t}">\n                        <span class="mapper-frame-label">Start:</span>\n                        <button class="mapper-add-btn" data-mapper-add-start="${t}">\n                            <span class="material-symbols-outlined">add</span>\n                            Set Start Frame\n                        </button>\n                    </div>\n                `;
        let r = "";
        if (a) {
          const e = ve(a),
            n = ta(a);
          r = `\n                    <div class="mapper-frame-row" data-drop-end="${t}">\n                        <span class="mapper-frame-label">End:</span>\n                        <span class="mapper-ref-drag-handle" data-drag-end="${t}" title="Drag to swap with another prompt's end frame">\n                            <span class="material-symbols-outlined">drag_indicator</span>\n                        </span>\n                        <div class="mapper-ref-item">\n                            ${e ? `<img class="mapper-ref-thumb" src="${e}" alt="end">` : '<div class="mapper-ref-thumb" style="display:flex;align-items:center;justify-content:center;font-size:14px">🖼</div>'}\n                            <span class="mapper-ref-label">${se(n)}</span>\n                        </div>\n                        <div class="mapper-frame-actions">\n                            <button class="mapper-frame-btn" data-mapper-change-end="${t}">Change</button>\n                            <button class="mapper-frame-btn remove" data-mapper-remove-end="${t}">✕</button>\n                        </div>\n                    </div>\n                `;
        } else
          r = `\n                    <div class="mapper-frame-row mapper-frame-row-empty" data-drop-end="${t}">\n                        <span class="mapper-frame-label">End:</span>\n                        <button class="mapper-add-btn" data-mapper-add-end="${t}">\n                            <span class="material-symbols-outlined">add</span>\n                            Set End Frame\n                        </button>\n                    </div>\n                `;
        c = `<div class="mapper-frames-stack">${n}${r}</div>`;
      } else {
        const e = Q[t] || [],
          a = e
            .map((e, a) => {
              const n = ve(e);
              return `\n                    <div class="mapper-ref-item">\n                        ${n ? `<img class="mapper-ref-thumb" src="${n}" alt="ref">` : '<div class="mapper-ref-thumb" style="display:flex;align-items:center;justify-content:center;font-size:14px">🖼</div>'}\n                        <span class="mapper-ref-label">${se(ta(e))}</span>\n                        <button class="mapper-ref-remove" data-mapper-remove-ref="${t}-${a}" title="Remove">✕</button>\n                    </div>\n                `;
            })
            .join(""),
          n =
            0 === e.length
              ? `<span class="mapper-no-refs">\n                    ${s > 0 ? '<span class="material-symbols-outlined mapper-warning-icon">warning</span>' : ""}\n                    no reference\n                  </span>`
              : "",
          r =
            e.length > 0
              ? `<span class="mapper-ref-drag-handle" data-drag-ref="${t}" title="Drag to swap with another prompt's references">\n                       <span class="material-symbols-outlined">drag_indicator</span>\n                   </span>`
              : "";
        c = `\n                <div class="mapper-prompt-refs ${0 === e.length ? "mapper-refs-empty" : ""}" data-drop-ref="${t}">\n                    ${r}\n                    ${a}\n                    ${n}\n                    <button class="mapper-add-btn" data-mapper-add="${t}">\n                        <span class="material-symbols-outlined">add</span>\n                    </button>\n                </div>\n            `;
      }
      return l.singlePromptMode
        ? `\n                <div class="mapper-prompt-row mapper-prompt-row-compact ${d}" data-mapper-row="${t}">\n                    <div class="mapper-prompt-header mapper-prompt-header-compact">\n                        <span class="mapper-prompt-num">Frame ${t + 1}</span>\n                        <div class="mapper-prompt-actions">\n                            <button class="mapper-prompt-action-btn danger" data-mapper-delete="${t}" title="Remove frame">\n                                <span class="material-symbols-outlined">delete</span>\n                            </button>\n                        </div>\n                    </div>\n                    ${c}\n                </div>\n            `
        : `\n            <div class="mapper-prompt-row ${d}" data-mapper-row="${t}">\n                <div class="mapper-prompt-header">\n                    <span class="mapper-prompt-num">#${a}</span>\n                    <span class="mapper-prompt-text" data-mapper-text="${t}"\n                          title="${se(e)}">${se(r)}</span>\n                    <div class="mapper-prompt-actions">\n                        <button class="mapper-prompt-action-btn" data-mapper-edit="${t}" title="Edit prompt">\n                            <span class="material-symbols-outlined">edit</span>\n                        </button>\n                        <button class="mapper-prompt-action-btn danger" data-mapper-delete="${t}" title="Delete prompt">\n                            <span class="material-symbols-outlined">delete</span>\n                        </button>\n                    </div>\n                </div>\n                ${c}\n            </div>\n        `;
    })
    .join("");
  let g = "";
  (l.singlePromptMode &&
    (g =
      '\n            <div class="mapper-single-banner">\n                <span class="material-symbols-outlined">link</span>\n                Single prompt mode — all start frames share the same prompt.\n            </div>\n        '),
    (e.innerHTML = g + m + u),
    aa(),
    Xt(),
    Zt());
}
function ta(e) {
  const t = K.find((t) => t.mediaId === e);
  if (t)
    return t.fileName.length > 6
      ? t.fileName.substring(0, 5) + "…"
      : t.fileName;
  const a = y.find((t) => t.mediaId === e);
  if (a) {
    const e = a.tag ? "@" + a.tag : a.fileName;
    return e.length > 6 ? e.substring(0, 5) + "…" : e;
  }
  return e.substring(0, 5) + "…";
}
function aa() {
  (document.querySelectorAll("[data-mapper-add]").forEach((e) => {
    e.addEventListener("click", (t) => {
      (t.stopPropagation(), sa(parseInt(e.dataset.mapperAdd), e));
    });
  }),
    document.querySelectorAll("[data-mapper-change]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), sa(parseInt(e.dataset.mapperChange), e));
      });
    }),
    document.querySelectorAll("[data-mapper-remove-frame]").forEach((e) => {
      e.addEventListener("click", (t) => {
        t.stopPropagation();
        const a = parseInt(e.dataset.mapperRemoveFrame);
        ((W[a] = null), ea());
      });
    }),
    document.querySelectorAll("[data-mapper-remove-ref]").forEach((e) => {
      e.addEventListener("click", (t) => {
        t.stopPropagation();
        const a = e.dataset.mapperRemoveRef.split("-"),
          n = parseInt(a[0]),
          r = parseInt(a[1]);
        (Q[n] && Q[n].splice(r, 1), ea());
      });
    }),
    document.querySelectorAll("[data-mapper-edit]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), na(parseInt(e.dataset.mapperEdit)));
      });
    }),
    document.querySelectorAll("[data-mapper-delete]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), ra(parseInt(e.dataset.mapperDelete)));
      });
    }),
    document.querySelectorAll("[data-mapper-add-start]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(),
          sa(parseInt(e.dataset.mapperAddStart), e, "start"));
      });
    }),
    document.querySelectorAll("[data-mapper-change-start]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(),
          sa(parseInt(e.dataset.mapperChangeStart), e, "start"));
      });
    }),
    document.querySelectorAll("[data-mapper-remove-start]").forEach((e) => {
      e.addEventListener("click", (t) => {
        t.stopPropagation();
        const a = parseInt(e.dataset.mapperRemoveStart);
        ((W[a] = null), ea());
      });
    }),
    document.querySelectorAll("[data-mapper-add-end]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), sa(parseInt(e.dataset.mapperAddEnd), e, "end"));
      });
    }),
    document.querySelectorAll("[data-mapper-change-end]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(),
          sa(parseInt(e.dataset.mapperChangeEnd), e, "end"));
      });
    }),
    document.querySelectorAll("[data-mapper-remove-end]").forEach((e) => {
      e.addEventListener("click", (t) => {
        t.stopPropagation();
        const a = parseInt(e.dataset.mapperRemoveEnd);
        ((V[a] = null), ea());
      });
    }));
  let e = null,
    t = null,
    a = null,
    n = 0;
  function r() {
    (a && (clearInterval(a), (a = null)), (n = 0));
  }
  function o(e) {
    const t = document.getElementById("mapper-prompt-list");
    if (!t) return;
    const o = t.getBoundingClientRect();
    let s = 0;
    if (e < o.top + 60) {
      const t = e - o.top,
        a = Math.max(0, 1 - t / 60);
      s = -Math.ceil(14 * a);
    } else if (e > o.bottom - 60) {
      const t = o.bottom - e,
        a = Math.max(0, 1 - t / 60);
      s = Math.ceil(14 * a);
    }
    0 !== s
      ? ((n = s),
        a ||
          (a = setInterval(() => {
            t.scrollTop += n;
          }, 16)))
      : r();
  }
  function s() {
    document.querySelectorAll(".mapper-drop-target-active").forEach((e) => {
      e.classList.remove("mapper-drop-target-active");
    });
  }
  function i(a, n, o) {
    const i =
      a.closest(".mapper-prompt-refs") || a.closest(".mapper-frame-row");
    i &&
      (a.addEventListener("mousedown", () => {
        (function () {
          if ($t) return !0;
          const e = document.getElementById("mapper-upload-progress");
          return (
            !(!e || "flex" !== e.style.display) ||
            !!document.querySelector(".mapper-prompt-text.editing") ||
            !!document.querySelector(".mapper-shared-prompt-text:focus")
          );
        })() || (i.draggable = !0);
      }),
      a.addEventListener("mouseup", () => {
        i.draggable = !1;
      }),
      i.addEventListener("dragstart", (a) => {
        i.draggable
          ? ((e = n),
            (t = o),
            (window._mapperIsDragging = !0),
            i.classList.add("mapper-is-dragging"),
            (a.dataTransfer.effectAllowed = "move"),
            a.dataTransfer.setData("text/plain", `${n}:${o}`))
          : a.preventDefault();
      }),
      i.addEventListener("dragend", () => {
        ((i.draggable = !1),
          i.classList.remove("mapper-is-dragging"),
          s(),
          r(),
          (e = null),
          (t = null),
          (window._mapperIsDragging = !1));
      }));
  }
  function l(a, n, i) {
    (a.addEventListener("dragover", (r) => {
      null !== e &&
        (o(r.clientY),
        e === n &&
          t !== i &&
          (r.preventDefault(),
          (r.dataTransfer.dropEffect = "move"),
          s(),
          a.classList.add("mapper-drop-target-active")));
    }),
      a.addEventListener("dragleave", (e) => {
        a.contains(e.relatedTarget) ||
          a.classList.remove("mapper-drop-target-active");
      }),
      a.addEventListener("drop", (a) => {
        (a.preventDefault(),
          r(),
          null !== e &&
            e === n &&
            t !== i &&
            (s(),
            "start" === n
              ? zt(t, i)
              : "end" === n
                ? Yt(t, i)
                : "ref" === n && Kt(t, i)));
      }));
  }
  (document.querySelectorAll("[data-drag-start]").forEach((e) => {
    i(e, "start", parseInt(e.dataset.dragStart));
  }),
    document.querySelectorAll("[data-drag-end]").forEach((e) => {
      i(e, "end", parseInt(e.dataset.dragEnd));
    }),
    document.querySelectorAll("[data-drag-ref]").forEach((e) => {
      i(e, "ref", parseInt(e.dataset.dragRef));
    }),
    document.querySelectorAll("[data-drop-start]").forEach((e) => {
      l(e, "start", parseInt(e.dataset.dropStart));
    }),
    document.querySelectorAll("[data-drop-end]").forEach((e) => {
      l(e, "end", parseInt(e.dataset.dropEnd));
    }),
    document.querySelectorAll("[data-drop-ref]").forEach((e) => {
      l(e, "ref", parseInt(e.dataset.dropRef));
    }));
  const d = document.getElementById("mapper-prompt-list");
  (d &&
    !d._dragScrollBound &&
    ((d._dragScrollBound = !0),
    d.addEventListener("dragover", (t) => {
      null !== e && (t.preventDefault(), o(t.clientY));
    }),
    d.addEventListener("dragleave", (e) => {
      d.contains(e.relatedTarget) || r();
    })),
    window._mapperDragWheelBound ||
      ((window._mapperDragWheelBound = !0),
      document.addEventListener(
        "wheel",
        (e) => {
          if (!window._mapperIsDragging) return;
          const t = document.getElementById("mapper-prompt-list");
          if (!t) return;
          const a = document.getElementById("reference-mapper-modal");
          a &&
            "none" !== a.style.display &&
            (e.preventDefault(), (t.scrollTop += e.deltaY));
        },
        { passive: !1 },
      )));
}
function na(e) {
  const t = document.querySelector(`[data-mapper-text="${e}"]`);
  if (!t) return;
  ((t.textContent = z[e]),
    (t.contentEditable = "true"),
    t.classList.add("editing"),
    t.focus());
  const a = document.createRange();
  a.selectNodeContents(t);
  const n = window.getSelection();
  (n.removeAllRanges(),
    n.addRange(a),
    t.addEventListener(
      "blur",
      () => {
        ((t.contentEditable = "false"), t.classList.remove("editing"));
        const a = t.textContent.trim();
        (a && a !== z[e] && (l.singlePromptMode ? z.fill(a) : (z[e] = a)),
          ea());
      },
      { once: !0 },
    ),
    t.addEventListener("keydown", (a) => {
      ("Enter" !== a.key || a.shiftKey || (a.preventDefault(), t.blur()),
        "Escape" === a.key && ((t.textContent = z[e]), t.blur()));
    }));
}
function ra(e) {
  if (z.length <= 1) return void Te("⚠️ Can't delete the last prompt", "warn");
  z.splice(e, 1);
  const t = ue();
  ("start_frame" === t
    ? W.splice(e, 1)
    : "start_end_frame" === t
      ? (W.splice(e, 1), V.splice(e, 1))
      : Q.splice(e, 1),
    ea());
}
function oa() {
  z.push("");
  const e = ue();
  ("start_frame" === e
    ? W.push(null)
    : "start_end_frame" === e
      ? (W.push(null), V.push(null))
      : Q.push([]),
    ea());
  const t = z.length - 1;
  setTimeout(() => na(t), 100);
}
function sa(e, t, a = null) {
  (la(), (Y = { promptIndex: e, slotType: a }));
  const n = ue();
  let r;
  r =
    "start" === a
      ? "Set Start Frame"
      : "end" === a
        ? "Set End Frame"
        : "start_frame" === n
          ? "Set Start Frame"
          : "Add Reference Image";
  const o = document.createElement("div");
  ((o.className = "mapper-choice-popup"),
    (o.id = "mapper-choice-popup-el"),
    (o.innerHTML =
      '\n        <button class="mapper-choice-option" id="mapper-choice-upload">\n            <span class="material-symbols-outlined">upload_file</span>\n            Upload from PC\n        </button>\n        <button class="mapper-choice-option" id="mapper-choice-library">\n            <span class="material-symbols-outlined">photo_library</span>\n            Pick from Library\n        </button>\n    '));
  const s =
    t.closest(".mapper-prompt-row") ||
    t.closest(".mapper-prompt-refs") ||
    t.closest(".mapper-frame-row");
  (s
    ? ((s.style.position = "relative"), s.appendChild(o))
    : ((t.parentElement.style.position = "relative"),
      t.parentElement.appendChild(o)),
    o.querySelector("#mapper-choice-upload").addEventListener("click", (t) => {
      (t.stopPropagation(), la(), da(e, a));
    }),
    o.querySelector("#mapper-choice-library").addEventListener("click", (t) => {
      (t.stopPropagation(), la(), ca(e, a));
    }),
    setTimeout(() => {
      document.addEventListener("click", ia);
    }, 50));
}
function ia(e) {
  const t = document.getElementById("mapper-choice-popup-el");
  t && !t.contains(e.target) && la();
}
function la() {
  Y = null;
  const e = document.getElementById("mapper-choice-popup-el");
  (e && e.remove(), document.removeEventListener("click", ia));
}
function da(e, t = null) {
  const a = r("#mapper-file-input");
  a.value = "";
  const n = async (r) => {
    a.removeEventListener("change", n);
    const o = r.target.files[0];
    if (o)
      if (o.type.startsWith("image/")) {
        if (await St("upload images")) {
          ba("Uploading 1 image...");
          try {
            const a = await _e(o);
            (pa(e, a.mediaId, t),
              ea(),
              Te(`📤 Uploaded "${o.name}" → prompt #${e + 1}`, "success"));
          } catch (e) {
            Te(`❌ Upload failed: ${e.message}`, "error");
          }
          ya();
        }
      } else Te("⚠️ Not an image file", "warn");
  };
  (a.addEventListener("change", n), a.click());
}
function ca(e, t = null) {
  const a = ue();
  let n;
  ((n =
    "start" === t || ("start_frame" === a && !t)
      ? "start_frame"
      : "end" === t
        ? "end_frame"
        : "image_reference"),
    Ct({
      mode: "single",
      role: n,
      maxSelect: 1,
      currentSelection: [],
      onDone: (a) => {
        a.length > 0 && (pa(e, a[0], t), ea());
      },
    }));
}
function pa(e, t, a = null) {
  const n = ue();
  "start_frame" === n
    ? (W[e] = t)
    : "start_end_frame" === n
      ? "end" === a
        ? (V[e] = t)
        : (W[e] = t)
      : (Q[e] || (Q[e] = []),
        Q[e].includes(t)
          ? Te("⚠️ Image already assigned to this prompt", "warn")
          : Q[e].push(t));
}
function ma() {
  const e = r("#mapper-bulk-file-input");
  e.value = "";
  const t = ue(),
    a = "start_frame" === t || "start_end_frame" === t,
    n = async (t) => {
      e.removeEventListener("change", n);
      const r = Array.from(t.target.files).filter((e) =>
        e.type.startsWith("image/"),
      );
      if (0 === r.length) return;
      let o = 0;
      if (l.singlePromptMode && a)
        for (let e = 0; e < W.length; e++) {
          if (!W[e]) {
            o = e;
            break;
          }
          o = e + 1;
        }
      const s =
          l.singlePromptMode && a ? r.length : Math.min(r.length, z.length),
        i = r.slice(0, s);
      if (!(await St("upload images"))) return;
      ba(`Uploading ${s} images... (0/${s})`);
      const d = await we(i, {
        maxConcurrent: 10,
        delayBetweenMs: 100,
        onProgress: (e, t, a, n) => {
          va(`Uploading ${t} images... (${e}/${t})`);
        },
      });
      ya();
      let c = 0,
        p = 0;
      const m = [],
        u = [];
      if (
        (d.forEach((e, t) => {
          const n = l.singlePromptMode && a ? o + t : t;
          e && e.success
            ? (a
                ? (W[n] = e.entry.mediaId)
                : (Q[n] || (Q[n] = []),
                  Q[n].includes(e.entry.mediaId) || Q[n].push(e.entry.mediaId)),
              c++)
            : (p++,
              e &&
                (m.push(e.fileName),
                u.push(n),
                Te(`❌ "${e.fileName}" — ${e.error}`, "error")));
        }),
        l.singlePromptMode)
      ) {
        const e = W.filter((e) => e).length,
          t = z[0] || "";
        for (; z.length < e; ) z.push(t);
      }
      (ea(),
        le("mapper_action", {
          action: "auto_1to1",
          prompts: z.length,
          images: c,
        }));
      const g =
        r.length > z.length ? ` (${r.length - z.length} extras ignored)` : "";
      if (0 === p)
        Te(`🔗 Auto 1:1 — ${c} images mapped successfully${g}`, "success");
      else {
        Te(`🔗 Auto 1:1 — ${c} images mapped${g}`, c > 0 ? "success" : "warn");
        const e = u.map((e) => `#${e + 1}`).join(", ");
        (Te(
          `⚠️ ${p} image${p > 1 ? "s" : ""} rejected — prompt${p > 1 ? "s" : ""} ${e} ${p > 1 ? "have" : "has"} no reference. Fix below ↓`,
          "warn",
        ),
          ha());
      }
      r.length < z.length &&
        Te(
          `ℹ️ Prompts #${r.length + 1}–#${z.length} have no image — only ${r.length} files for ${z.length} prompts`,
          "info",
        );
    };
  (e.addEventListener("change", n), e.click());
}
function ua() {
  if (l.singlePromptMode)
    return void Te(
      '⚠️ "Same for All" doesn\'t apply in single-prompt mode. Use Auto 1:1 to add multiple start frames.',
      "warn",
    );
  const e = ue(),
    t = "start_frame" === e || "start_end_frame" === e,
    a = r(t ? "#mapper-file-input" : "#mapper-bulk-file-input");
  a.value = "";
  const n = async (e) => {
    a.removeEventListener("change", n);
    const r = Array.from(e.target.files).filter((e) =>
      e.type.startsWith("image/"),
    );
    if (0 === r.length) return;
    t &&
      r.length > 1 &&
      Te(
        "ℹ️ One start frame per prompt — using first image (end frames must be set manually)",
        "info",
      );
    const o = t ? [r[0]] : r,
      s = o.length;
    if (!(await St("upload images"))) return;
    ba(`Uploading ${s} image${s > 1 ? "s" : ""}...`);
    const i = await we(o, {
      maxConcurrent: 10,
      delayBetweenMs: 100,
      onProgress: (e, t, a, n) => {
        t > 1 && va(`Uploading ${t} images... (${e}/${t})`);
      },
    });
    ya();
    const l = [];
    let d = 0;
    const c = [];
    if (
      (i.forEach((e) => {
        e && e.success
          ? l.push(e.entry.mediaId)
          : (d++,
            e &&
              (c.push(e.fileName),
              Te(`❌ "${e.fileName}" — ${e.error}`, "error")));
      }),
      0 !== l.length)
    ) {
      for (let e = 0; e < z.length; e++)
        if (t) W[e] = l[0];
        else {
          Q[e] || (Q[e] = []);
          for (const t of l) Q[e].includes(t) || Q[e].push(t);
        }
      (ea(),
        le("mapper_action", {
          action: "same_for_all",
          prompts: z.length,
          images: l.length,
        }),
        0 === d
          ? Te(
              `📋 Same for All — applied ${l.length} image${l.length > 1 ? "s" : ""} to all ${z.length} prompts`,
              "success",
            )
          : (Te(
              `📋 Same for All — applied ${l.length} image${l.length > 1 ? "s" : ""} to all ${z.length} prompts`,
              "success",
            ),
            Te(
              `⚠️ ${d} image${d > 1 ? "s" : ""} rejected: ${c.map((e) => `"${e}"`).join(", ")}. Try re-saving as JPG/PNG.`,
              "warn",
            )));
    } else Te("❌ All uploads failed — no references applied", "error");
  };
  (a.addEventListener("change", n), a.click());
}
function ga() {
  const e = ue(),
    t = "start_frame" === e || "start_end_frame" === e;
  if (0 === gt().length)
    return void Te(
      "⚠️ No tagged images in library — tag images in the Library tab first",
      "warn",
    );
  let a = 0,
    n = new Set();
  const r = /@([a-z0-9_-]+)/gi;
  for (let e = 0; e < z.length; e++) {
    const o = [...z[e].matchAll(r)];
    if (0 !== o.length)
      for (const r of o) {
        const o = r[1].toLowerCase(),
          s = ft(o);
        s
          ? t
            ? ((W[e] = s.mediaId), a++)
            : (Q[e] || (Q[e] = []),
              Q[e].includes(s.mediaId) || (Q[e].push(s.mediaId), a++))
          : n.add(o);
      }
  }
  if (
    (ea(),
    le("mapper_action", { action: "auto_tag", prompts: z.length, matches: a }),
    0 === a && 0 === n.size)
  )
    Te(
      "⚠️ No @tags found in prompts — use @tagname in your prompt text",
      "warn",
    );
  else if (0 === a && n.size > 0)
    Te(`⚠️ No library images tagged with @${[...n].join(", @")}`, "warn");
  else {
    a > 0 && (B = !0);
    let e = `🏷 Auto-Tag — ${a} match${1 !== a ? "es" : ""} mapped`;
    (n.size > 0 && (e += ` (no match for @${[...n].join(", @")})`),
      Te(e, "success"));
  }
}
function fa() {
  ("start_frame" === ue() ? (W = z.map(() => null)) : (Q = z.map(() => [])),
    ea(),
    Te("🗑 All mappings cleared", "info"),
    le("mapper_action", { action: "clear", prompts: z.length }));
}
function ha() {
  const e = ue();
  let t = -1;
  for (let a = 0; a < z.length; a++)
    if ("start_frame" === e) {
      if (!W[a]) {
        t = a;
        break;
      }
    } else if ("start_end_frame" === e) {
      if (!W[a] || !V[a]) {
        t = a;
        break;
      }
    } else if (!Q[a] || 0 === Q[a].length) {
      t = a;
      break;
    }
  -1 !== t &&
    setTimeout(() => {
      const e = document.querySelector(`[data-mapper-row="${t}"]`);
      e &&
        (e.scrollIntoView({ behavior: "smooth", block: "center" }),
        e.classList.add("mapper-row-highlight"),
        setTimeout(() => e.classList.remove("mapper-row-highlight"), 2e3));
    }, 150);
}
function ba(e) {
  const t = r("#mapper-upload-progress"),
    a = r("#mapper-upload-progress-text");
  (t && (t.style.display = "flex"), a && (a.textContent = e), wa(!0));
}
function va(e) {
  const t = r("#mapper-upload-progress-text");
  t && (t.textContent = e);
}
function ya() {
  const e = r("#mapper-upload-progress");
  (e && (e.style.display = "none"), wa(!1));
}
function wa(e) {
  [
    "#btn-mapper-1to1",
    "#btn-mapper-all",
    "#btn-mapper-autotag",
    "#btn-mapper-clear",
    "#btn-mapper-save",
  ].forEach((t) => {
    const a = r(t);
    a && (a.disabled = e);
  });
}
function Ia() {
  const e = r("#prompt-input"),
    t = r("#prompt-lock-overlay"),
    a = r("#prompt-footer-normal"),
    n = r("#prompt-footer-locked"),
    o = r("#img-reference-section"),
    s = r("#btn-open-mapper-video"),
    i = r("#btn-open-mapper-vidref");
  if ("mapped" === l.referenceMode) {
    if (
      ((e.readOnly = !0),
      e.classList.add("locked"),
      t && (t.style.display = "flex"),
      a && (a.style.display = "none"),
      n)
    ) {
      n.style.display = "flex";
      const t = r("#prompt-count-locked");
      if (t)
        if (l.singlePromptMode) {
          const e = Object.keys(l.promptStartFrameMap || {}).filter(
            (e) => l.promptStartFrameMap[e],
          ).length;
          t.textContent = 1 === e ? "1 frame" : `${e} frames`;
        } else {
          const a = e.value.split("\n").filter((e) => e.trim().length > 0);
          t.textContent = 1 === a.length ? "1 prompt" : `${a.length} prompts`;
        }
    }
    (o && (o.style.display = "none"),
      s && (s.style.display = "none"),
      i && (i.style.display = "none"));
    const d = r("#btn-open-mapper");
    d && (d.style.display = "none");
    const c = r("#btn-import-txt");
    c && (c.disabled = !0);
  } else {
    ((e.readOnly = !1),
      e.classList.remove("locked"),
      t && (t.style.display = "none"),
      a && (a.style.display = "flex"),
      n && (n.style.display = "none"),
      o && (o.style.display = "block"));
    const s = r("#btn-import-txt");
    (s && (s.disabled = !1), Ea());
  }
}
function Ea() {
  const e = r("#btn-open-mapper"),
    t = r("#btn-open-mapper-video"),
    a = r("#btn-open-mapper-vidref");
  if (!e || !t || !a) return;
  if ("mapped" === l.referenceMode)
    return (
      (e.style.display = "none"),
      (t.style.display = "none"),
      void (a.style.display = "none")
    );
  const n = l.mode,
    o = l.settings.videoMode || "text";
  ((e.style.display = "none"),
    (t.style.display = "none"),
    (a.style.display = "none"),
    "image" !== n
      ? "text" !== o &&
        ("start_frame" !== o && "start_end_frame" !== o
          ? "reference" !== o || (a.style.display = "inline-flex")
          : (t.style.display = "inline-flex"))
      : (e.style.display = "inline-flex"));
}
function ka() {
  const e = r("#mapping-preview-section"),
    t = r("#mapping-preview-list");
  if (!e || !t) return;
  if ("mapped" !== l.referenceMode) return void (e.style.display = "none");
  const a = r("#prompt-input")
    .value.split("\n")
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
  if (0 === a.length) return void (e.style.display = "none");
  const n = ue(),
    o = "start_frame" === n,
    s = "start_end_frame" === n;
  if (l.singlePromptMode && o) {
    const a = Object.keys(l.promptStartFrameMap)
      .map(Number)
      .sort((e, t) => e - t)
      .map((e) => l.promptStartFrameMap[e])
      .filter(Boolean);
    if (0 === a.length) return void (e.style.display = "none");
    e.style.display = "block";
    const n = e.querySelector(".mapping-preview-title");
    return (
      n && (n.textContent = "📎 Start Frames"),
      void (t.innerHTML = `\n        <div class="mapping-preview-row mapping-preview-row-compact">\n            <span class="mapping-preview-icon">🖼️</span>\n            <span class="mapping-preview-count">${a.length} start frame${a.length > 1 ? "s" : ""} assigned</span>\n        </div>\n    `)
    );
  }
  e.style.display = "block";
  const i = e.querySelector(".mapping-preview-title");
  (i &&
    (i.textContent = o
      ? "📎 Start Frame Mapping"
      : s
        ? "📎 Start + End Frame Mapping"
        : "📎 Reference Mapping"),
    (t.innerHTML = a
      .map((e, t) => {
        const a = e.length > 40 ? e.substring(0, 37) + "..." : e;
        if (o) {
          const e = l.promptStartFrameMap[t],
            n = e ? ve(e) : null;
          return `\n                <div class="mapping-preview-row">\n                    <span class="mapping-preview-num">${t + 1}.</span>\n                    ${n ? `<img class="mapping-preview-thumb" src="${n}" alt="frame">` : e ? '<span class="mapping-preview-icon">🖼</span>' : '<span class="mapping-preview-shared">(no frame)</span>'}\n                    <span class="mapping-preview-prompt">${se(a)}</span>\n                </div>\n            `;
        }
        if (s) {
          const e = l.promptStartFrameMap[t],
            n = l.promptEndFrameMap[t],
            r = e ? ve(e) : null,
            o = n ? ve(n) : null;
          return `\n                <div class="mapping-preview-row">\n                    <span class="mapping-preview-num">${t + 1}.</span>\n                    ${r ? `<img class="mapping-preview-thumb" src="${r}" alt="start">` : e ? '<span class="mapping-preview-icon">🖼</span>' : '<span class="mapping-preview-shared">(no start)</span>'}\n                    <span class="mapping-preview-arrow">→</span>\n                    ${o ? `<img class="mapping-preview-thumb" src="${o}" alt="end">` : n ? '<span class="mapping-preview-icon">🖼</span>' : '<span class="mapping-preview-shared">(no end)</span>'}\n                    <span class="mapping-preview-prompt">${se(a)}</span>\n                </div>\n            `;
        }
        {
          const e = l.promptReferenceMap[t] || [];
          return `\n                <div class="mapping-preview-row">\n                    <span class="mapping-preview-num">${t + 1}.</span>\n                    ${e
            .map((e) => {
              const t = ve(e);
              return t
                ? `<img class="mapping-preview-thumb" src="${t}" alt="ref">`
                : '<span class="mapping-preview-icon">🖼</span>';
            })
            .join(
              "",
            )}${0 === e.length ? '<span class="mapping-preview-shared">(no reference)</span>' : ""}\n                    <span class="mapping-preview-prompt">${se(a)}</span>\n                </div>\n            `;
        }
      })
      .join("")));
}
function Ma(e, t) {
  if ("video" === t) return "portrait" === e ? "ratio-9-16" : "ratio-16-9";
  switch (e) {
    case "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE":
      return "ratio-4-3";
    case "IMAGE_ASPECT_RATIO_SQUARE":
      return "ratio-1-1";
    case "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR":
      return "ratio-3-4";
    case "IMAGE_ASPECT_RATIO_PORTRAIT":
      return "ratio-9-16";
    default:
      return "ratio-16-9";
  }
}
function $a() {
  if (l.activeBatchId) return !0;
  if (l.batches.some((e) => "running" === e.status)) return !0;
  const e = l.stats || {};
  if (e.total > 0 && e.downloaded + e.failed < e.total) return !0;
  for (const [e, t] of u)
    if ("generating" === t.status || "downloading" === t.status) return !0;
  return !1;
}
(r("#btn-close-picker")?.addEventListener("click", Rt),
  r("#picker-modal")?.addEventListener("click", (e) => {
    e.target === r("#picker-modal") && Rt();
  }),
  r("#btn-picker-done")?.addEventListener("click", () => {
    $t ? Te("⚠️ Please wait for uploads to finish", "warn") : (M && M(E), Rt());
  }),
  r("#btn-picker-upload")?.addEventListener("click", () => {
    r("#picker-upload-input").click();
  }),
  r("#picker-upload-input")?.addEventListener("change", async (e) => {
    (await Nt(e.target.files), (e.target.value = ""));
  }),
  r("#btn-picker-upload-more")?.addEventListener("click", () => {
    r("#picker-upload-more-input").click();
  }),
  r("#picker-upload-more-input")?.addEventListener("change", async (e) => {
    (await Nt(e.target.files), (e.target.value = ""));
  }),
  r("#btn-close-mapper")?.addEventListener("click", Vt),
  r("#btn-mapper-cancel")?.addEventListener("click", Vt),
  r("#reference-mapper-modal")?.addEventListener("click", (e) => {
    e.target === r("#reference-mapper-modal") && Vt();
  }),
  r("#btn-mapper-save")?.addEventListener("click", Jt),
  r("#btn-mapper-1to1")?.addEventListener("click", ma),
  r("#btn-mapper-all")?.addEventListener("click", ua),
  r("#btn-mapper-autotag")?.addEventListener("click", ga),
  r("#btn-mapper-clear")?.addEventListener("click", fa),
  r("#btn-mapper-add-prompt")?.addEventListener("click", oa),
  r("#btn-open-mapper")?.addEventListener("click", Wt),
  r("#btn-open-mapper-video")?.addEventListener("click", Wt),
  r("#btn-open-mapper-vidref")?.addEventListener("click", Wt),
  r("#mapper-strip-tags")?.addEventListener("change", (e) => {
    ((l.stripTagsOnSave = e.target.checked), J());
  }),
  r("#btn-edit-mapping")?.addEventListener("click", Wt),
  r("#btn-unlock-clear")?.addEventListener("click", async () => {
    if (
      await an({
        icon: "🔓",
        title: "Clear Reference Mapping?",
        message:
          "This will remove all per-prompt reference mappings and uploaded mapper images.",
        confirmText: "Clear All",
        confirmClass: "btn-flow-danger",
      })
    ) {
      if ((be(), l.singlePromptMode)) {
        l.singlePromptMode = !1;
        const e = r("#single-prompt-toggle");
        (e && (e.checked = !1),
          "function" == typeof tr && tr(),
          "function" == typeof er && er());
      }
      (void 0 !== La && La.clear(),
        J(),
        Ia(),
        ka(),
        Ea(),
        Te("🔓 Reference mapping cleared — back to normal mode", "info"));
    }
  }));
const La = new Map();
function xa(e) {
  return (
    !!e &&
    "video" !== e.type &&
    !e.isPlaceholder &&
    !(!e.mediaId || e.mediaId.startsWith("placeholder-")) &&
    "failed" !== e.status &&
    "generating" !== e.status
  );
}
async function Sa(e) {
  return new Promise((t) => {
    const a = new Image();
    ((a.crossOrigin = "anonymous"),
      (a.onload = () => {
        try {
          const e = document.createElement("canvas"),
            n = 60;
          let r = a.width,
            o = a.height;
          (r > o
            ? r > n && ((o = Math.round((o * n) / r)), (r = n))
            : o > n && ((r = Math.round((r * n) / o)), (o = n)),
            (e.width = r),
            (e.height = o),
            e.getContext("2d").drawImage(a, 0, 0, r, o),
            t(e.toDataURL("image/jpeg", 0.6)));
        } catch (e) {
          t(null);
        }
      }),
      (a.onerror = () => t(null)),
      (a.src = e));
  });
}
async function _a(e) {
  if (!e || 0 === e.length) return;
  if ($a())
    return void Gn({
      icon: "⏳",
      title: "Wait for Current Batch",
      message:
        "You can't start animating while a batch is generating or downloads are in progress.",
      hint: "Wait for the current batch to finish, or stop it from the Queue tab.",
    });
  const t = e.map((e) => u.get(e)).filter((e) => e && xa(e));
  0 !== t.length
    ? await Pa(t)
    : Gn({
        icon: "⚠️",
        title: "No Animatable Images",
        message:
          "Selected items are not animatable. Wait for images to finish generating.",
        hint: "Already-generated videos and failed items can't be animated.",
      });
}
async function Pa(e) {
  (Te(
    `✨ Setting up animate flow for ${e.length} image${e.length > 1 ? "s" : ""}...`,
    "info",
  ),
    (l.mode = "video"),
    o("[data-mode]").forEach((e) =>
      e.classList.toggle("active", "video" === e.dataset.mode),
    ),
    (r("#image-settings").style.display = "none"),
    (r("#video-settings").style.display = "block"),
    (l.settings.videoMode = "start_frame"),
    o("[data-vid-mode]").forEach((e) =>
      e.classList.toggle("active", "start_frame" === e.dataset.vidMode),
    ),
    "function" == typeof Wn && Wn(),
    (l.singlePromptMode = !0));
  const t = r("#single-prompt-toggle");
  (t && (t.checked = !0),
    "function" == typeof tr && tr(),
    "function" == typeof er && er(),
    (l.referenceMode = "mapped"),
    (l.promptStartFrameMap = {}),
    (l.promptReferenceMap = {}),
    (l.promptEndFrameMap = {}),
    e.forEach((e, t) => {
      l.promptStartFrameMap[t] = e.mediaId;
    }));
  for (const t of e)
    if (!La.has(t.mediaId)) {
      let e = null;
      (t.fifeUrl && (e = await Sa(t.fifeUrl)),
        La.set(t.mediaId, e || t.fifeUrl));
    }
  ((r("#prompt-input").value = ""),
    "function" == typeof Hn && Hn(),
    J(),
    o(".tab").forEach((e) => e.classList.remove("active")),
    o(".tab-content").forEach((e) => e.classList.remove("active")),
    r('[data-tab="control"]').classList.add("active"),
    r("#tab-control").classList.add("active"),
    setTimeout(() => {
      Wt();
    }, 200),
    Te(
      `✅ ${e.length} start frame${e.length > 1 ? "s" : ""} loaded — type your prompt and save.`,
      "success",
    ),
    "function" == typeof le &&
      le("animate_flow_started", { image_count: e.length }));
}
function Aa(e) {
  const t = r("#mapping-preview-section"),
    a = r("#mapping-preview-list");
  if (!t || !a) return;
  if (0 === e.length) return void (t.style.display = "none");
  t.style.display = "block";
  const n = t.querySelector(".mapping-preview-title");
  n && (n.textContent = "📎 Start Frames Ready");
  const o = ve(e[0].mediaId),
    s = o
      ? `<img class="mapping-preview-thumb" src="${o}" alt="frame">`
      : '<span class="mapping-preview-icon">🖼</span>';
  a.innerHTML = `\n        <div class="mapping-preview-row mapping-preview-row-compact">\n            ${s}\n            <span class="mapping-preview-count">${e.length} start frame${e.length > 1 ? "s" : ""} ready — type your prompt above</span>\n        </div>\n    `;
}
let Ta = null;
function Ca() {
  (Ta && clearTimeout(Ta),
    (Ta = setTimeout(() => {
      (ee(), (Ta = null));
    }, 2e3)));
}
let Ra = null;
function Fa() {
  Ra ||
    (Ra = requestAnimationFrame(() => {
      (Ba(), (Ra = null));
    }));
}
function Da(e) {
  const {
    mediaId: t,
    fifeUrl: a,
    promptIndex: n,
    prompt: r,
    type: o,
    videoUrl: s,
    workflowId: i,
    batchId: l,
    batchName: d,
  } = e;
  if (!t) return;
  const c = h + n,
    p =
      "video" === o
        ? null
        : `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${t}`;
  if (u.has(t)) {
    const e = u.get(t);
    return (
      s && (e.videoUrl = s),
      !e.fifeUrl && p && (e.fifeUrl = p),
      Fa(),
      void Ca()
    );
  }
  let m = !1;
  if (l)
    for (const [e, d] of u)
      if (
        d.isPlaceholder &&
        "generating" === d.status &&
        d.batchId === l &&
        d.originalIndex === n
      ) {
        const n = d.suffix,
          l = d.isPortrait,
          c = d.batchId,
          g = d.batchName,
          f = d.promptIndex,
          h = d.refThumbs || [],
          b = d.originalIndex;
        (u.delete(e),
          u.set(t, {
            mediaId: t,
            promptIndex: f,
            prompt: r || "",
            fifeUrl: a || p,
            videoUrl: s || null,
            status: "ready",
            type: o || "image",
            isPlaceholder: !1,
            suffix: n,
            isPortrait: l,
            originalIndex: b,
            workflowId: i || null,
            refThumbs: h,
            batchId: c,
            batchName: g,
          }),
          (m = !0));
        break;
      }
  if (!m)
    for (const [e, n] of u)
      if (n.isPlaceholder && n.promptIndex === c && "generating" === n.status) {
        const g = n.suffix,
          f = n.isPortrait,
          h = n.batchId,
          b = n.batchName,
          v = n.originalIndex;
        (u.delete(e),
          u.set(t, {
            mediaId: t,
            promptIndex: c,
            prompt: r || "",
            fifeUrl: a || p,
            videoUrl: s || null,
            status: "ready",
            type: o || "image",
            isPlaceholder: !1,
            suffix: g,
            isPortrait: f,
            originalIndex: v,
            workflowId: i || null,
            refThumbs: n.refThumbs || [],
            batchId: h || l || null,
            batchName: b || d || null,
          }),
          (m = !0));
        break;
      }
  (m ||
    u.set(t, {
      mediaId: t,
      promptIndex: c,
      prompt: r || "",
      fifeUrl: a || p,
      videoUrl: s || null,
      status: "ready",
      type: o || "image",
      isPlaceholder: !1,
      originalIndex: n,
      workflowId: i || null,
      batchId: l || null,
      batchName: d || null,
    }),
    Fa(),
    Ca());
}
function Na(e, t) {
  const a = u.get(e);
  if (!a) return;
  a.status = t;
  const n = document.querySelector(`.gallery-item-v2[data-media-id="${e}"]`);
  if (n) {
    const e = n.querySelector(".gallery-item-status");
    if (e) {
      const a = {
          generating: { label: "Generating", cls: "st-generating" },
          ready: { label: "Ready", cls: "st-ready" },
          downloading: { label: "Saving", cls: "st-downloading" },
          done: { label: "Saved", cls: "st-done" },
          failed: { label: "Failed", cls: "st-failed" },
        },
        n = a[t] || a.generating;
      ((e.textContent = n.label),
        (e.className = "gallery-item-status " + n.cls));
    }
  } else Fa();
  Ca();
}
function qa(e, t, a, n) {
  const s = t.imageCount || 1,
    i = t.mode || "image",
    d = Ma("image" === i ? t.aspectRatio : t.videoRatio, i),
    c = "ratio-9-16" === d || "ratio-3-4" === d,
    p = a || e.map((e, t) => t),
    m = n?.batchId || null,
    f = n?.batchName || null;
  let b = !1,
    v = [];
  if (m)
    for (const [e, t] of u)
      t.batchId === m && (v.push({ key: e, item: t }), (b = !0));
  if (!b) {
    let e = -1;
    for (const [t, a] of u) a.promptIndex > e && (e = a.promptIndex);
    h = e + 1;
  }
  (e.forEach((e, a) => {
    const n = p[a],
      r = "video" === i ? t.videoCount || 1 : s;
    let o;
    if (b) {
      const e = v.find(({ item: e }) => e.originalIndex === n);
      if (e) {
        o = e.item.promptIndex;
        for (const { key: e, item: t } of v)
          t.originalIndex === n && (u.delete(e), g.delete(e));
      } else o = h + a;
    } else o = h + a;
    for (let t = 0; t < r; t++) {
      const a = `placeholder-${o}-${t}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        s = r > 1 && t > 0 ? String.fromCharCode(97 + t) : "";
      let p = [];
      const g = l.activeBatchId ? pn(l.activeBatchId) : null,
        h = g?.settings;
      if ("mapped" === h?.referenceMode && h?.perPromptThumbnails) {
        const e = h.perPromptStartFrames?.[n];
        if (e) {
          const t = h.perPromptThumbnails[e];
          t && p.push(t);
        }
        const t = h.perPromptReferences?.[n] || [];
        for (const e of t) {
          const t = h.perPromptThumbnails[e];
          t && p.push(t);
        }
      }
      u.set(a, {
        mediaId: a,
        promptIndex: o,
        prompt: e.substring(0, 60),
        fifeUrl: null,
        status: "generating",
        type: i,
        isPlaceholder: !0,
        suffix: s,
        isPortrait: c,
        ratioClass: d,
        originalIndex: n,
        refThumbs: p,
        batchId: m,
        batchName: f,
      });
    }
  }),
    g.clear(),
    Ba(),
    ee(),
    o(".tab").forEach((e) => e.classList.remove("active")),
    o(".tab-content").forEach((e) => e.classList.remove("active")),
    r('[data-tab="gallery"]').classList.add("active"),
    r("#tab-gallery").classList.add("active"));
}
function Oa() {
  let e = 0;
  for (const [t, a] of u)
    a.isPlaceholder &&
      "generating" === a.status &&
      ((a.status = "failed"), (a.isPlaceholder = !1), e++);
  return (e > 0 && (Ba(), Ca()), e);
}
function Ua() {
  const e = new Map();
  for (const [t, a] of u) {
    const n = a.batchId || "__ungrouped__",
      r = a.batchName || "Ungrouped";
    e.has(n) ||
      e.set(n, {
        batchId: n,
        batchName: r,
        prompts: new Map(),
        minPromptIndex: 1 / 0,
      });
    const o = e.get(n),
      s = a.promptIndex;
    (o.prompts.has(s) ||
      o.prompts.set(s, { promptIndex: s, prompt: a.prompt || "", items: [] }),
      o.prompts.get(s).items.push({ mediaId: t, ...a }),
      s < o.minPromptIndex && (o.minPromptIndex = s));
  }
  const t = [...e.values()].sort((e, t) =>
    "__ungrouped__" === e.batchId
      ? 1
      : "__ungrouped__" === t.batchId
        ? -1
        : t.minPromptIndex - e.minPromptIndex,
  );
  for (const e of t) {
    e.sortedPrompts = [...e.prompts.values()].sort(
      (e, t) => e.promptIndex - t.promptIndex,
    );
    for (const t of e.sortedPrompts)
      t.items.sort((e, t) => {
        const a = e.suffix || "",
          n = t.suffix || "";
        return a.localeCompare(n);
      });
  }
  return t;
}
function Ba() {
  const e = r("#gallery-groups");
  if (0 === u.size)
    return (
      (e.innerHTML =
        '\n            <div class="gallery-empty-v2">\n                <span class="material-symbols-outlined">auto_awesome</span>\n                Images will appear here as they generate\n            </div>\n        '),
      void Ya()
    );
  const t = Ua();
  ((e.innerHTML = t
    .map((e) => {
      const t = e.sortedPrompts.reduce((e, t) => e + t.items.length, 0),
        a = e.sortedPrompts.length,
        n = e.sortedPrompts.reduce(
          (e, t) => e + t.items.filter((e) => "done" === e.status).length,
          0,
        ),
        r = e.sortedPrompts.reduce(
          (e, t) => e + t.items.filter((e) => "failed" === e.status).length,
          0,
        );
      let o, s;
      e.sortedPrompts.reduce(
        (e, t) => e + t.items.filter((e) => "generating" === e.status).length,
        0,
      ) > 0
        ? ((o = "Generating"), (s = "bgs-generating"))
        : r > 0 && n > 0
          ? ((o = "Partial"), (s = "bgs-partial"))
          : r > 0 && 0 === n
            ? ((o = "Failed"), (s = "bgs-failed"))
            : ((o = "Complete"), (s = "bgs-done"));
      const i = "__ungrouped__" === e.batchId,
        l = i ? "Ungrouped" : e.batchName,
        d = [];
      for (const t of e.sortedPrompts)
        for (const e of t.items)
          e.isPlaceholder ||
            e.mediaId.startsWith("placeholder-") ||
            d.push(e.mediaId);
      const c = d.length > 0 && d.every((e) => g.has(e)),
        p = e.sortedPrompts
          .map((t) => {
            const a = String(t.promptIndex + 1).padStart(3, "0"),
              n =
                t.prompt.length > 50
                  ? t.prompt.substring(0, 47) + "..."
                  : t.prompt,
              r = t.items[0]?.refThumbs || [],
              o =
                r.length > 0
                  ? r
                      .map(
                        (e) =>
                          `<img class="gallery-group-ref-thumb" src="${e}" alt="ref">`,
                      )
                      .join("")
                  : "",
              s = t.items.length,
              i = 1 === s,
              l = t.items
                .map((e) => {
                  const a = String(e.promptIndex + 1).padStart(3, "0");
                  let n = e.suffix || "";
                  if (!n) {
                    const a = t.items;
                    if (a.length > 1) {
                      const t = a.indexOf(e);
                      t > 0 && (n = String.fromCharCode(97 + t));
                    }
                  }
                  const r = a + n,
                    o = g.has(e.mediaId),
                    s =
                      !e.isPlaceholder && !e.mediaId.startsWith("placeholder-");
                  let i, l;
                  switch (e.status) {
                    case "generating":
                    default:
                      ((i = "Generating"), (l = "st-generating"));
                      break;
                    case "ready":
                      ((i = "Ready"), (l = "st-ready"));
                      break;
                    case "downloading":
                      ((i = "Saving"), (l = "st-downloading"));
                      break;
                    case "done":
                      ((i = "Saved"), (l = "st-done"));
                      break;
                    case "failed":
                      ((i = "Failed"), (l = "st-failed"));
                  }
                  let d = "";
                  if (e.isPlaceholder || (!e.fifeUrl && "video" !== e.type)) {
                    const t =
                        e.ratioClass ||
                        (e.isPortrait ? "ratio-9-16" : "ratio-16-9"),
                      a = "video" === e.type ? "🎬" : "🖼";
                    d = `\n                        <div class="shimmer-placeholder ${t} ${"failed" === e.status ? "shimmer-stopped" : ""}">\n                            <span class="placeholder-icon">${a}</span>\n                            <span class="placeholder-text">${i}</span>\n                        </div>\n                    `;
                  } else
                    d =
                      "video" === e.type && e.videoUrl
                        ? `\n<video src="${e.videoUrl}" autoplay loop muted playsinline></video>\n                        <div class="shimmer-placeholder" style="display:none">\n                            <span class="placeholder-icon">🎬</span>\n                            <span class="placeholder-text">${i}</span>\n                        </div>\n                    `
                        : "video" === e.type
                          ? `\n                        <div class="shimmer-placeholder ${e.ratioClass || (e.isPortrait ? "ratio-9-16" : "ratio-16-9")} ${"failed" === e.status ? "shimmer-stopped" : ""}">\n                            <span class="placeholder-icon">🎬</span>\n                            <span class="placeholder-text">${i}</span>\n                        </div>\n                    `
                          : `\n<img src="${e.fifeUrl}" alt="#${r}" loading="lazy" crossorigin="anonymous">\n                        <div class="shimmer-placeholder" style="display:none">\n                            <span class="placeholder-icon">🖼</span>\n                            <span class="placeholder-text">Error</span>\n                        </div>\n                    `;
                  return `\n                    <div class="gallery-item-v2 ${o ? "selected" : ""}"\n                         data-media-id="${e.mediaId}" data-prompt-index="${e.promptIndex}">\n${s ? `\n    <div class="gallery-item-check" data-check-id="${e.mediaId}">\n        <span class="material-symbols-outlined">check</span>\n    </div>\n    <button class="gallery-item-delete" data-delete-id="${e.mediaId}" title="Remove">\n        <span class="material-symbols-outlined">close</span>\n    </button>\n` : ""}\n${d}\n<div class="gallery-item-info-v2">\n    ${t.items.length > 1 ? `<span class="gallery-item-number">v${t.items.indexOf(e) + 1}</span>` : ""}\n    <span class="gallery-item-status ${l}">${i}</span>\n    ${s && xa(e) ? `\n        <button class="gallery-item-animate ${$a() ? "disabled" : ""}"\n                data-animate-id="${e.mediaId}"\n                title="${$a() ? "Wait for current batch to finish" : "Animate this image"}"\n                ${$a() ? "disabled" : ""}>\n            <span class="material-symbols-outlined">play_circle</span>\n        </button>\n    ` : ""}\n</div>\n                    </div>\n                `;
                })
                .join(""),
              d = `${e.batchId}::${t.promptIndex}`;
            return `\n    <div class="prompt-group ${v.has(d) ? "collapsed" : ""}" data-group-index="${t.promptIndex}" data-group-key="${d}">\n        <div class="prompt-group-header" data-group-toggle="${t.promptIndex}">\n                        <span class="material-symbols-outlined prompt-group-chevron">chevron_right</span>\n                        <div class="prompt-group-info">\n                            <span class="prompt-group-number">#${a}</span>\n${o ? `<span class="gallery-group-refs">${o}</span>` : ""}\n<span class="prompt-group-text" title="${se(t.prompt)}">${se(n)}</span>\n                        </div>\n<span class="prompt-group-count">${s} ${1 === s ? "image" : "images"}</span>\n                        <button class="prompt-group-delete" data-delete-group="${t.promptIndex}" data-delete-batch="${e.batchId}" title="Remove group">\n                            <span class="material-symbols-outlined">close</span>\n                        </button>\n                    </div>\n                    <div class="prompt-group-body ${i ? "single-image" : ""}">\n                        ${l}\n                    </div>\n                </div>\n            `;
          })
          .join("");
      return `\n    <div class="batch-gallery-group ${b.has(e.batchId) ? "collapsed" : ""}" data-batch-id="${e.batchId}">\n        <div class="batch-gallery-header" data-batch-toggle="${e.batchId}">\n                    <span class="material-symbols-outlined batch-gallery-chevron">chevron_right</span>\n                    <div class="batch-gallery-info">\n                        <span class="batch-gallery-name">${i ? "📁" : "📦"} ${se(l)}</span>\n                        <span class="batch-gallery-meta">${a} prompt${1 !== a ? "s" : ""} · ${t} item${1 !== t ? "s" : ""}</span>\n                    </div>\n                    <span class="batch-gallery-status ${s}">${o}</span>\n                    <button class="batch-gallery-select ${c ? "all-selected" : ""}" data-batch-select="${e.batchId}" title="Select all in batch">\n                        <span class="material-symbols-outlined">${c ? "check_box" : "check_box_outline_blank"}</span>\n                    </button>\n                    <button class="batch-gallery-delete" data-delete-batch-group="${e.batchId}" title="Remove batch from gallery">\n                        <span class="material-symbols-outlined">close</span>\n                    </button>\n                </div>\n                <div class="batch-gallery-body">\n                    ${p}\n                </div>\n            </div>\n        `;
    })
    .join("")),
    ja(),
    Ya());
}
function ja() {
  (document.querySelectorAll("[data-batch-toggle]").forEach((e) => {
    e.addEventListener("click", (t) => {
      if (
        t.target.closest("[data-batch-select]") ||
        t.target.closest("[data-delete-batch-group]")
      )
        return;
      const a = e.closest(".batch-gallery-group"),
        n = a.dataset.batchId;
      (a.classList.toggle("collapsed"),
        a.classList.contains("collapsed") ? b.add(n) : b.delete(n));
    });
  }),
    document.querySelectorAll("[data-batch-select]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), Ga(e.dataset.batchSelect));
      });
    }),
    document.querySelectorAll("[data-delete-batch-group]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), Ha(e.dataset.deleteBatchGroup));
      });
    }),
    document.querySelectorAll("[data-group-toggle]").forEach((e) => {
      e.addEventListener("click", (t) => {
        if (t.target.closest(".prompt-group-delete")) return;
        const a = e.closest(".prompt-group"),
          n = a.dataset.groupKey;
        (a.classList.toggle("collapsed"),
          a.classList.contains("collapsed") ? v.add(n) : v.delete(n));
      });
    }),
    document.querySelectorAll(".gallery-item-check").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), Qa(e.dataset.checkId));
      });
    }),
    document.querySelectorAll(".gallery-item-delete").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(), Ka(e.dataset.deleteId));
      });
    }),
    document.querySelectorAll(".gallery-item-animate").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(),
          e.disabled ||
            e.classList.contains("disabled") ||
            _a([e.dataset.animateId]));
      });
    }),
    document.querySelectorAll(".prompt-group-delete").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(),
          Ja(parseInt(e.dataset.deleteGroup), e.dataset.deleteBatch));
      });
    }),
    document.querySelectorAll(".gallery-item-v2 img").forEach((e) => {
      e.addEventListener("error", () => {
        e.style.display = "none";
        const t = e.nextElementSibling;
        t && (t.style.display = "flex");
      });
    }),
    document.querySelectorAll(".gallery-item-v2 video").forEach((e) => {
      e.addEventListener("error", () => {
        e.style.display = "none";
        const t = e.nextElementSibling;
        t && (t.style.display = "flex");
      });
    }),
    document.querySelectorAll(".gallery-item-v2").forEach((e) => {
      e.addEventListener("click", (t) => {
        if (
          t.target.closest(".gallery-item-check") ||
          t.target.closest(".gallery-item-delete")
        )
          return;
        const a = e.dataset.mediaId;
        a && !a.startsWith("placeholder-") && nn(a);
      });
    }));
}
function Ga(e) {
  const t = [];
  for (const [a, n] of u)
    (n.batchId || "__ungrouped__") !== e ||
      n.isPlaceholder ||
      a.startsWith("placeholder-") ||
      t.push(a);
  (t.length > 0 && t.every((e) => g.has(e))
    ? t.forEach((e) => g.delete(e))
    : t.forEach((e) => g.add(e)),
    za(),
    Ya(),
    Ba());
}
async function Ha(e) {
  let t = 0;
  for (const [a, n] of u) (n.batchId || "__ungrouped__") === e && t++;
  if (
    0 !== t &&
    (await an({
      icon: "🗑",
      title: "Delete Batch from Gallery?",
      message: `This will remove all ${t} item${1 !== t ? "s" : ""} from this batch. This cannot be undone.`,
      confirmText: "Delete Batch",
      confirmClass: "btn-flow-danger",
    }))
  ) {
    for (const [t, a] of u)
      (a.batchId || "__ungrouped__") === e && (u.delete(t), g.delete(t));
    b.delete(e);
    for (const t of [...v]) t.startsWith(e + "::") && v.delete(t);
    (Ba(), ee(), Te(`🗑 Removed batch from gallery (${t} items)`, "info"));
  }
}
function Qa(e) {
  (g.has(e) ? g.delete(e) : g.add(e), za(), Ya());
}
function Wa() {
  const e = Va();
  (e.length > 0 && e.every((e) => g.has(e))
    ? g.clear()
    : e.forEach((e) => g.add(e)),
    za(),
    Ya());
}
function Va() {
  const e = [];
  for (const [t, a] of u)
    a.isPlaceholder || t.startsWith("placeholder-") || e.push(t);
  return e;
}
function za() {
  document.querySelectorAll(".gallery-item-v2").forEach((e) => {
    const t = e.dataset.mediaId;
    e.classList.toggle("selected", g.has(t));
  });
}
function Ya() {
  const e = Va(),
    t = g.size,
    a = e.length,
    n = a > 0 && e.every((e) => g.has(e)),
    o = r("#gallery-selection-count");
  t > 0
    ? ((o.textContent = `${t} / ${a} selected`),
      o.classList.add("has-selection"))
    : ((o.textContent = `${a} items`), o.classList.remove("has-selection"));
  const s = r("#btn-select-all"),
    i = s.querySelector(".material-symbols-outlined"),
    l = r("#select-all-text");
  n && a > 0
    ? (s.classList.add("all-selected"),
      (i.textContent = "check_box"),
      (l.textContent = "Deselect All"))
    : t > 0
      ? (s.classList.remove("all-selected"),
        (i.textContent = "indeterminate_check_box"),
        (l.textContent = "Select All"))
      : (s.classList.remove("all-selected"),
        (i.textContent = "check_box_outline_blank"),
        (l.textContent = "Select All"));
  const d = r("#gallery-download-bar"),
    c = r("#btn-download-selected"),
    p = r("#download-bar-count");
  t > 0
    ? (d.classList.remove("hidden"), (c.disabled = !1), (p.textContent = t))
    : (d.classList.add("hidden"), (c.disabled = !0), Za());
  const m = r("#btn-animate-selected");
  if (m) {
    const e = $a();
    if (t > 0 && !e) {
      const e = [...g].some((e) => xa(u.get(e)));
      ((m.disabled = !e),
        (m.title = e
          ? "Animate selected images"
          : "No animatable images in selection"));
    } else
      ((m.disabled = !0),
        (m.title = e
          ? "Wait for current batch and downloads to finish"
          : "Select images to animate"));
  }
}
function Ka(e) {
  (u.delete(e),
    g.delete(e),
    Ba(),
    ee(),
    Te("🗑 Removed image from gallery", "info"));
}
async function Ja(e, t) {
  let a = 0;
  for (const [n, r] of u) {
    const n = r.batchId || "__ungrouped__";
    r.promptIndex === e && n === t && a++;
  }
  if (
    0 !== a &&
    (await an({
      icon: "🗑",
      title: "Delete Group?",
      message: `This will remove all ${a} item${1 !== a ? "s" : ""} from prompt #${e + 1}. This cannot be undone.`,
      confirmText: "Delete Group",
      confirmClass: "btn-flow-danger",
    }))
  ) {
    for (const [a, n] of u) {
      const r = n.batchId || "__ungrouped__";
      n.promptIndex === e && r === t && (u.delete(a), g.delete(a));
    }
    (v.delete(`${t}::${e}`),
      Ba(),
      ee(),
      Te(`🗑 Removed group #${e + 1} (${a} items)`, "info"));
  }
}
function Xa() {
  (r("#download-quality-dropdown").classList.remove("hidden"), (f = !0));
}
function Za() {
  (r("#download-quality-dropdown").classList.add("hidden"), (f = !1));
}
function en() {
  f ? Za() : Xa();
}
async function tn(e) {
  Za();
  const t = [],
    a = [];
  for (const e of g) {
    const n = u.get(e);
    if (!n) continue;
    const r = {
      mediaId: e,
      type: n.type || "image",
      promptIndex: n.promptIndex,
      workflowId: n.workflowId || null,
      isPortrait: n.isPortrait || !1,
    };
    "video" === n.type ? a.push(r) : t.push(r);
  }
  const n = r("#setting-folder").value.trim() || "turboflow";
  let o, s, i;
  "4k" === e
    ? ((o = "4k"), (s = "standard"), (i = "images: 4K"))
    : "2k" === e
      ? ((o = "2k"), (s = "standard"), (i = "images: 2K"))
      : "standard" === e
        ? ((o = "standard"), (s = "standard"), (i = "standard"))
        : "video-4k" === e
          ? ((o = "2k"), (s = "4k"), (i = "videos: 4K"))
          : "video-1080p" === e
            ? ((o = "2k"), (s = "1080p"), (i = "videos: 1080p"))
            : "video-standard" === e &&
              ((o = "2k"), (s = "standard"), (i = "videos: 720p"));
  const d = [...t, ...a];
  if (0 === d.length) return;
  Te(`📥 Downloading ${d.length} items (${i}) → ${n}/`, "info");
  let c = "landscape";
  for (const e of g) {
    const t = u.get(e);
    if (t && "video" === t.type) {
      c = t.isPortrait ? "portrait" : "landscape";
      break;
    }
  }
  await chrome.runtime.sendMessage({
    type: "DOWNLOAD_MULTIPLE",
    items: d,
    folder: n,
    quality: o,
    videoQuality: s,
    videoAspectRatio: c,
    naming: l.settings.naming || "numbered",
    namingPrefix: l.settings.namingPrefix || "",
    namingSeparator:
      void 0 !== l.settings.namingSeparator ? l.settings.namingSeparator : "-",
  });
}
function an({
  icon: e,
  title: t,
  message: a,
  confirmText: n,
  confirmClass: o,
}) {
  return new Promise((s) => {
    const i = r("#confirm-modal"),
      l = r("#confirm-icon"),
      d = r("#confirm-title"),
      c = r("#confirm-message"),
      p = r("#btn-confirm-ok"),
      m = r("#btn-confirm-cancel");
    function u(e) {
      ((i.style.display = "none"),
        p.removeEventListener("click", g),
        m.removeEventListener("click", f),
        i.removeEventListener("click", h),
        s(e));
    }
    function g() {
      u(!0);
    }
    function f() {
      u(!1);
    }
    function h(e) {
      e.target === i && u(!1);
    }
    ((l.textContent = e || "⚠️"),
      (d.textContent = t || "Are you sure?"),
      (c.textContent = a || ""),
      (p.textContent = n || "Delete"),
      (p.className = o || "btn-flow-danger"),
      (p.style.flex = "1"),
      (i.style.display = "flex"),
      p.addEventListener("click", g),
      m.addEventListener("click", f),
      i.addEventListener("click", h));
  });
}
function nn(e) {
  $ = [];
  const t = Ua();
  for (const e of t)
    for (const t of e.sortedPrompts)
      for (const e of t.items)
        e.isPlaceholder || e.mediaId.startsWith("placeholder-") || $.push(e);
  const a = $.findIndex((t) => t.mediaId === e);
  -1 !== a && ((L = a), on(), (r("#preview-modal").style.display = "flex"));
}
function rn() {
  ((r("#preview-modal").style.display = "none"), ln());
  const e = r("#preview-video");
  (e.pause(), (e.src = ""));
}
function on() {
  const e = $[L];
  if (!e) return;
  const t = r("#preview-image"),
    a = r("#preview-video"),
    n = r("#preview-number"),
    o = r("#preview-prompt"),
    s = r("#btn-preview-prev"),
    i = r("#btn-preview-next"),
    l = String(e.promptIndex + 1).padStart(3, "0");
  let d = e.suffix || "";
  if (!d) {
    const t = $.filter((t) => t.promptIndex === e.promptIndex);
    if (t.length > 1) {
      const a = t.indexOf(e);
      a > 0 && (d = String.fromCharCode(97 + a));
    }
  }
  ((n.textContent = "#" + l + d),
    (o.textContent = e.prompt || ""),
    (o.title = e.prompt || ""),
    "video" === e.type && e.videoUrl
      ? ((t.style.display = "none"),
        (a.style.display = "block"),
        (a.src = e.videoUrl))
      : e.fifeUrl &&
        ((a.style.display = "none"),
        a.pause(),
        (a.src = ""),
        (t.style.display = "block"),
        (t.src = e.fifeUrl)),
    (s.style.visibility = 0 === L ? "hidden" : "visible"),
    (i.style.visibility = L === $.length - 1 ? "hidden" : "visible"));
  const c = r("#preview-image-options"),
    p = r("#preview-video-options");
  c &&
    p &&
    ("video" === e.type
      ? ((c.style.display = "none"), (p.style.display = "block"))
      : ((c.style.display = "block"), (p.style.display = "none")));
  const m = r("#btn-preview-animate");
  (m && (m.style.display = xa(e) ? "inline-flex" : "none"), ln());
}
function sn() {
  (r("#preview-quality-dropdown").classList.remove("hidden"), (x = !0));
}
function ln() {
  (r("#preview-quality-dropdown").classList.add("hidden"), (x = !1));
}
function dn() {
  return (
    "batch-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7)
  );
}
function cn(e, t = {}) {
  const a = t.runNow || !1,
    n = r("#setting-folder").value.trim() || "turboflow",
    o = {
      id: dn(),
      name: t.name || n,
      folder: n,
      status: a ? "running" : "pending",
      collapsed: !1,
      createdAt: Date.now(),
      settings: {
        mode: l.mode,
        imageModel: l.settings.imageModel,
        imageRatio: l.settings.imageRatio,
        imageCount: l.settings.imageCount,
        videoQuality: l.settings.videoQuality,
        videoRatio: l.settings.videoRatio,
        videoMode: l.settings.videoMode,
        videoCount: l.settings.videoCount,
        videoDuration: l.settings.videoDuration || 8,
        startFrameMediaId: l.startFrameMediaId,
        endFrameMediaId: l.endFrameMediaId,
        referenceMediaIds: [...l.referenceMediaIds],
        imageReferenceMediaIds: [...l.imageReferenceMediaIds],
        naming: l.settings.naming || "numbered",
        namingPrefix: l.settings.namingPrefix || "",
        namingSeparator:
          void 0 !== l.settings.namingSeparator
            ? l.settings.namingSeparator
            : "-",
        startNumber: l.settings.startNumber || 1,
        perPromptReferences:
          "mapped" === l.referenceMode
            ? JSON.parse(JSON.stringify(l.promptReferenceMap))
            : null,
        perPromptStartFrames:
          "mapped" === l.referenceMode
            ? JSON.parse(JSON.stringify(l.promptStartFrameMap))
            : null,
        perPromptEndFrames:
          "mapped" === l.referenceMode
            ? JSON.parse(JSON.stringify(l.promptEndFrameMap))
            : null,
        perPromptThumbnails:
          "mapped" === l.referenceMode
            ? ye(
                l.promptReferenceMap,
                l.promptStartFrameMap,
                l.promptEndFrameMap,
              )
            : null,
        referenceMode: l.referenceMode,
        singlePromptBatch: !0 === l.singlePromptMode,
      },
      prompts: e.map((e) => ({ text: e, status: "pending" })),
      stats: { total: 0, downloaded: 0, failed: 0 },
      startedAt: a ? Date.now() : null,
      completedAt: null,
    };
  return (
    l.batches.push(o),
    X(),
    Sn(),
    Te(
      `📦 Batch "${o.name}" created — ${e.length} prompts [${a ? "running" : "queued"}]`,
      a ? "success" : "info",
    ),
    o
  );
}
function pn(e) {
  return l.batches.find((t) => t.id === e);
}
function mn() {
  return l.batches.find((e) => "running" === e.status);
}
function un() {
  return (
    [...l.batches]
      .filter((e) => "pending" === e.status)
      .sort((e, t) => (e.createdAt || 0) - (t.createdAt || 0))[0] || null
  );
}
function gn(e, t) {
  const a = pn(e);
  a &&
    ((a.status = t),
    "running" === t && (a.startedAt = a.startedAt || Date.now()),
    ("done" !== t && "failed" !== t && "partial" !== t) ||
      (a.completedAt = Date.now()),
    X(),
    Sn());
}
function fn(e, t, a) {
  const n = pn(e);
  n && n.prompts[t] && ((n.prompts[t].status = a), X(), Sn());
}
function hn(e, t) {
  const a = pn(e);
  if (!a) return;
  const n = a.stats?.previousSucceeded || 0;
  ((a.stats = { ...t, previousSucceeded: n }), X(), Sn());
}
function bn(e) {
  const t = pn(e);
  t &&
    ("running" !== t.status
      ? ((l.batches = l.batches.filter((t) => t.id !== e)),
        X(),
        Sn(),
        Te(`🗑️ Batch "${t.name}" deleted`, "info"))
      : Te("⚠️ Can't delete a running batch — stop it first", "warn"));
}
function vn(e) {
  const t = pn(e);
  if (!t) return;
  const a = {
    ...JSON.parse(JSON.stringify(t)),
    id: dn(),
    name: t.name + " (copy)",
    status: "pending",
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
    stats: { total: 0, downloaded: 0, failed: 0 },
  };
  (a.prompts.forEach((e) => (e.status = "pending")),
    l.batches.push(a),
    X(),
    Sn(),
    Te(`📋 Batch duplicated → "${a.name}"`, "success"));
}
function yn(e, t) {
  const a = pn(e);
  a &&
    ((a.name = t.trim() || a.name),
    (a.folder =
      t
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-") || a.folder),
    X(),
    Sn());
}
function wn(e) {
  const t = pn(e);
  if (!t) return;
  let a = 0;
  if (
    (t.prompts.forEach((e) => {
      "failed" === e.status && ((e.status = "pending"), a++);
    }),
    0 === a)
  )
    return void Te(`✅ No failed prompts in "${t.name}"`, "info");
  t.status = "pending";
  const n = (t.stats?.downloaded || 0) + (t.stats?.previousSucceeded || 0);
  ((t.stats = { total: 0, downloaded: 0, failed: 0, previousSucceeded: n }),
    (t.completedAt = null),
    X(),
    Sn(),
    Te(`🔄 Reset ${a} failed prompts in "${t.name}"`, "success"));
}
function In(e) {
  if (!l.avgTimePerImage || l.avgTimePerImage <= 0) return null;
  const t =
      e.prompts.filter((e) => "pending" === e.status || "running" === e.status)
        .length * (e.settings.imageCount || 1),
    a = Math.round((t * l.avgTimePerImage) / 1e3);
  return a < 60 ? `~${a}s` : `~${Math.round(a / 60)}min`;
}
function En() {
  if (l.batches.find((e) => "running" === e.status))
    return void Te("⚠️ Stop the running batch first", "warn");
  const e = l.batches.length;
  ((l.batches = []), X(), Sn(), Te(`🗑️ Deleted all ${e} batches`, "info"));
}
function kn() {
  l.batches.find((e) => "running" === e.status)
    ? Te("⚠️ Stop the running batch first", "warn")
    : (l.batches.forEach((e) => {
        ((e.status = "pending"),
          (e.stats = { total: 0, downloaded: 0, failed: 0 }),
          (e.startedAt = null),
          (e.completedAt = null),
          e.prompts.forEach((e) => (e.status = "pending")));
      }),
      X(),
      Sn(),
      Te("🔄 All batches reset to pending", "success"));
}
function Mn() {
  const e = JSON.stringify(l.batches, null, 2),
    t = new Blob([e], { type: "application/json" }),
    a = URL.createObjectURL(t),
    n = document.createElement("a");
  ((n.href = a),
    (n.download = `turboflow-batches-${Date.now()}.json`),
    n.click(),
    URL.revokeObjectURL(a),
    Te(`📤 Exported ${l.batches.length} batches`, "success"));
}
function $n(e) {
  try {
    const t = JSON.parse(e);
    if (!Array.isArray(t)) throw new Error("Invalid format");
    let a = 0;
    for (const e of t)
      e.prompts &&
        Array.isArray(e.prompts) &&
        ((e.id = dn()),
        (e.status = "pending"),
        (e.startedAt = null),
        (e.completedAt = null),
        (e.stats = { total: 0, downloaded: 0, failed: 0 }),
        e.prompts.forEach((e) => (e.status = "pending")),
        l.batches.push(e),
        a++);
    (X(), Sn(), Te(`📥 Imported ${a} batches`, "success"));
  } catch (e) {
    Te(`❌ Import failed: ${e.message}`, "error");
  }
}
function Ln() {
  const e = r("#queue-stats-bar");
  if (!e) return;
  if (0 === l.batches.length) return void (e.style.display = "none");
  e.style.display = "flex";
  const t = l.batches.filter((e) => "pending" === e.status).length,
    a = l.batches.filter((e) => "running" === e.status).length,
    n = l.batches.filter((e) => "done" === e.status).length,
    o = l.batches.filter(
      (e) => "failed" === e.status || "partial" === e.status,
    ).length;
  ((r("#qs-pending").textContent = `⏳ ${t} queued`),
    (r("#qs-running").textContent = `⚡ ${a} generating`),
    (r("#qs-done").textContent = `✅ ${n} complete`),
    (r("#qs-failed").textContent = `❌ ${o} failed`));
}
function xn(e, t) {
  const a = e.prompts[0]?.text || "";
  return (
    `\n        <div class="bp-row" style="background:rgba(168,199,250,0.04);border-bottom:1px solid rgba(168,199,250,0.1)">\n            <span class="bp-num">📝</span>\n            <span class="bp-text ${t ? "bp-editable" : ""}" data-bid="${e.id}" data-pi="0"\n                  title="${se(a)}"\n                  style="font-style:italic;color:#a8c7fa">${se(a)}</span>\n            <span class="bp-status" style="background:rgba(168,199,250,0.1);color:#a8c7fa">applies to all</span>\n        </div>\n    ` +
    e.prompts
      .map((t, a) => {
        const n = "submitted" === t.status ? "bps-done" : `bps-${t.status}`,
          r =
            {
              pending: "⏳ Waiting",
              running: "⚡ Generating",
              submitted: "✅ Generated",
              failed: "❌ Failed",
            }[t.status] || t.status;
        let o = "";
        if (
          e.settings.perPromptThumbnails &&
          e.settings.perPromptStartFrames?.[a]
        ) {
          const t = e.settings.perPromptStartFrames[a],
            n = e.settings.perPromptThumbnails[t];
          n && (o = `<img class="bp-ref-thumb" src="${n}" alt="frame">`);
        }
        return `\n            <div class="bp-row" data-bid="${e.id}" data-pi="${a}">\n                <span class="bp-num">${a + 1}.</span>\n                ${o ? `<span class="bp-refs">${o}</span>` : ""}\n                <span class="bp-text" style="color:#9aa0a6">Frame ${a + 1}</span>\n                <span class="bp-status ${n}">${r}</span>\n                <div class="bp-actions">\n                    ${"failed" === t.status ? `\n                        <button class="bpa-btn" data-act="retry-prompt" data-bid="${e.id}" data-pi="${a}" title="Retry">\n                            <span class="material-symbols-outlined">refresh</span>\n                        </button>` : ""}\n                </div>\n            </div>\n        `;
      })
      .join("")
  );
}
function Sn() {
  const e = r("#batch-list");
  if (!e) return;
  const t = (r("#batch-search")?.value || "").toLowerCase().trim();
  (Ln(),
    0 !== l.batches.length
      ? ((e.innerHTML = [...l.batches]
          .reverse()
          .map((e) => {
            const a =
                !t ||
                e.name.toLowerCase().includes(t) ||
                e.folder.toLowerCase().includes(t) ||
                e.prompts.some((e) => e.text.toLowerCase().includes(t))
                  ? ""
                  : "bc-hidden",
              n = e.prompts.length,
              r = e.prompts.filter(
                (e) => "done" === e.status || "submitted" === e.status,
              ).length,
              o = e.prompts.filter((e) => "failed" === e.status).length,
              s = n > 0 ? Math.round(((r + o) / n) * 100) : 0,
              i = `bs-${e.status}`,
              l =
                {
                  pending: "QUEUED",
                  running: "GENERATING",
                  done: "COMPLETE",
                  failed: "FAILED",
                  partial: "INCOMPLETE",
                }[e.status] || e.status.toUpperCase(),
              d =
                "done" === e.status
                  ? "pf-done"
                  : "running" === e.status
                    ? "pf-running"
                    : "failed" === e.status || "partial" === e.status
                      ? "pf-failed"
                      : "",
              c = [];
            if ("image" === e.settings.mode) {
              const t = { GEM_PIX_2: "Banana Pro", NARWHAL: "Banana 2" };
              c.push(t[e.settings.imageModel] || e.settings.imageModel);
              const a = {
                IMAGE_ASPECT_RATIO_LANDSCAPE: "16:9",
                IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE: "4:3",
                IMAGE_ASPECT_RATIO_SQUARE: "1:1",
                IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR: "3:4",
                IMAGE_ASPECT_RATIO_PORTRAIT: "9:16",
              };
              (c.push(a[e.settings.imageRatio] || "16:9"),
                e.settings.imageCount > 1 &&
                  c.push(`×${e.settings.imageCount}`),
                e.settings.imageReferenceMediaIds?.length > 0 &&
                  c.push(`🖼 ${e.settings.imageReferenceMediaIds.length} ref`));
            } else {
              c.push("Video");
              const t = {
                lite: "Veo 3.1 Lite",
                lite_lp: "Veo 3.1 Lite LP",
                fast: "Fast",
                relaxed: "Fast (LP)",
                quality: "Quality",
                omni_flash: "Omni Flash",
              };
              (c.push(t[e.settings.videoQuality] || e.settings.videoQuality),
                c.push("portrait" === e.settings.videoRatio ? "9:16" : "16:9"),
                c.push(`${e.settings.videoDuration || 8}s`),
                e.settings.videoCount > 1 &&
                  c.push(`×${e.settings.videoCount}`));
            }
            ("mapped" === e.settings.referenceMode && c.push("📎 mapped"),
              "prompt" === e.settings.naming && c.push("📝 prompt-name"),
              "prefix" === e.settings.naming &&
                e.settings.namingPrefix &&
                c.push(`🏷️ ${e.settings.namingPrefix}-`));
            const p =
                e.prompts.length > 1 &&
                e.prompts.every((t) => t.text === e.prompts[0].text),
              m =
                !0 === e.settings.singlePromptBatch ||
                (p && "mapped" === e.settings.referenceMode);
            m && c.push(`📝 1 prompt × ${e.prompts.length} videos`);
            const u = "running" === e.status ? In(e) : null,
              g = "pending" === e.status,
              f = "pending" === e.status,
              h = e.prompts.some((e) => "failed" === e.status),
              b =
                "running" !== e.status &&
                "pending" !== e.status &&
                e.prompts.some(
                  (e) => "pending" === e.status || "running" === e.status,
                ),
              v = ["running", "done", "partial", "failed"].includes(e.status),
              y = m
                ? xn(e, g)
                : e.prompts
                    .map((t, a) => {
                      const n =
                          "submitted" === t.status
                            ? "bps-done"
                            : `bps-${t.status}`,
                        r =
                          {
                            pending: "⏳ Waiting",
                            running: "⚡ Generating",
                            submitted: "✅ Generated",
                            failed: "❌ Failed",
                          }[t.status] || t.status,
                        o = g ? "bp-editable" : "";
                      let s = "";
                      if ("mapped" === e.settings.referenceMode)
                        if ("start_end_frame" === e.settings.videoMode) {
                          const t = e.settings.perPromptStartFrames?.[a],
                            n = e.settings.perPromptEndFrames?.[a],
                            r = t ? e.settings.perPromptThumbnails?.[t] : null,
                            o = n ? e.settings.perPromptThumbnails?.[n] : null;
                          s = `${r ? `<img class="bp-ref-thumb" src="${r}" alt="start">` : t ? '<span class="bp-ref-icon">🖼</span>' : ""}${o ? `<img class="bp-ref-thumb" src="${o}" alt="end">` : n ? '<span class="bp-ref-icon">🖼</span>' : ""}`;
                        } else if (e.settings.perPromptStartFrames?.[a]) {
                          const t = e.settings.perPromptStartFrames[a],
                            n = e.settings.perPromptThumbnails?.[t];
                          s = n
                            ? `<img class="bp-ref-thumb" src="${n}" alt="frame">`
                            : '<span class="bp-ref-icon">🖼</span>';
                        } else
                          e.settings.perPromptReferences?.[a] &&
                            (s = e.settings.perPromptReferences[a]
                              .map((t) => {
                                const a = e.settings.perPromptThumbnails?.[t];
                                return a
                                  ? `<img class="bp-ref-thumb" src="${a}" alt="ref">`
                                  : '<span class="bp-ref-icon">🖼</span>';
                              })
                              .join(""));
                      return `\n                <div class="bp-row" data-bid="${e.id}" data-pi="${a}">\n                    <span class="bp-num">${a + 1}.</span>\n                    ${s ? `<span class="bp-refs">${s}</span>` : ""}\n                    <span class="bp-text ${o}" data-bid="${e.id}" data-pi="${a}"\n                          title="${se(t.text)}">${se(t.text)}</span>\n                    <span class="bp-status ${n}">${r}</span>\n                    <div class="bp-actions">\n                        ${"failed" === t.status ? `\n                            <button class="bpa-btn" data-act="retry-prompt" data-bid="${e.id}" data-pi="${a}" title="Retry">\n                                <span class="material-symbols-outlined">refresh</span>\n                            </button>` : ""}\n                        ${g ? `\n                            <button class="bpa-btn bpa-danger" data-act="delete-prompt" data-bid="${e.id}" data-pi="${a}" title="Remove">\n                                <span class="material-symbols-outlined">close</span>\n                            </button>` : ""}\n                    </div>\n                </div>\n            `;
                    })
                    .join("");
            return `\n            <div class="batch-card ${e.collapsed ? "" : "expanded"} bc-${e.status} ${a}" data-bid="${e.id}">\n                <div class="batch-hdr" data-bid="${e.id}">\n                    <span class="material-symbols-outlined batch-chevron">chevron_right</span>\n                    <div class="batch-hdr-info">\n                        <div class="batch-hdr-top">\n                            <span class="batch-name-edit" contenteditable="${g}" spellcheck="false"\n                                  data-bid="${e.id}">${se(e.name)}</span>\n                            <span class="batch-count">${r}/${n}</span>\n                            <span class="bs-badge ${i}">${l}</span>\n                            ${u ? `<span class="batch-eta">${u}</span>` : ""}\n                        </div>\n                        <div class="batch-hdr-meta">\n                            ${c.map((e) => `<span class="batch-tag">${e}</span>`).join("")}\n                            <span class="batch-tag">📁 ${se(e.folder)}</span>\n                        </div>\n                    </div>\n                    <div class="batch-hdr-actions">\n                        ${"running" === e.status ? `\n                            <button class="ba-btn ba-danger" data-act="stop-batch" data-bid="${e.id}" title="Stop">\n                                <span class="material-symbols-outlined">stop_circle</span>\n                            </button>` : ""}\n                        ${f ? `\n                            <button class="ba-btn" data-act="run-batch" data-bid="${e.id}" title="Run now">\n                                <span class="material-symbols-outlined">play_arrow</span>\n                            </button>` : ""}\n                        <button class="ba-btn" data-act="duplicate-batch" data-bid="${e.id}" title="Duplicate">\n                            <span class="material-symbols-outlined">content_copy</span>\n                        </button>\n                        <button class="ba-btn ba-danger" data-act="delete-batch" data-bid="${e.id}" title="Delete">\n                            <span class="material-symbols-outlined">delete</span>\n                        </button>\n                    </div>\n                </div>\n\n                ${v ? `\n                    <div class="batch-progress">\n                        <div class="batch-pbar">\n                            <div class="batch-pfill ${d}" style="width:${s}%"></div>\n                        </div>\n                    </div>` : ""}\n\n                <div class="batch-body">\n                    <div class="bp-list">${y}</div>\n                    <div class="batch-footer">\n                        <div style="display:flex;gap:2px">\n                            ${h ? `\n                                <button class="bf-btn bf-primary" data-act="retry-failed" data-bid="${e.id}">\n                                    <span class="material-symbols-outlined">refresh</span>\n                                    Retry Failed\n                                </button>` : ""}\n                            ${b ? `\n                                <button class="bf-btn bf-primary" data-act="sweep-stuck" data-bid="${e.id}" title="Some items are stuck — mark them as failed so you can retry">\n                                    <span class="material-symbols-outlined">cleaning_services</span>\n                                    Sweep Stuck\n                                </button>` : ""}\n                        </div>\n                        <div style="display:flex;gap:2px">\n                            <button class="bf-btn" data-act="duplicate-batch" data-bid="${e.id}">\n                                <span class="material-symbols-outlined">content_copy</span>\n                                Clone\n                            </button>\n                            <button class="bf-btn bf-danger" data-act="delete-batch" data-bid="${e.id}">\n                                <span class="material-symbols-outlined">delete</span>\n                                Delete\n                            </button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        `;
          })
          .join("")),
        _n())
      : (e.innerHTML =
          '\n            <div class="empty-state">\n                <span class="material-symbols-outlined">inventory_2</span>\n                No batches yet — add prompts and queue or start them\n            </div>\n        '));
}
function _n() {
  (document.querySelectorAll(".batch-hdr").forEach((e) => {
    e.addEventListener("click", (t) => {
      if (
        t.target.closest(".batch-name-edit") ||
        t.target.closest(".batch-hdr-actions") ||
        t.target.closest("button")
      )
        return;
      const a = pn(e.dataset.bid);
      a && ((a.collapsed = !a.collapsed), Sn());
    });
  }),
    document
      .querySelectorAll('.batch-name-edit[contenteditable="true"]')
      .forEach((e) => {
        (e.addEventListener("click", (e) => e.stopPropagation()),
          e.addEventListener("blur", () => {
            const t = e.textContent.trim();
            t && yn(e.dataset.bid, t);
          }),
          e.addEventListener("keydown", (t) => {
            ("Enter" === t.key && (t.preventDefault(), e.blur()),
              "Escape" === t.key && e.blur());
          }));
      }),
    document.querySelectorAll(".bp-text.bp-editable").forEach((e) => {
      (e.addEventListener("dblclick", (t) => {
        (t.stopPropagation(),
          (e.contentEditable = "true"),
          e.classList.add("bp-editing"),
          e.focus());
        const a = document.createRange();
        a.selectNodeContents(e);
        const n = window.getSelection();
        (n.removeAllRanges(), n.addRange(a));
      }),
        e.addEventListener("blur", () => {
          ((e.contentEditable = "false"), e.classList.remove("bp-editing"));
          const t = pn(e.dataset.bid),
            a = parseInt(e.dataset.pi);
          if (t && t.prompts[a]) {
            const n = e.textContent.trim();
            if (n && n !== t.prompts[a].text) {
              const e =
                t.prompts.length > 1 &&
                t.prompts.every((e) => e.text === t.prompts[0].text);
              (!0 === t.settings.singlePromptBatch ||
              (e && "mapped" === t.settings.referenceMode)
                ? (t.prompts.forEach((e) => (e.text = n)),
                  Te(
                    `✏️ Single prompt updated for all ${t.prompts.length} videos in "${t.name}"`,
                    "info",
                  ))
                : ((t.prompts[a].text = n),
                  Te(`✏️ Prompt ${a + 1} updated in "${t.name}"`, "info")),
                X());
            }
          }
        }),
        e.addEventListener("keydown", (t) => {
          ("Enter" !== t.key || t.shiftKey || (t.preventDefault(), e.blur()),
            "Escape" === t.key && e.blur());
        }));
    }),
    document.querySelectorAll("[data-act]").forEach((e) => {
      e.addEventListener("click", (t) => {
        (t.stopPropagation(),
          Pn(
            e.dataset.act,
            e.dataset.bid,
            void 0 !== e.dataset.pi ? parseInt(e.dataset.pi) : null,
          ));
      });
    }));
}
function Pn(e, t, a, n = {}) {
  const o = pn(t);
  if (o)
    switch (e) {
      case "stop-batch": {
        (chrome.runtime.sendMessage({ type: "STOP_BATCH" }),
          (p = !1),
          o.prompts.forEach((e) => {
            ("running" !== e.status && "pending" !== e.status) ||
              (e.status = "failed");
          }));
        const e = o.prompts.some(
          (e) => "done" === e.status || "submitted" === e.status,
        );
        (gn(t, e ? "partial" : "failed"),
          (l.activeBatchId = null),
          m && (clearInterval(m), (m = null)),
          (l.stats = { total: 0, downloaded: 0, failed: 0 }));
        for (const [e, t] of u)
          ("generating" !== t.status && "downloading" !== t.status) ||
            ((t.status = "failed"), t.isPlaceholder && (t.isPlaceholder = !1));
        ("function" == typeof Ba && Ba(),
          "function" == typeof ee && ee(),
          zn(!1),
          Oa(),
          De("Stopped", "badge badge-disconnected", 5e3),
          Te(`⏹ Batch "${o.name}" stopped`, "warn"));
        break;
      }
      case "run-batch": {
        n.keepChain || (p = !1);
        const e = o.settings;
        if ("video" === e.mode) {
          const t = e.videoMode,
            a =
              e.perPromptStartFrames &&
              Object.keys(e.perPromptStartFrames).length > 0,
            n =
              e.perPromptReferences &&
              Object.keys(e.perPromptReferences).length > 0,
            r = o.prompts.filter((e) => "pending" === e.status).length;
          if (
            !(
              ("start_frame" !== t && "start_end_frame" !== t) ||
              e.startFrameMediaId ||
              a
            )
          )
            return (
              Gn({
                icon: "🖼️",
                title: "Start Frame Required",
                message: `Batch "<strong>${se(o.name)}</strong>" uses Start Frame mode but no frames are attached.`,
                hint: "Duplicate this batch, then set up start frames before running.",
              }),
              void Te(
                `❌ Batch "${o.name}" has no start frames — blocked`,
                "error",
              )
            );
          if (
            ("start_frame" === t || "start_end_frame" === t) &&
            a &&
            !e.startFrameMediaId
          ) {
            const t = Object.keys(e.perPromptStartFrames).length;
            if (t < r)
              return (
                Gn({
                  icon: "⚠️",
                  title: "Some Prompts Missing Start Frames",
                  message: `Batch "<strong>${se(o.name)}</strong>" has ${t}/${r} prompts with start frames. Unmapped prompts will fail.`,
                  hint: "Duplicate this batch and fix the mapping before running.",
                }),
                void Te(
                  `⚠️ Batch "${o.name}" has incomplete start frame mapping — blocked`,
                  "error",
                )
              );
          }
          if ("start_end_frame" === t) {
            const t =
              e.perPromptEndFrames &&
              Object.keys(e.perPromptEndFrames).length > 0;
            if (!e.endFrameMediaId && !t)
              return (
                Gn({
                  icon: "🖼️",
                  title: "End Frame Required",
                  message: `Batch "<strong>${se(o.name)}</strong>" uses Start + End Frame mode but no end frame is attached.`,
                  hint: "Duplicate this batch and add an end frame before running.",
                }),
                void Te(
                  `❌ Batch "${o.name}" has no end frame — blocked`,
                  "error",
                )
              );
            if ("mapped" === e.referenceMode && !e.endFrameMediaId && t) {
              const t = Object.keys(e.perPromptEndFrames).length;
              if (t < r)
                return (
                  Gn({
                    icon: "⚠️",
                    title: "Some Prompts Missing End Frames",
                    message: `Batch "<strong>${se(o.name)}</strong>" has ${t}/${r} prompts with end frames. Unmapped prompts will fail.`,
                    hint: "Duplicate this batch and fix the mapping before running.",
                  }),
                  void Te(
                    `⚠️ Batch "${o.name}" has incomplete end frame mapping — blocked`,
                    "error",
                  )
                );
            }
          }
          if (
            !(
              "reference" !== t ||
              (e.referenceMediaIds && 0 !== e.referenceMediaIds.length) ||
              n
            )
          )
            return (
              Gn({
                icon: "🎨",
                title: "Reference Images Required",
                message: `Batch "<strong>${se(o.name)}</strong>" uses Reference mode but no images are attached.`,
                hint: "Duplicate this batch and add reference images before running.",
              }),
              void Te(
                `❌ Batch "${o.name}" has no references — blocked`,
                "error",
              )
            );
          if (
            "reference" === t &&
            n &&
            (!e.referenceMediaIds || 0 === e.referenceMediaIds.length)
          ) {
            const t = Object.keys(e.perPromptReferences).filter(
              (t) => e.perPromptReferences[t].length > 0,
            ).length;
            if (t < r)
              return (
                Gn({
                  icon: "⚠️",
                  title: "Some Prompts Missing References",
                  message: `Batch "<strong>${se(o.name)}</strong>" has ${t}/${r} prompts with references. Unmapped prompts will fail.`,
                  hint: "Duplicate this batch and fix the mapping before running.",
                }),
                void Te(
                  `⚠️ Batch "${o.name}" has incomplete reference mapping — blocked`,
                  "error",
                )
              );
          }
        }
        if (!1) {
          const e = i.promptsRemaining ?? 0,
            t = o.prompts.filter((e) => "pending" === e.status).length;
          if (e <= 0)
            return void Gn({
              icon: "⏳",
              title: "Google Limit Reached",
              message: `You've used all <strong>${i.promptsPerDay || 0}</strong> available prompts for today.`,
              hint: "Come back tomorrow for more available prompts, or <strong>reduce this batch size</strong> before running this batch.",
            });
          if (t > e)
            return void Gn({
              icon: "⚠️",
              title: "Not Enough Prompts",
              message: `Batch "<strong>${se(o.name)}</strong>" has <strong>${t}</strong> pending prompts but you only have <strong>${e}</strong> remaining today.`,
              hint: `Remove ${t - e} prompt${t - e > 1 ? "s" : ""} from this batch, or <strong>reduce this batch size</strong> before running this batch.`,
            });
        }
        (gn(t, "running"),
          (l.activeBatchId = t),
          (l.batchStartTime = Date.now()),
          zn(!0));
        const a = o.prompts
            .map((e, t) => ({
              text: e.text,
              status: e.status,
              originalIndex: t,
            }))
            .filter((e) => "pending" === e.status),
          s = a.map((e) => e.text),
          d = a.map((e) => e.originalIndex),
          c = o.settings;
        (qa(
          s,
          {
            mode: c.mode,
            imageCount: c.imageCount,
            videoCount: c.videoCount || 1,
            aspectRatio: c.imageRatio,
            videoRatio: c.videoRatio,
          },
          d,
          { batchId: t, batchName: o.name },
        ),
          chrome.runtime
            .sendMessage({
              type: "START_BATCH",
              batchId: t,
              prompts: s,
              promptIndexMap: d,
              settings: {
                mode: c.mode,
                folder: o.folder,
                imageModel: c.imageModel,
                aspectRatio: c.imageRatio,
                imageCount: c.imageCount,
                videoQuality: c.videoQuality,
                videoRatio: c.videoRatio,
                videoMode: c.videoMode,
                videoCount: c.videoCount || 1,
                videoDuration: c.videoDuration || 8,
                startFrameMediaId: c.startFrameMediaId,
                endFrameMediaId: c.endFrameMediaId,
                referenceMediaIds: c.referenceMediaIds,
                imageReferenceMediaIds: c.imageReferenceMediaIds || [],
                autoDownloadImages: r("#setting-autodownload-images").checked,
                autoDownloadVideos: r("#setting-autodownload-videos").checked,
                imageDownloadQuality: l.settings.imageDownloadQuality || "2k",
                videoDownloadQuality:
                  l.settings.videoDownloadQuality || "standard",
                naming: c.naming || l.settings.naming || "numbered",
                namingPrefix: c.namingPrefix || l.settings.namingPrefix || "",
                namingSeparator:
                  void 0 !== c.namingSeparator
                    ? c.namingSeparator
                    : void 0 !== l.settings.namingSeparator
                      ? l.settings.namingSeparator
                      : "-",
                startNumber: c.startNumber || l.settings.startNumber || 1,
                perPromptReferences: c.perPromptReferences || null,
                perPromptStartFrames: c.perPromptStartFrames || null,
                perPromptEndFrames: c.perPromptEndFrames || null,
                referenceMode: c.referenceMode || "shared",
                singlePromptBatch: !0 === c.singlePromptBatch,
                speedMode: l.speedMode || "fast",
                _autoChained: n.keepChain || !1,
              },
            })
            .then(() => {
              (Te(`🚀 Batch "${o.name}" started!`, "success"), Yn());
            })
            .catch((e) => {
              (Te(`❌ Failed: ${e.message}`, "error"),
                gn(t, "failed"),
                (l.activeBatchId = null),
                zn(!1));
            }));
        break;
      }
      case "delete-batch": {
        if ("running" === o.status)
          return void Te(
            "⚠️ Can't delete a running batch — stop it first",
            "warn",
          );
        const e = l.batches.indexOf(o),
          t = l.batches.splice(e, 1)[0];
        (d.push({ type: "delete-batch", batch: t, index: e }),
          An(`Batch "${t.name}" deleted`),
          X(),
          Sn(),
          Te(`🗑️ Batch "${t.name}" deleted`, "info"));
        break;
      }
      case "duplicate-batch":
        vn(t);
        break;
      case "retry-failed":
        (wn(t), l.activeBatchId || Pn("run-batch", t, null, { keepChain: p }));
        break;
      case "retry-prompt":
        null !== a &&
          o.prompts[a] &&
          ((o.prompts[a].status = "pending"),
          ("done" !== o.status &&
            "partial" !== o.status &&
            "failed" !== o.status) ||
            ((o.status = "pending"), (o.completedAt = null)),
          X(),
          Sn(),
          Te(`🔄 Prompt ${a + 1} in "${o.name}" reset for retry`, "info"));
        break;
      case "sweep-stuck": {
        let e = 0;
        o.prompts.forEach((t) => {
          ("running" !== t.status && "pending" !== t.status) ||
            ((t.status = "failed"), e++);
        });
        let a = 0;
        for (const [e, n] of u)
          n.batchId === t &&
            n.isPlaceholder &&
            "generating" === n.status &&
            ((n.status = "failed"), (n.isPlaceholder = !1), a++);
        if (0 === e && 0 === a) {
          Te(`✓ No stuck items in "${o.name}"`, "info");
          break;
        }
        const n = o.prompts.filter(
          (e) => "done" === e.status || "submitted" === e.status,
        ).length;
        (gn(t, n > 0 ? "partial" : "failed"),
          X(),
          Sn(),
          "function" == typeof Ba && Ba(),
          "function" == typeof ee && ee(),
          Te(
            `🔧 Swept ${e} stuck prompt${1 !== e ? "s" : ""} and ${a} stuck image${1 !== a ? "s" : ""} in "${o.name}" — click "Retry Failed" to redo them`,
            "success",
          ));
        break;
      }
      case "delete-prompt":
        null !== a &&
          (o.prompts.splice(a, 1),
          0 === o.prompts.length
            ? Pn("delete-batch", t, null)
            : (X(), Sn(), Te(`🗑️ Prompt removed from "${o.name}"`, "info")));
    }
}
function An(e) {
  const t = r("#undo-toast"),
    a = r("#undo-toast-msg");
  t &&
    a &&
    ((a.textContent = e),
    (t.style.display = "flex"),
    c && clearTimeout(c),
    (c = setTimeout(() => {
      ((t.style.display = "none"), (d = []));
    }, 6e3)));
}
(r("#btn-select-all").addEventListener("click", Wa),
  r("#btn-clear-gallery").addEventListener("click", async () => {
    const e = u.size;
    0 !== e &&
      (await an({
        icon: "🗑",
        title: "Clear Gallery?",
        message: `This will remove all ${e} items from the gallery. This cannot be undone.`,
        confirmText: "Clear All",
        confirmClass: "btn-flow-danger",
      })) &&
      (u.clear(),
      g.clear(),
      b.clear(),
      v.clear(),
      Ba(),
      ee(),
      Te("🗑 Gallery cleared", "info"));
  }),
  r("#btn-download-selected").addEventListener("click", (e) => {
    e.stopPropagation();
    const t = g,
      a = [...t].some((e) => {
        const t = u.get(e);
        return t && "video" !== t.type;
      }),
      n = [...t].some((e) => {
        const t = u.get(e);
        return t && "video" === t.type;
      }),
      o = r("#dl-image-options"),
      s = r("#dl-video-options");
    (o && (o.style.display = a ? "block" : "none"),
      s && (s.style.display = n ? "block" : "none"),
      en());
  }),
  document.querySelectorAll("[data-quality]").forEach((e) => {
    e.addEventListener("click", (t) => {
      (t.stopPropagation(), e.disabled || tn(e.dataset.quality));
    });
  }),
  document.addEventListener("click", (e) => {
    e.target.closest(".download-btn-wrapper") || Za();
  }),
  r("#btn-animate-selected")?.addEventListener("click", () => {
    const e = [...g].filter((e) => xa(u.get(e)));
    0 !== e.length ? _a(e) : Te("⚠️ No animatable images in selection", "warn");
  }),
  r("#btn-close-preview").addEventListener("click", rn),
  r("#preview-modal").addEventListener("click", (e) => {
    e.target === r("#preview-modal") && rn();
  }),
  r("#btn-preview-prev").addEventListener("click", (e) => {
    (e.stopPropagation(), L > 0 && (L--, on()));
  }),
  r("#btn-preview-next").addEventListener("click", (e) => {
    (e.stopPropagation(), L < $.length - 1 && (L++, on()));
  }),
  document.addEventListener("keydown", (e) => {
    "flex" === r("#preview-modal").style.display &&
      ("Escape" === e.key && rn(),
      "ArrowLeft" === e.key && L > 0 && (L--, on()),
      "ArrowRight" === e.key && L < $.length - 1 && (L++, on()));
  }),
  r("#btn-preview-download").addEventListener("click", (e) => {
    (e.stopPropagation(), x ? ln() : sn());
  }),
  document.querySelectorAll("[data-preview-quality]").forEach((e) => {
    e.addEventListener("click", async (t) => {
      if ((t.stopPropagation(), e.disabled)) return;
      const a = e.dataset.previewQuality,
        n = $[L];
      if (!n) return;
      ln();
      const o = r("#btn-preview-download"),
        s = o.innerHTML;
      ((o.disabled = !0), n.type);
      const i = "video-1080p" === a ? "Upscaling..." : "Saving...";
      o.innerHTML = `<div class="uploading-spinner" style="width:14px;height:14px;border-width:1.5px"></div> ${i}`;
      try {
        const e = r("#setting-folder").value.trim() || "turboflow";
        ("4k" === a
          ? await chrome.runtime.sendMessage({
              type: "DOWNLOAD_MULTIPLE",
              items: [
                {
                  mediaId: n.mediaId,
                  type: "image",
                  promptIndex: n.promptIndex,
                },
              ],
              folder: e,
              quality: "4k",
            })
          : "2k" === a
            ? await chrome.runtime.sendMessage({
                type: "DOWNLOAD_SINGLE",
                mediaId: n.mediaId,
                mediaType: "image",
                promptIndex: n.promptIndex,
                folder: e,
              })
            : "video-4k" === a
              ? await chrome.runtime.sendMessage({
                  type: "DOWNLOAD_MULTIPLE",
                  items: [
                    {
                      mediaId: n.mediaId,
                      type: "video",
                      promptIndex: n.promptIndex,
                      workflowId: n.workflowId || null,
                      isPortrait: n.isPortrait || !1,
                    },
                  ],
                  folder: e,
                  quality: "standard",
                  videoQuality: "4k",
                  videoAspectRatio: n.isPortrait ? "portrait" : "landscape",
                })
              : "video-1080p" === a
                ? await chrome.runtime.sendMessage({
                    type: "DOWNLOAD_MULTIPLE",
                    items: [
                      {
                        mediaId: n.mediaId,
                        type: "video",
                        promptIndex: n.promptIndex,
                        workflowId: n.workflowId || null,
                        isPortrait: n.isPortrait || !1,
                      },
                    ],
                    folder: e,
                    quality: "standard",
                    videoQuality: "1080p",
                  })
                : "video-standard" === a
                  ? await chrome.runtime.sendMessage({
                      type: "DOWNLOAD_MULTIPLE",
                      items: [
                        {
                          mediaId: n.mediaId,
                          type: "video",
                          promptIndex: n.promptIndex,
                          workflowId: n.workflowId || null,
                          isPortrait: n.isPortrait || !1,
                        },
                      ],
                      folder: e,
                      quality: "standard",
                      videoQuality: "standard",
                    })
                  : await chrome.runtime.sendMessage({
                      type: "DOWNLOAD_MULTIPLE",
                      items: [
                        {
                          mediaId: n.mediaId,
                          type: n.type || "image",
                          promptIndex: n.promptIndex,
                        },
                      ],
                      folder: e,
                      quality: "standard",
                    }),
          (o.innerHTML =
            '<span class="material-symbols-outlined" style="font-size:16px">check</span> Saved'),
          setTimeout(() => {
            ((o.innerHTML = s), (o.disabled = !1));
          }, 2e3));
      } catch (e) {
        ((o.innerHTML = s), (o.disabled = !1));
      }
    });
  }),
  document.addEventListener("click", (e) => {
    e.target.closest("#preview-download-wrapper") || ln();
  }),
  r("#btn-preview-animate")?.addEventListener("click", () => {
    const e = $[L];
    e && xa(e) && (rn(), _a([e.mediaId]));
  }),
  r("#btn-undo")?.addEventListener("click", () => {
    if (0 === d.length) return;
    const e = d.pop();
    ("delete-batch" === e.type
      ? (l.batches.splice(e.index, 0, e.batch),
        X(),
        Sn(),
        Te(`↩️ Batch "${e.batch.name}" restored`, "success"))
      : "delete-all" === e.type &&
        ((l.batches = e.batches),
        X(),
        Sn(),
        Te(`↩️ All ${e.batches.length} batches restored`, "success")),
      (r("#undo-toast").style.display = "none"),
      c && clearTimeout(c));
  }),
  r("#btn-reset-all")?.addEventListener("click", kn),
  r("#btn-delete-all")?.addEventListener("click", () => {
    if (l.batches.find((e) => "running" === e.status))
      return void Te("⚠️ Stop the running batch first", "warn");
    if (0 === l.batches.length) return;
    d.push({ type: "delete-all", batches: [...l.batches] });
    const e = l.batches.length;
    ((l.batches = []),
      An(`${e} batches deleted`),
      X(),
      Sn(),
      Te(`🗑️ Deleted all ${e} batches`, "info"));
  }),
  r("#btn-export-batches")?.addEventListener("click", Mn),
  r("#btn-import-batches")?.addEventListener("click", () =>
    r("#import-file-input")?.click(),
  ),
  r("#import-file-input")?.addEventListener("change", (e) => {
    const t = e.target.files[0];
    if (!t) return;
    const a = new FileReader();
    ((a.onload = (e) => $n(e.target.result)),
      a.readAsText(t),
      (e.target.value = ""));
  }),
  r("#batch-search")?.addEventListener("input", () => {
    Sn();
  }),
  r("#btn-run-all")?.addEventListener("click", async () => {
    const e = l.batches.filter((e) => "pending" === e.status);
    if (0 === e.length) return void Te("No pending batches to run", "warn");
    if (!(await Oe())) return void Te("Not connected to Flow page!", "error");
    if (!1) {
      const t = i.promptsRemaining ?? 0,
        a = e.reduce(
          (e, t) => e + t.prompts.filter((e) => "pending" === e.status).length,
          0,
        );
      if (t <= 0)
        return void Gn({
          icon: "⏳",
          title: "Google Limit Reached",
          message: `You've used all <strong>${i.promptsPerDay || 0}</strong> available prompts for today.`,
          hint: "Come back tomorrow for more available prompts, or <strong>reduce this batch size</strong> before running this batch.",
        });
      if (a > t)
        return void Gn({
          icon: "⚠️",
          title: "Not Enough Prompts",
          message: `Your queued batches have <strong>${a}</strong> total prompts but you only have <strong>${t}</strong> remaining today.`,
          hint: "Remove some prompts or batches to fit within your limit, or <strong>reduce this batch size</strong> before running this batch.",
        });
    }
    const t = e[0];
    (Te(`▶️ Starting ${e.length} batches (auto-chain)...`, "success"),
      (p = !0),
      Pn("run-batch", t.id, null, { keepChain: !0 }));
  }));
const Tn = r("#prompt-input"),
  Cn = r("#prompt-count"),
  Rn = r("#btn-add-queue"),
  Fn = r("#btn-start"),
  Dn = r("#btn-stop"),
  Nn = r("#stop-section"),
  qn = r("#progress-section"),
  On = r("#progress-fill"),
  Un = r("#progress-text"),
  Bn = r("#file-input");
function jn(e) {
  if (!l.singlePromptMode) return e;
  if ("video" !== l.mode) return e;
  if ("start_frame" !== l.settings.videoMode) return e;
  if ("mapped" !== l.referenceMode) return e;
  if (1 !== e.length) return e;
  const t = Object.keys(l.promptStartFrameMap)
    .map(Number)
    .sort((e, t) => e - t)
    .map((e) => l.promptStartFrameMap[e])
    .filter(Boolean);
  return t.length <= 1
    ? e
    : ((l.promptStartFrameMap = {}),
      t.forEach((e, t) => {
        l.promptStartFrameMap[t] = e;
      }),
      J(),
      Te(`📝 Single prompt expanded to ${t.length} videos`, "info"),
      Array(t.length).fill(e[0]));
}
function Gn({ icon: e, title: t, message: a, hint: n }) {
  const o = r("#validation-modal"),
    s = r("#validation-icon"),
    i = r("#validation-title"),
    l = r("#validation-message"),
    d = r("#validation-hint"),
    c = r("#btn-validation-ok");
  function p() {
    ((o.style.display = "none"),
      c.removeEventListener("click", p),
      o.removeEventListener("click", m));
  }
  function m(e) {
    e.target === o && p();
  }
  ((s.textContent = e || "⚠️"),
    (i.textContent = t || "Can't Generate Yet"),
    (l.innerHTML = a || ""),
    n
      ? ((d.innerHTML = n), (d.style.display = "block"))
      : (d.style.display = "none"),
    (o.style.display = "flex"),
    c.addEventListener("click", p),
    o.addEventListener("click", m));
}
function Hn() {
  const e = Tn.value.split("\n").filter((e) => e.trim().length > 0).length;
  Cn.textContent =
    0 === e ? "0 prompts" : 1 === e ? "1 prompt" : `${e} prompts`;
}
function Qn() {
  const e = l.settings.videoQuality || "lite",
    t = l.settings.videoDuration || 8,
    a = "omni_flash" === e,
    n = pe(F),
    s = r('[data-vid-duration="4"]'),
    i = r('[data-vid-duration="6"]'),
    d = r('[data-vid-duration="8"]'),
    c = r('[data-vid-duration="10"]');
  (c && (a ? c.classList.remove("locked") : c.classList.add("locked")),
    a || n
      ? (s?.classList.remove("locked"), i?.classList.remove("locked"))
      : (s?.classList.add("locked"), i?.classList.add("locked")),
    d?.classList.remove("locked"));
  let p = !1;
  (((10 !== t || a) && ((4 !== t && 6 !== t) || a || n)) ||
    ((l.settings.videoDuration = 8), (p = !0)),
    p &&
      (o("[data-vid-duration]").forEach((e) =>
        e.classList.toggle("active", 8 === parseInt(e.dataset.vidDuration)),
      ),
      J()));
  const m = l.settings.videoDuration,
    u = r('[data-vid-mode="start_frame"]'),
    g = r('[data-vid-mode="start_end_frame"]'),
    f = r('[data-vid-mode="reference"]'),
    h = l.settings.videoMode || "text";
  (a
    ? (u?.classList.remove("locked"),
      g?.classList.add("locked"),
      f?.classList.remove("locked"),
      "start_end_frame" === h &&
        ((l.settings.videoMode = "text"),
        o("[data-vid-mode]").forEach((e) =>
          e.classList.toggle("active", "text" === e.dataset.vidMode),
        ),
        Wn(),
        J(),
        Te(
          "⚠️ Omni Flash does not support start + end frames — switched to Text mode",
          "warn",
        )))
    : (u?.classList.remove("locked"),
      g?.classList.remove("locked"),
      8 !== m
        ? (f?.classList.add("locked"),
          "reference" === h &&
            ((l.settings.videoMode = "text"),
            o("[data-vid-mode]").forEach((e) =>
              e.classList.toggle("active", "text" === e.dataset.vidMode),
            ),
            Wn(),
            J(),
            Te(
              "⚠️ Reference mode is only available at 8 seconds for Veo models — switched to Text",
              "warn",
            )))
        : "quality" === e
          ? f?.classList.add("locked")
          : f?.classList.remove("locked")),
    Ea());
}
function Wn() {
  const e = l.settings.videoMode;
  ((r("#start-frame-section").style.display =
    "start_frame" === e || "start_end_frame" === e ? "block" : "none"),
    (r("#end-frame-section").style.display =
      "start_end_frame" === e ? "block" : "none"),
    (r("#reference-section").style.display =
      "reference" === e ? "block" : "none"));
}
function Vn(e) {
  return new Promise((t, a) => {
    const n = new FileReader();
    ((n.onload = () => {
      const e = n.result.split(",")[1];
      t(e);
    }),
      (n.onerror = a),
      n.readAsDataURL(e));
  });
}
function zn(e) {
  ((Fn.disabled = e),
    (Dn.disabled = !e),
    (Nn.style.display = e ? "block" : "none"),
    (qn.style.display = e ? "block" : "none"));
  const t = r("#btn-start-locked"),
    a = r("#btn-add-queue-locked");
  (t && (t.disabled = e),
    a && (a.disabled = e),
    e
      ? ((Fe.textContent = "Running"), (Fe.className = "badge badge-running"))
      : T && Ne(T),
    "function" == typeof er && er(),
    "function" == typeof rr && rr(),
    "function" == typeof Ya && Ya(),
    "function" == typeof Ba && Ba());
}
function Yn() {
  (m && clearInterval(m),
    (m = setInterval(async () => {
      try {
        const e = await chrome.runtime.sendMessage({ type: "GET_STATS" });
        if (e?.stats) {
          l.stats = e.stats;
          const t = e.stats;
          Un.textContent = `Downloaded: ${t.downloaded} / ${t.total}${t.failed > 0 ? ` · Failed: ${t.failed}` : ""}`;
          const a =
            t.total > 0 ? Math.round((t.downloaded / t.total) * 100) : 0;
          if (
            ((On.style.width = `${a}%`),
            l.activeBatchId && hn(l.activeBatchId, t),
            0 === t.total && e.isRunning)
          )
            return;
          if (0 === t.total && !e.isRunning) {
            if (
              (l._emptyPollCount || (l._emptyPollCount = 0),
              l._emptyPollCount++,
              l._emptyPollCount < 10)
            )
              return;
            if (
              ((l._emptyPollCount = 0),
              clearInterval(m),
              (m = null),
              l.activeBatchId)
            ) {
              const e = pn(l.activeBatchId);
              (e && "running" === e.status && gn(l.activeBatchId, "failed"),
                (l.activeBatchId = null));
            }
            return (
              zn(!1),
              De("Failed", "badge badge-disconnected", 5e3),
              Oa(),
              void ze()
            );
          }
          t.total > 0 && (l._emptyPollCount = 0);
          let n = 0;
          if (l.activeBatchId)
            for (const [e, t] of u)
              t.batchId === l.activeBatchId &&
                t.isPlaceholder &&
                "generating" === t.status &&
                n++;
          const o =
            t.total > 0 &&
            t.downloaded + t.failed >= t.total &&
            !e.downloading &&
            !e.isRunning &&
            0 === n;
          if (!e.isRunning && n > 0)
            return (
              Te(
                `🧹 Cleaning ${n} stuck placeholder${n > 1 ? "s" : ""}...`,
                "warn",
              ),
              void Oa()
            );
          if (!o) return;
          if (
            (clearInterval(m),
            (m = null),
            ze(),
            Oa(),
            l.batchStartTime &&
              t.downloaded > 0 &&
              ((l.avgTimePerImage =
                (Date.now() - l.batchStartTime) / t.downloaded),
              X()),
            l.activeBatchId)
          ) {
            const e = pn(l.activeBatchId);
            if (e) {
              let a = 0;
              (e.prompts.forEach((e) => {
                ("running" !== e.status && "pending" !== e.status) ||
                  ((e.status = "failed"), a++);
              }),
                a > 0 &&
                  Te(
                    `⚠️ ${a} prompt${a > 1 ? "s" : ""} stuck without status — marked as failed. Click "Retry Failed" to redo them.`,
                    "warn",
                  ));
              const n = e.prompts.filter((e) => "failed" === e.status).length;
              let r;
              ((r =
                0 ===
                  e.prompts.filter(
                    (e) => "done" === e.status || "submitted" === e.status,
                  ).length && n > 0
                  ? "failed"
                  : n > 0 || t.failed > 0
                    ? "partial"
                    : "done"),
                gn(l.activeBatchId, r),
                (e.collapsed = !0),
                X(),
                Sn());
            }
            l.activeBatchId = null;
          }
          (zn(!1),
            De("Done", "badge badge-connected", 5e3),
            (qn.style.display = "block"));
          const s = p ? un() : null;
          if (s) {
            (Te(`⛓️ Auto-chaining → "${s.name}"`, "success"),
              (U = !0),
              await ie(2e3),
              gn(s.id, "running"),
              (l.activeBatchId = s.id),
              (l.batchStartTime = Date.now()));
            const e = s.prompts
                .map((e, t) => ({
                  text: e.text,
                  status: e.status,
                  originalIndex: t,
                }))
                .filter((e) => "pending" === e.status),
              t = e.map((e) => e.text),
              a = e.map((e) => e.originalIndex),
              n = s.settings;
            (zn(!0),
              qa(
                t,
                {
                  mode: n.mode,
                  imageCount: n.imageCount,
                  videoCount: n.videoCount || 1,
                  aspectRatio: n.imageRatio,
                  videoRatio: n.videoRatio,
                },
                a,
                { batchId: s.id, batchName: s.name },
              ));
            try {
              (await chrome.runtime.sendMessage({
                type: "START_BATCH",
                batchId: s.id,
                prompts: t,
                promptIndexMap: a,
                settings: {
                  mode: n.mode,
                  folder: s.folder,
                  imageModel: n.imageModel,
                  aspectRatio: n.imageRatio,
                  imageCount: n.imageCount,
                  videoQuality: n.videoQuality,
                  videoRatio: n.videoRatio,
                  videoMode: n.videoMode,
                  videoCount: n.videoCount || 1,
                  videoDuration: n.videoDuration || 8,
                  startFrameMediaId: n.startFrameMediaId,
                  endFrameMediaId: n.endFrameMediaId,
                  referenceMediaIds: n.referenceMediaIds,
                  imageReferenceMediaIds: n.imageReferenceMediaIds || [],
                  autoDownloadImages: r("#setting-autodownload-images").checked,
                  autoDownloadVideos: r("#setting-autodownload-videos").checked,
                  imageDownloadQuality: l.settings.imageDownloadQuality || "2k",
                  videoDownloadQuality:
                    l.settings.videoDownloadQuality || "standard",
                  naming: n.naming || l.settings.naming || "numbered",
                  namingPrefix: n.namingPrefix || l.settings.namingPrefix || "",
                  namingSeparator:
                    void 0 !== n.namingSeparator
                      ? n.namingSeparator
                      : void 0 !== l.settings.namingSeparator
                        ? l.settings.namingSeparator
                        : "-",
                  startNumber: n.startNumber || l.settings.startNumber || 1,
                  perPromptReferences: n.perPromptReferences || null,
                  perPromptStartFrames: n.perPromptStartFrames || null,
                  perPromptEndFrames: n.perPromptEndFrames || null,
                  referenceMode: n.referenceMode || "shared",
                  singlePromptBatch: !0 === n.singlePromptBatch,
                  speedMode: l.speedMode || "fast",
                  _autoChained: !0,
                },
                featureFlags: de(),
                uploadsThisSession: q,
              }),
                Yn());
            } catch (e) {
              (Te(`❌ Auto-chain failed: ${e.message}`, "error"),
                gn(s.id, "failed"),
                (l.activeBatchId = null),
                zn(!1),
                Oa());
            }
          }
        }
      } catch (e) {}
    }, 2e3)));
}
(Tn.addEventListener("input", Hn),
  Tn.addEventListener("change", Hn),
  o(".tab").forEach((e) => {
    e.addEventListener("click", () => {
      (o(".tab").forEach((e) => e.classList.remove("active")),
        o(".tab-content").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        r(`#tab-${e.dataset.tab}`).classList.add("active"));
    });
  }),
  o("[data-mode]").forEach((e) => {
    e.addEventListener("click", () => {
      (o("[data-mode]").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        (l.mode = e.dataset.mode),
        "video" === e.dataset.mode && (G = !0),
        (r("#image-settings").style.display =
          "image" === l.mode ? "block" : "none"),
        (r("#video-settings").style.display =
          "video" === l.mode ? "block" : "none"),
        J(),
        Ea(),
        er());
    });
  }),
  o("[data-img-ratio]").forEach((e) => {
    e.addEventListener("click", () => {
      (o("[data-img-ratio]").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        (l.settings.imageRatio = e.dataset.imgRatio),
        J());
    });
  }),
  o("[data-img-count]").forEach((e) => {
    e.addEventListener("click", () => {
      (o("[data-img-count]").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        (l.settings.imageCount = parseInt(e.dataset.imgCount)),
        J());
    });
  }),
  r("#setting-image-model").addEventListener("change", (e) => {
    ((l.settings.imageModel = e.target.value),
      r("#setting-autodownload-images").checked &&
        ((r("#setting-image-quality").disabled = !1),
        (r("#setting-image-quality-row").style.opacity = "1")),
      Ue(),
      J());
  }),
  o("[data-vid-ratio]").forEach((e) => {
    e.addEventListener("click", () => {
      (o("[data-vid-ratio]").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        (l.settings.videoRatio = e.dataset.vidRatio),
        J());
    });
  }),
  r("#setting-video-quality").addEventListener("change", (e) => {
    if (
      ((l.settings.videoQuality = e.target.value), "relaxed" === e.target.value)
    ) {
      const t = !0,
        a = pe(F);
      if (!t || !a) {
        e.target.value = l.settings.videoQuality || "lite";
        let n = "Upgrade required";
        return (
          t
            ? a || (n = "Lower Priority mode requires Google AI Ultra plan")
            : (n =
                "Lower Priority mode requires a supported Google account tier"),
          Te("🔒 " + n, "warn"),
          void (l.settings.videoQuality = e.target.value)
        );
      }
    }
    if ("lite_lp" === e.target.value) {
      const t = !0,
        a = pe(F);
      if (!t || !a) {
        e.target.value = l.settings.videoQuality || "lite";
        let n = "Upgrade required";
        return (
          t
            ? a ||
              (n = "Lite Lower Priority mode requires Google AI Ultra plan")
            : (n =
                "Lite Lower Priority mode requires a supported Google account tier"),
          Te("🔒 " + n, "warn"),
          void (l.settings.videoQuality = e.target.value)
        );
      }
    }
    (J(), Qn());
  }),
  o("[data-vid-count]").forEach((e) => {
    e.addEventListener("click", () => {
      (o("[data-vid-count]").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        (l.settings.videoCount = parseInt(e.dataset.vidCount)),
        J());
    });
  }),
  o("[data-vid-duration]").forEach((e) => {
    e.addEventListener("click", () => {
      if (e.classList.contains("locked")) {
        const t = parseInt(e.dataset.vidDuration),
          a = pe(F),
          n = "omni_flash" === l.settings.videoQuality;
        return void (10 === t
          ? Te(
              "🔒 10 seconds is only available for the Omni Flash model",
              "warn",
            )
          : (4 !== t && 6 !== t) ||
            n ||
            a ||
            Te(
              "🔒 Custom durations require Google AI Ultra plan — or switch to Omni Flash model",
              "warn",
            ));
      }
      (o("[data-vid-duration]").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        (l.settings.videoDuration = parseInt(e.dataset.vidDuration)),
        J(),
        Qn(),
        cr());
    });
  }),
  o("[data-vid-mode]").forEach((e) => {
    e.addEventListener("click", () => {
      if (e.classList.contains("locked")) {
        const t = e.dataset.vidMode,
          a = l.settings.videoQuality,
          n = l.settings.videoDuration || 8;
        return void ("omni_flash" === a && "start_end_frame" === t
          ? Te(
              "🔒 Start + end frames are not available for the Omni Flash model yet",
              "warn",
            )
          : "reference" === t && "omni_flash" !== a && 8 !== n
            ? Te(
                "🔒 Reference mode is only available at 8 seconds for Veo models",
                "warn",
              )
            : "reference" === t &&
              "quality" === a &&
              Te(
                "🔒 Reference mode is not available for Veo 3.1 Quality — switch to Fast or Lite",
                "warn",
              ));
      }
      (o("[data-vid-mode]").forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        (l.settings.videoMode = e.dataset.vidMode),
        Wn(),
        J(),
        Ea(),
        er());
    });
  }),
  r("#btn-upload-start")?.addEventListener("click", Ut),
  r("#btn-upload-end")?.addEventListener("click", Bt),
  r("#btn-add-img-reference").addEventListener("click", qt),
  r("#btn-add-reference").addEventListener("click", Ot),
  r("#btn-import-txt").addEventListener("click", () => Bn.click()),
  Bn.addEventListener("change", (e) => {
    const t = e.target.files[0];
    if (!t) return;
    const a = new FileReader();
    ((a.onload = (e) => {
      ((Tn.value = e.target.result),
        Hn(),
        Te(`📄 Imported ${t.name}`, "success"));
    }),
      a.readAsText(t),
      (Bn.value = ""));
  }),
  r("#setting-autodownload-images").addEventListener("change", (e) => {
    ((l.settings.autoDownloadImages = e.target.checked),
      (r("#setting-image-quality-row").style.opacity = e.target.checked
        ? "1"
        : "0.4"),
      (r("#setting-image-quality").disabled = !e.target.checked),
      Ue(),
      J());
  }),
  r("#setting-image-quality").addEventListener("change", (e) => {
    const t = e.target.value;
    if ("4k" === t) {
      const t = !0,
        a = pe(F);
      if (!t || !a) {
        e.target.value = l.settings.imageDownloadQuality || "2k";
        let n = "Upgrade required";
        return (
          t
            ? a || (n = "4K requires Google AI Ultra plan")
            : (n = "4K requires a supported Google account tier"),
          void Te("🔒 " + n, "warn")
        );
      }
    }
    ((l.settings.imageDownloadQuality = t), J());
  }),
  r("#setting-autodownload-videos").addEventListener("change", (e) => {
    ((l.settings.autoDownloadVideos = e.target.checked),
      (r("#setting-video-quality-row").style.opacity = e.target.checked
        ? "1"
        : "0.4"),
      (r("#setting-video-quality-dl").disabled = !e.target.checked),
      Ue(),
      J());
  }),
  r("#setting-video-quality-dl").addEventListener("change", (e) => {
    const t = e.target.value;
    if ("4k" === t) {
      const t = !0,
        a = pe(F);
      if (!t || !a) {
        e.target.value = l.settings.videoDownloadQuality || "standard";
        let n = "Upgrade required";
        return (
          t
            ? a || (n = "4K video requires Google AI Ultra plan")
            : (n = "4K video requires a supported Google account tier"),
          void Te("🔒 " + n, "warn")
        );
      }
    }
    ((l.settings.videoDownloadQuality = t), J());
  }),
  r("#setting-folder").addEventListener("change", (e) => {
    ((l.settings.folder = e.target.value.trim() || "turboflow"), J());
  }),
  r("#setting-naming").addEventListener("change", (e) => {
    l.settings.naming = e.target.value;
    const t = "prefix" === e.target.value;
    ((r("#setting-prefix-row").style.display = t ? "flex" : "none"),
      (r("#setting-separator-row").style.display = t ? "flex" : "none"),
      J());
  }),
  r("#setting-prefix").addEventListener("change", (e) => {
    ((l.settings.namingPrefix = e.target.value.trim()), J());
  }),
  r("#setting-separator").addEventListener("change", (e) => {
    ((l.settings.namingSeparator = e.target.value), J());
  }),
  r("#setting-start-number").addEventListener("change", (e) => {
    let t = parseInt(e.target.value);
    ((isNaN(t) || t < 1) && (t = 1),
      t > 1e5 && (t = 1e5),
      (e.target.value = t),
      (l.settings.startNumber = t),
      J());
  }),
  r("#btn-restart-tour")?.addEventListener("click", st),
  r("#btn-fix-unusual")?.addEventListener("click", () => {
    ((r("#fix-unusual-modal").style.display = "flex"),
      "function" == typeof le &&
        le("fix_unusual_modal_opened", { trigger: "button" }));
  }),
  r("#btn-close-fix-unusual")?.addEventListener("click", () => {
    r("#fix-unusual-modal").style.display = "none";
  }),
  r("#fix-unusual-modal")?.addEventListener("click", (e) => {
    e.target === r("#fix-unusual-modal") &&
      (r("#fix-unusual-modal").style.display = "none");
  }),
  r("#btn-open-clear-data")?.addEventListener("click", () => {
    (chrome.tabs.create({ url: "chrome://settings/clearBrowserData" }),
      (r("#fix-unusual-modal").style.display = "none"),
      "function" == typeof le && le("clear_data_page_opened", {}));
  }),
  r("#btn-add-queue-locked")?.addEventListener("click", () => {
    let e = r("#prompt-input")
      .value.split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    if (((e = jn(e)), e.length)) {
      if (!1) {
        const t = i.promptsRemaining ?? 0;
        if (t <= 0)
          return (
            (r("#limit-message").textContent =
              `You've used all ${i.promptsPerDay || 0} available prompts for today.`),
            void (r("#limit-modal").style.display = "flex")
          );
        if (e.length > t)
          return void Gn({
            icon: "⚠️",
            title: "Not Enough Prompts",
            message: `You entered <strong>${e.length}</strong> prompts but only have <strong>${t}</strong> remaining today.`,
            hint: `Remove ${e.length - t} prompt${e.length - t > 1 ? "s" : ""} to continue, or <strong>reduce this batch size</strong> before running this batch.`,
          });
      }
      if (
        l.singlePromptMode &&
        "mapped" === l.referenceMode &&
        e.length >= 1 &&
        0 ===
          Object.keys(l.promptStartFrameMap).filter(
            (e) => l.promptStartFrameMap[e],
          ).length
      )
        return void Gn({
          icon: "🖼️",
          title: "No Start Frames",
          message:
            "Single prompt mode needs at least one start frame. Open the mapper to add images.",
          hint: 'Click "Different for Each" below the prompt area to assign start frames.',
        });
      if ("video" === l.mode) {
        const e = l.settings.videoMode;
        if (
          !(
            ("start_frame" !== e && "start_end_frame" !== e) ||
            l.startFrameMediaId ||
            ("mapped" === l.referenceMode &&
              Object.keys(l.promptStartFrameMap).length > 0)
          )
        )
          return void Gn({
            icon: "🖼️",
            title: "Start Frame Required",
            message:
              "<strong>Start Frame</strong> mode requires an image for each video to start from, but none are attached.",
            hint: '<strong>Option 1:</strong> Click "Choose Start Frame" to pick one image for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign a unique start frame to each prompt.',
          });
        if (
          !(
            "start_end_frame" !== e ||
            l.endFrameMediaId ||
            ("mapped" === l.referenceMode &&
              Object.keys(l.promptEndFrameMap).length > 0)
          )
        )
          return void Gn({
            icon: "🖼️",
            title: "End Frame Required",
            message:
              "<strong>Start + End Frame</strong> mode requires an end frame image, but none is attached.",
            hint: '<strong>Option 1:</strong> Click "Choose End Frame" to pick one image for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign a unique end frame to each prompt.',
          });
        if (
          !(
            "reference" !== e ||
            (l.referenceMediaIds && 0 !== l.referenceMediaIds.length) ||
            ("mapped" === l.referenceMode &&
              Object.keys(l.promptReferenceMap).length > 0)
          )
        )
          return void Gn({
            icon: "🎨",
            title: "Reference Images Required",
            message:
              "<strong>Reference</strong> mode requires at least one reference image to guide the video style, but none are attached.",
            hint: '<strong>Option 1:</strong> Click "Add Shared Refs" to pick images for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign unique references per prompt.',
          });
      }
      (cn(e, { runNow: !1 }),
        "mapped" === l.referenceMode &&
          ((l.referenceMode = "shared"),
          (l.promptReferenceMap = {}),
          (l.promptStartFrameMap = {}),
          (l.promptEndFrameMap = {}),
          (K = []),
          J(),
          re(),
          Ia(),
          ka(),
          Ea()),
        (r("#prompt-input").value = ""),
        Hn(),
        o(".tab").forEach((e) => e.classList.remove("active")),
        o(".tab-content").forEach((e) => e.classList.remove("active")),
        r('[data-tab="queue"]').classList.add("active"),
        r("#tab-queue").classList.add("active"));
    } else Te("No prompts to queue", "warn");
  }),
  r("#btn-start-locked")?.addEventListener("click", () => {
    Fn.click();
  }),
  Rn.addEventListener("click", () => {
    let e = Tn.value
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    if (((e = jn(e)), e.length)) {
      if (!1) {
        const t = i.promptsRemaining ?? 0;
        if (t <= 0)
          return (
            (r("#limit-message").textContent =
              `You've used all ${i.promptsPerDay || 0} available prompts for today.`),
            void (r("#limit-modal").style.display = "flex")
          );
        if (e.length > t)
          return void Gn({
            icon: "⚠️",
            title: "Not Enough Prompts",
            message: `You entered <strong>${e.length}</strong> prompts but only have <strong>${t}</strong> remaining today.`,
            hint: `Remove ${e.length - t} prompt${e.length - t > 1 ? "s" : ""} to continue, or <strong>reduce this batch size</strong> before running this batch.`,
          });
      }
      if ("video" === l.mode) {
        const e = l.settings.videoMode;
        if (
          !(
            ("start_frame" !== e && "start_end_frame" !== e) ||
            l.startFrameMediaId ||
            ("mapped" === l.referenceMode &&
              Object.keys(l.promptStartFrameMap).length > 0)
          )
        )
          return void Gn({
            icon: "🖼️",
            title: "Start Frame Required",
            message:
              "<strong>Start Frame</strong> mode requires an image for each video to start from, but none are attached.",
            hint: '<strong>Option 1:</strong> Click "Choose Start Frame" to pick one image for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign a unique start frame to each prompt.',
          });
        if (
          !(
            "start_end_frame" !== e ||
            l.endFrameMediaId ||
            ("mapped" === l.referenceMode &&
              Object.keys(l.promptEndFrameMap).length > 0)
          )
        )
          return void Gn({
            icon: "🖼️",
            title: "End Frame Required",
            message:
              "<strong>Start + End Frame</strong> mode requires an end frame image, but none is attached.",
            hint: '<strong>Option 1:</strong> Click "Choose End Frame" to pick one image for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign a unique end frame to each prompt.',
          });
        if (
          !(
            "reference" !== e ||
            (l.referenceMediaIds && 0 !== l.referenceMediaIds.length) ||
            ("mapped" === l.referenceMode &&
              Object.keys(l.promptReferenceMap).length > 0)
          )
        )
          return void Gn({
            icon: "🎨",
            title: "Reference Images Required",
            message:
              "<strong>Reference</strong> mode requires at least one reference image to guide the video style, but none are attached.",
            hint: '<strong>Option 1:</strong> Click "Add Shared Refs" to pick images for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign unique references per prompt.',
          });
      }
      (cn(e, { runNow: !1 }),
        (Tn.value = ""),
        Hn(),
        "mapped" === l.referenceMode &&
          ((l.referenceMode = "shared"),
          (l.promptReferenceMap = {}),
          (l.promptStartFrameMap = {}),
          (l.promptEndFrameMap = {}),
          (K = []),
          J(),
          re(),
          Ia(),
          ka(),
          Ea()),
        o(".tab").forEach((e) => e.classList.remove("active")),
        o(".tab-content").forEach((e) => e.classList.remove("active")),
        r('[data-tab="queue"]').classList.add("active"),
        r("#tab-queue").classList.add("active"));
    } else Te("No prompts to queue", "warn");
  }),
  Fn.addEventListener("click", async () => {
    if ((Te("🔍 Checking connection...", "info"), !(await Oe())))
      return void Te("Not connected to Flow page!", "error");
    Te("✅ Connected", "info");
    let e = Tn.value
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    if (((e = jn(e)), e.length > 0 && !1)) {
      const t = i.promptsRemaining ?? 0;
      if (t <= 0)
        return (
          (r("#limit-message").textContent =
            `You've used all ${i.promptsPerDay || 0} available prompts for today.`),
          void (r("#limit-modal").style.display = "flex")
        );
      if (e.length > t)
        return void Gn({
          icon: "⚠️",
          title: "Not Enough Prompts",
          message: `You entered <strong>${e.length}</strong> prompts but only have <strong>${t}</strong> remaining today.`,
          hint: `Remove ${e.length - t} prompt${e.length - t > 1 ? "s" : ""} to continue, or <strong>reduce this batch size</strong> before running this batch.`,
        });
    }
    if (
      l.singlePromptMode &&
      "mapped" === l.referenceMode &&
      e.length >= 1 &&
      0 ===
        Object.keys(l.promptStartFrameMap).filter(
          (e) => l.promptStartFrameMap[e],
        ).length
    )
      return void Gn({
        icon: "🖼️",
        title: "No Start Frames",
        message:
          "Single prompt mode needs at least one start frame. Open the mapper to add images.",
        hint: 'Click "Different for Each" below the prompt area to assign start frames.',
      });
    if (e.length > 0 && "video" === l.mode) {
      const t = l.settings.videoMode,
        a = "mapped" === l.referenceMode,
        n = a && Object.keys(l.promptStartFrameMap).length > 0,
        r = a && Object.keys(l.promptEndFrameMap).length > 0,
        o = a && Object.keys(l.promptReferenceMap).length > 0,
        s = e.length;
      if (
        !(
          ("start_frame" !== t && "start_end_frame" !== t) ||
          l.startFrameMediaId ||
          n
        )
      )
        return (
          Gn({
            icon: "🖼️",
            title: "Start Frame Required",
            message:
              "<strong>Start Frame</strong> mode requires an image for each video to start from, but none are attached.",
            hint: '<strong>Option 1:</strong> Click "Choose Start Frame" to pick one image for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign a unique start frame to each prompt.',
          }),
          void Te("❌ No start frame attached — generation blocked", "error")
        );
      if (
        ("start_frame" === t || "start_end_frame" === t) &&
        n &&
        !l.startFrameMediaId
      ) {
        const e = Object.keys(l.promptStartFrameMap).length;
        if (e < s)
          return (
            Gn({
              icon: "⚠️",
              title: "Some Prompts Missing Start Frames",
              message: `Only <strong>${e}</strong> of <strong>${s}</strong> prompts have a start frame assigned. The unmapped prompts will fail.`,
              hint: 'Open "Different for Each" to assign the missing frames, or switch to a shared start frame for all prompts.',
            }),
            void Te(
              `⚠️ ${s - e} prompts have no start frame — generation blocked`,
              "error",
            )
          );
      }
      if ("start_end_frame" === t) {
        if (a && !l.endFrameMediaId) {
          if (!r)
            return (
              Gn({
                icon: "🖼️",
                title: "End Frames Required",
                message:
                  "<strong>Start + End Frame</strong> mode requires an end frame for each prompt, but none are assigned.",
                hint: 'Open "Different for Each" and set end frames, or attach a shared end frame.',
              }),
              void Te("❌ No end frames attached — generation blocked", "error")
            );
          const e = Object.keys(l.promptEndFrameMap).length;
          if (e < s)
            return (
              Gn({
                icon: "⚠️",
                title: "Some Prompts Missing End Frames",
                message: `Only <strong>${e}</strong> of <strong>${s}</strong> prompts have an end frame assigned. The unmapped prompts will fail.`,
                hint: 'Open "Different for Each" to assign the missing end frames, or switch to a shared end frame for all prompts.',
              }),
              void Te(
                `⚠️ ${s - e} prompts have no end frame — generation blocked`,
                "error",
              )
            );
        }
        if (!a && !l.endFrameMediaId)
          return (
            Gn({
              icon: "🖼️",
              title: "End Frame Required",
              message:
                "<strong>Start + End Frame</strong> mode requires an end frame image, but none is attached.",
              hint: 'Click "Choose End Frame" to select an image from your library, or use "Different for Each" to assign per-prompt end frames.',
            }),
            void Te("❌ No end frame attached — generation blocked", "error")
          );
      }
      if (
        !(
          "reference" !== t ||
          (l.referenceMediaIds && 0 !== l.referenceMediaIds.length) ||
          o
        )
      )
        return (
          Gn({
            icon: "🎨",
            title: "Reference Images Required",
            message:
              "<strong>Reference</strong> mode requires at least one reference image to guide the video style, but none are attached.",
            hint: '<strong>Option 1:</strong> Click "Add Shared Refs" to pick images for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign unique references per prompt.',
          }),
          void Te(
            "❌ No reference images attached — generation blocked",
            "error",
          )
        );
      if (
        "reference" === t &&
        o &&
        (!l.referenceMediaIds || 0 === l.referenceMediaIds.length)
      ) {
        const e = Object.keys(l.promptReferenceMap).filter(
          (e) => l.promptReferenceMap[e].length > 0,
        ).length;
        if (e < s)
          return (
            Gn({
              icon: "⚠️",
              title: "Some Prompts Missing References",
              message: `Only <strong>${e}</strong> of <strong>${s}</strong> prompts have reference images assigned. The unmapped prompts will fail.`,
              hint: 'Open "Different for Each" to assign the missing references.',
            }),
            void Te(
              `⚠️ ${s - e} prompts have no references — generation blocked`,
              "error",
            )
          );
      }
    }
    let t = null;
    if (e.length > 0) ((t = cn(e, { runNow: !0 })), (Tn.value = ""), Hn());
    else {
      if (((t = un()), !t))
        return void Te(
          "No prompts to run — type prompts or queue batches first",
          "warn",
        );
      gn(t.id, "running");
    }
    const a = t.settings;
    if (0 === e.length && "video" === a.mode) {
      const e = a.videoMode,
        n =
          a.perPromptStartFrames &&
          Object.keys(a.perPromptStartFrames).length > 0,
        r =
          a.perPromptReferences &&
          Object.keys(a.perPromptReferences).length > 0;
      if (
        (t.prompts.length,
        !(
          ("start_frame" !== e && "start_end_frame" !== e) ||
          a.startFrameMediaId ||
          n
        ))
      )
        return (
          Gn({
            icon: "🖼️",
            title: "Start Frame Required",
            message:
              "<strong>Start Frame</strong> mode requires an image for each video to start from, but none are attached.",
            hint: '<strong>Option 1:</strong> Click "Choose Start Frame" to pick one image for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign a unique start frame to each prompt.',
          }),
          Te("❌ No start frame attached — generation blocked", "error"),
          void gn(t.id, "pending")
        );
      if (
        ("start_frame" === e || "start_end_frame" === e) &&
        n &&
        !a.startFrameMediaId
      ) {
        const e = Object.keys(a.perPromptStartFrames).length,
          n = t.prompts.filter((e) => "pending" === e.status).length;
        if (e < n)
          return (
            Gn({
              icon: "⚠️",
              title: "Some Prompts Missing Start Frames",
              message: `Only <strong>${e}</strong> of <strong>${n}</strong> prompts have a start frame assigned. The unmapped prompts will fail.`,
              hint: 'Open "Different for Each" to assign the missing frames, or switch to a shared start frame for all prompts.',
            }),
            Te(
              `⚠️ ${n - e} prompts have no start frame — generation blocked`,
              "error",
            ),
            void gn(t.id, "pending")
          );
      }
      if (
        "start_end_frame" === e &&
        "mapped" === a.referenceMode &&
        !a.endFrameMediaId
      ) {
        const e =
            a.perPromptEndFrames &&
            Object.keys(a.perPromptEndFrames).length > 0,
          n = t.prompts.filter((e) => "pending" === e.status).length;
        if (!e)
          return (
            Gn({
              icon: "🖼️",
              title: "End Frames Required",
              message:
                "<strong>Start + End Frame</strong> mode requires an end frame for each prompt, but none are assigned.",
              hint: 'Open "Different for Each" and set end frames, or attach a shared end frame.',
            }),
            Te("❌ No end frames attached — generation blocked", "error"),
            void gn(t.id, "pending")
          );
        const r = Object.keys(a.perPromptEndFrames).length;
        if (r < n)
          return (
            Gn({
              icon: "⚠️",
              title: "Some Prompts Missing End Frames",
              message: `Only <strong>${r}</strong> of <strong>${n}</strong> prompts have an end frame assigned. The unmapped prompts will fail.`,
              hint: 'Open "Different for Each" to assign the missing end frames, or switch to a shared end frame for all prompts.',
            }),
            Te(
              `⚠️ ${n - r} prompts have no end frame — generation blocked`,
              "error",
            ),
            void gn(t.id, "pending")
          );
      }
      if (
        "start_end_frame" === e &&
        !a.endFrameMediaId &&
        "mapped" !== a.referenceMode
      )
        return (
          Gn({
            icon: "🖼️",
            title: "End Frame Required",
            message:
              "<strong>Start + End Frame</strong> mode requires an end frame image, but none is attached.",
            hint: 'Click "Choose End Frame" to select an image from your library, or use "Different for Each" to assign per-prompt end frames.',
          }),
          Te("❌ No end frame attached — generation blocked", "error"),
          void gn(t.id, "pending")
        );
      if (
        !(
          "reference" !== e ||
          (a.referenceMediaIds && 0 !== a.referenceMediaIds.length) ||
          r
        )
      )
        return (
          Gn({
            icon: "🎨",
            title: "Reference Images Required",
            message:
              "<strong>Reference</strong> mode requires at least one reference image to guide the video style, but none are attached.",
            hint: '<strong>Option 1:</strong> Click "Add Shared Refs" to pick images for all prompts.<br><br><strong>Option 2:</strong> Click "Different for Each" to assign unique references per prompt.',
          }),
          Te("❌ No reference images attached — generation blocked", "error"),
          void gn(t.id, "pending")
        );
      if (
        "reference" === e &&
        r &&
        (!a.referenceMediaIds || 0 === a.referenceMediaIds.length)
      ) {
        const e = Object.keys(a.perPromptReferences).filter(
            (e) => a.perPromptReferences[e].length > 0,
          ).length,
          n = t.prompts.filter((e) => "pending" === e.status).length;
        if (e < n)
          return (
            Gn({
              icon: "⚠️",
              title: "Some Prompts Missing References",
              message: `Only <strong>${e}</strong> of <strong>${n}</strong> prompts have reference images assigned. The unmapped prompts will fail.`,
              hint: 'Open "Different for Each" to assign the missing references.',
            }),
            Te(
              `⚠️ ${n - e} prompts have no references — generation blocked`,
              "error",
            ),
            void gn(t.id, "pending")
          );
      }
    }
    if ("mapped" === a.referenceMode) {
      let e = 0;
      if (a.perPromptReferences)
        for (const t of Object.keys(a.perPromptReferences)) {
          const n = a.perPromptReferences[t],
            r = n.filter((e) => {
              const t = y.some((t) => t.mediaId === e && !t.uploading),
                a = K.some((t) => t.mediaId === e),
                n = u.has(e);
              return t || a || n;
            });
          r.length !== n.length &&
            ((a.perPromptReferences[t] = r), (e += n.length - r.length));
        }
      if (a.perPromptStartFrames)
        for (const t of Object.keys(a.perPromptStartFrames)) {
          const n = a.perPromptStartFrames[t],
            r = y.some((e) => e.mediaId === n && !e.uploading),
            o = K.some((e) => e.mediaId === n),
            s = u.has(n);
          r || o || s || (delete a.perPromptStartFrames[t], e++);
        }
      if (a.perPromptEndFrames)
        for (const t of Object.keys(a.perPromptEndFrames)) {
          const n = a.perPromptEndFrames[t],
            r = y.some((e) => e.mediaId === n && !e.uploading),
            o = K.some((e) => e.mediaId === n),
            s = u.has(n);
          r || o || s || (delete a.perPromptEndFrames[t], e++);
        }
      e > 0 && Te(`⚠️ Removed ${e} reference(s) that no longer exist`, "warn");
    }
    ((l.activeBatchId = t.id), (l.batchStartTime = Date.now()), zn(!0));
    const n = t.prompts
        .map((e, t) => ({ text: e.text, status: e.status, originalIndex: t }))
        .filter((e) => "pending" === e.status),
      o = n.map((e) => e.text),
      s = n.map((e) => e.originalIndex),
      d = {
        type: "START_BATCH",
        batchId: t.id,
        prompts: o,
        promptIndexMap: s,
        settings: {
          mode: a.mode,
          folder: t.folder,
          imageModel: a.imageModel,
          aspectRatio: a.imageRatio,
          imageCount: a.imageCount,
          videoQuality: a.videoQuality,
          videoRatio: a.videoRatio,
          videoMode: a.videoMode,
          videoCount: a.videoCount || 1,
          videoDuration: a.videoDuration || 8,
          startFrameMediaId: a.startFrameMediaId,
          endFrameMediaId: a.endFrameMediaId,
          referenceMediaIds: a.referenceMediaIds,
          imageReferenceMediaIds: a.imageReferenceMediaIds || [],
          autoDownloadImages: r("#setting-autodownload-images").checked,
          autoDownloadVideos: r("#setting-autodownload-videos").checked,
          imageDownloadQuality: l.settings.imageDownloadQuality || "2k",
          videoDownloadQuality: l.settings.videoDownloadQuality || "standard",
          naming: a.naming || l.settings.naming || "numbered",
          namingPrefix: a.namingPrefix || l.settings.namingPrefix || "",
          namingSeparator:
            void 0 !== a.namingSeparator
              ? a.namingSeparator
              : void 0 !== l.settings.namingSeparator
                ? l.settings.namingSeparator
                : "-",
          startNumber: a.startNumber || l.settings.startNumber || 1,
          perPromptReferences: a.perPromptReferences || null,
          perPromptStartFrames: a.perPromptStartFrames || null,
          perPromptEndFrames: a.perPromptEndFrames || null,
          referenceMode: a.referenceMode || "shared",
          singlePromptBatch: !0 === a.singlePromptBatch,
          speedMode: l.speedMode || "fast",
        },
        featureFlags: de(),
        uploadsThisSession: q,
      };
    (Te(
      `📨 Starting batch "${t.name}": mode=${a.mode}, prompts=${o.length}`,
      "info",
    ),
      qa(
        o,
        {
          mode: a.mode,
          imageCount: a.imageCount,
          videoCount: a.videoCount || 1,
          aspectRatio: a.imageRatio,
          videoRatio: a.videoRatio,
        },
        s,
        { batchId: t.id, batchName: t.name },
      ));
    try {
      const e = await chrome.runtime.sendMessage(d);
      Te(`Background responded: ${JSON.stringify(e)}`, "info", "debug");
    } catch (e) {
      return (
        Te(`❌ Failed to send to background: ${e.message}`, "error"),
        gn(t.id, "failed"),
        zn(!1),
        void (l.activeBatchId = null)
      );
    }
    (Te(`🚀 Batch "${t.name}" started!`, "success"),
      "mapped" === l.referenceMode &&
        ((l.referenceMode = "shared"),
        (l.promptReferenceMap = {}),
        (l.promptStartFrameMap = {}),
        (l.promptEndFrameMap = {}),
        (K = []),
        J(),
        re(),
        Ia(),
        ka(),
        Ea()),
      (p = !0),
      (l._emptyPollCount = 0),
      Yn());
  }),
  Dn.addEventListener("click", async () => {
    if (
      (await chrome.runtime.sendMessage({ type: "STOP_BATCH" }),
      (p = !1),
      l.activeBatchId)
    ) {
      const e = pn(l.activeBatchId);
      if (e) {
        e.prompts.forEach((e) => {
          ("running" !== e.status && "pending" !== e.status) ||
            (e.status = "failed");
        });
        const t = e.prompts.some(
          (e) => "done" === e.status || "submitted" === e.status,
        );
        gn(l.activeBatchId, t ? "partial" : "failed");
      }
      l.activeBatchId = null;
    }
    (m && (clearInterval(m), (m = null)),
      (l.stats = { total: 0, downloaded: 0, failed: 0 }));
    for (const [e, t] of u)
      ("generating" !== t.status && "downloading" !== t.status) ||
        ((t.status = "failed"), t.isPlaceholder && (t.isPlaceholder = !1));
    ("function" == typeof Ba && Ba(),
      "function" == typeof ee && ee(),
      zn(!1),
      Oa(),
      De("Stopped", "badge badge-disconnected", 5e3),
      Te("⏹ Stopped", "warn"));
  }));
const Kn = r("#single-prompt-toggle"),
  Jn = r("#single-prompt-toggle-wrapper");
function Xn() {
  return "video" === l.mode && "start_frame" === l.settings.videoMode;
}
function Zn() {
  return Dn.disabled
    ? Xn()
      ? { allowed: !0 }
      : { allowed: !1, reason: "Only available in Video mode with Start Frame" }
    : { allowed: !1, reason: "Cannot change while generating" };
}
function er() {
  if (!Xn())
    return (
      (Jn.style.display = "none"),
      void (
        l.singlePromptMode &&
        ((l.singlePromptMode = !1), (Kn.checked = !1), tr(), J())
      )
    );
  Jn.style.display = "inline-flex";
  const e = Zn();
  e.allowed || l.singlePromptMode
    ? (Jn.classList.remove("disabled"),
      (Kn.disabled = !1),
      (Jn.title = "Use one prompt for many start frames"))
    : (Jn.classList.add("disabled"), (Kn.disabled = !0), (Jn.title = e.reason));
}
function tr() {
  const e = r("#prompt-input"),
    t = r("#prompt-hint"),
    a = r("#btn-open-mapper-video");
  if (l.singlePromptMode) {
    (e.classList.add("single-prompt-locked"),
      e.setAttribute("rows", "3"),
      (e.placeholder =
        "Describe the motion or action for all your start frames..."),
      t &&
        (t.innerHTML =
          '<span class="single-prompt-active-hint"><span class="material-symbols-outlined">link</span>applies to all start frames</span>'));
    const n = e.value.split("\n").filter((e) => e.trim());
    if (((e.value = n[0] || ""), Hn(), a)) {
      a.innerHTML =
        '<span class="material-symbols-outlined">photo_library</span> Assign Start Frames';
      const e = a.nextElementSibling;
      e &&
        e.classList.contains("hint") &&
        (e.textContent = "Pick the start frames for your videos");
    }
  } else if (
    (e.classList.remove("single-prompt-locked"),
    e.setAttribute("rows", "6"),
    (e.placeholder =
      "What do you want to create?\n\nEnter each prompt on a new line..."),
    t && (t.textContent = "(one per line)"),
    a)
  ) {
    a.innerHTML =
      '<span class="material-symbols-outlined">account_tree</span> Different for Each';
    const e = a.nextElementSibling;
    e &&
      e.classList.contains("hint") &&
      (e.textContent = "Assign a unique start frame to each prompt");
  }
  const n = r("#start-frame-area");
  n && (n.style.display = l.singlePromptMode ? "none" : "");
  const o = r("#start-frame-section .hint");
  o && (o.style.display = l.singlePromptMode ? "none" : "");
}
(Kn?.addEventListener("change", async (e) => {
  if (!e.target.checked)
    return (
      (l.singlePromptMode = !1),
      tr(),
      J(),
      void (
        "function" == typeof le && le("single_prompt_toggled", { enabled: !1 })
      )
    );
  const t = r("#prompt-input")
    .value.split("\n")
    .filter((e) => e.trim());
  t.length > 1 &&
  !(await an({
    icon: "⚠️",
    title: "Switch to Single Prompt Mode?",
    message: `This will keep only your first prompt and discard ${t.length - 1} other${t.length > 2 ? "s" : ""}.`,
    confirmText: "Continue",
    confirmClass: "btn-flow-primary",
  }))
    ? (e.target.checked = !1)
    : ((l.singlePromptMode = !0),
      tr(),
      J(),
      "function" == typeof le && le("single_prompt_toggled", { enabled: !0 }));
}),
  r("#prompt-input").addEventListener("input", (e) => {
    if (l.singlePromptMode && e.target.value.includes("\n")) {
      const t = e.target.selectionStart;
      ((e.target.value = e.target.value.replace(/\n/g, " ")),
        e.target.setSelectionRange(t, t));
    }
  }),
  r("#prompt-input").addEventListener("paste", (e) => {
    if (!l.singlePromptMode) return;
    e.preventDefault();
    const t = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\s+/g, " ")
      .trim();
    document.execCommand("insertText", !1, t);
  }));
const ar = r("#speed-pill-group");
function nr() {
  if (l.activeBatchId) return !0;
  if (l.batches.some((e) => "running" === e.status)) return !0;
  const e = l.stats || {};
  if (e.total > 0 && e.downloaded + e.failed < e.total) return !0;
  for (const [e, t] of u)
    if ("generating" === t.status || "downloading" === t.status) return !0;
  return !1;
}
function rr() {
  if (!ar) return;
  const e = nr();
  ar.querySelectorAll("[data-speed]").forEach((t) => {
    e
      ? (t.classList.add("locked"), (t.disabled = !0))
      : (t.classList.remove("locked"), (t.disabled = !1));
  });
}
function or() {
  const e = r("#speed-mode-badge"),
    t = r("#speed-mode-badge-icon"),
    a = r("#speed-mode-badge-text");
  e &&
    t &&
    a &&
    (e.classList.remove("speed-fast", "speed-balanced", "speed-slow"),
    (e.style.display = "inline-flex"),
    "fast" === l.speedMode
      ? (e.classList.add("speed-fast"),
        (e.title = "Fast Mode — full speed, max concurrency"),
        (t.textContent = "bolt"),
        (a.textContent = "Fast"))
      : "balanced" === l.speedMode
        ? (e.classList.add("speed-balanced"),
          (e.title =
            "Balanced Mode — moderate concurrency for fewer rate limits"),
          (t.textContent = "balance"),
          (a.textContent = "Balanced"))
        : "slow" === l.speedMode &&
          (e.classList.add("speed-slow"),
          (e.title = "Slow Mode — running 1 generation at a time"),
          (t.textContent = "hourglass_top"),
          (a.textContent = "Slow")));
}
function sr() {
  ar &&
    ar.querySelectorAll("[data-speed]").forEach((e) => {
      e.classList.toggle("active", e.dataset.speed === l.speedMode);
    });
}
async function ir() {
  try {
    if (
      !(await chrome.storage.local.get("turboflowSpeedNewSeen"))
        .turboflowSpeedNewSeen
    ) {
      const e = r("#speed-new-badge"),
        t = r("#speed-section");
      (e && (e.style.display = "inline-flex"),
        t && t.classList.add("has-new-badge"));
    }
  } catch (e) {}
}
async function lr() {
  try {
    if (
      (await chrome.storage.local.get("turboflowSpeedNewSeen"))
        .turboflowSpeedNewSeen
    )
      return;
    await chrome.storage.local.set({ turboflowSpeedNewSeen: !0 });
    const e = r("#speed-new-badge"),
      t = r("#speed-section");
    (e && (e.style.display = "none"), t && t.classList.remove("has-new-badge"));
  } catch (e) {}
}
async function dr() {
  try {
    if (
      !(await chrome.storage.local.get("turboflowDurationNewSeen"))
        .turboflowDurationNewSeen
    ) {
      const e = r("#duration-new-badge"),
        t = r("#duration-section");
      (e && (e.style.display = "inline-flex"),
        t && t.classList.add("has-new-badge"));
    }
  } catch (e) {}
}
async function cr() {
  try {
    if (
      (await chrome.storage.local.get("turboflowDurationNewSeen"))
        .turboflowDurationNewSeen
    )
      return;
    await chrome.storage.local.set({ turboflowDurationNewSeen: !0 });
    const e = r("#duration-new-badge"),
      t = r("#duration-section");
    (e && (e.style.display = "none"), t && t.classList.remove("has-new-badge"));
  } catch (e) {}
}
(ar?.querySelectorAll("[data-speed]").forEach((e) => {
  e.addEventListener("click", () => {
    if (nr()) return void Te("⚠️ Cannot change speed while generating", "warn");
    const t = e.dataset.speed;
    t !== l.speedMode &&
      ((l.speedMode = t),
      J(),
      sr(),
      or(),
      lr(),
      Te(
        {
          fast: "⚡ Fast Mode — full speed",
          balanced: "⚖️ Balanced Mode — moderate concurrency",
          slow: "🐢 Slow Mode — one at a time",
        }[t] || t,
        "info",
      ));
  });
}),
  ir(),
  dr(),
  setTimeout(() => {
    (sr(), rr(), or());
  }, 100),
  chrome.runtime.onMessage.addListener((e) => {
    if (
      ("CONNECTION_STATE" === e.type && Ne(e.state),
      "AUTH_STATE_CHANGED" === e.type &&
        (e.user ? ((s = e.user), (i = e.plan), We()) : Qe()),
      "PLAN_UPDATE" === e.type)
    ) {
      if (((i = e.plan), e.plan?.banned)) return void Xe(e.plan.bannedReason);
      "block" === r("#plan-activating").style.display || (Ve(), Ye(), Ue());
    }
    if ("PRO_ACTIVATED" === e.type) {
      ((i = e.plan),
        (r("#plan-activating").style.display = "none"),
        Ve(),
        Ye(),
        Ue());
      const t = r("#plan-banner");
      (t.classList.add("celebrating"),
        setTimeout(() => t.classList.remove("celebrating"), 5e3),
        le("local_account_removed", {
          time_to_convert_ms: Ke ? Date.now() - Ke : null,
          was_trial: i?.trial || !1,
        }),
        (Ke = null));
    }
    if (
      ("ACTIVATION_TIMEOUT" === e.type &&
        ((r("#plan-activating").style.display = "none"),
        (r("#plan-free").style.display = "block"),
        Ve()),
      "ACTIVATION_CANCELLED" === e.type &&
        ((r("#plan-activating").style.display = "none"),
        (r("#plan-free").style.display = "block"),
        Ve(),
        Ye(),
        le("local_account_removed", {
          time_on_removed_account_page_ms: Ke ? Date.now() - Ke : null,
          reason: e.reason || "tab_closed",
        }),
        (Ke = null)),
      "FROM_BACKGROUND" === e.type)
    ) {
      if (
        ("LOG" === e.subType &&
          Te(e.message, e.logType || "info", e.logLevel || "user"),
        "SHOW_FIX_UNUSUAL" === e.subType)
      ) {
        const e = document.getElementById("fix-unusual-modal");
        e &&
          "flex" !== e.style.display &&
          ((e.style.display = "flex"),
          "function" == typeof le &&
            le("fix_unusual_modal_opened", {
              trigger: "auto_recovery_failed",
            }));
      }
      if ("BATCH_GENERATION_DONE" === e.subType) {
        const {
          totalPrompts: t,
          successfulPrompts: a,
          failedPrompts: n,
          totalImages: r,
        } = e;
        if (!l.activeBatchId) return;
        if (
          (Oa(),
          Te(
            `📊 Generation complete: ${a}/${t} prompts succeeded, ${r} images queued`,
            n > 0 ? "warn" : "success",
          ),
          0 === r)
        ) {
          if (
            (Te("❌ No images generated — batch failed", "error"),
            l.activeBatchId)
          ) {
            const e = pn(l.activeBatchId);
            (e &&
              (e.prompts.forEach((e) => {
                ("pending" !== e.status && "running" !== e.status) ||
                  (e.status = "failed");
              }),
              gn(l.activeBatchId, "failed"),
              Te(`↩️ Batch "${e.name}" marked as failed`, "error")),
              (l.activeBatchId = null));
          }
          (m && (clearInterval(m), (m = null)),
            zn(!1),
            De("Failed", "badge badge-disconnected", 5e3),
            Ba(),
            ze());
        }
      }
      if (
        ("IMAGE_READY" === e.subType &&
          (Te(e.message, "success"), e.stats && (l.stats = e.stats)),
        "PREVIEW_READY" === e.subType)
      ) {
        const t = l.activeBatchId ? pn(l.activeBatchId) : null;
        Da({
          mediaId: e.mediaId,
          fifeUrl: e.fifeUrl,
          promptIndex: e.promptIndex,
          prompt: e.prompt,
          type: e.mediaType || "image",
          videoUrl: e.videoUrl || null,
          workflowId: e.workflowId || null,
          batchId: t?.id || null,
          batchName: t?.name || null,
        });
      }
      if (
        ("DOWNLOAD_COMPLETE" === e.subType &&
          (Te(e.message, "success"),
          e.stats && (l.stats = e.stats),
          e.mediaId && Na(e.mediaId, "done")),
        "DOWNLOAD_STARTED" === e.subType &&
          e.mediaId &&
          Na(e.mediaId, "downloading"),
        "DOWNLOAD_FAILED" === e.subType && e.mediaId && Na(e.mediaId, "failed"),
        "STATS_UPDATE" === e.subType &&
          e.stats &&
          ((l.stats = e.stats),
          l.activeBatchId && hn(l.activeBatchId, e.stats),
          "function" == typeof Ya && Ya(),
          "function" == typeof Fa && Fa()),
        "PROMPT_STATUS" === e.subType)
      ) {
        const t = l.queue[e.promptIndex];
        (t && (t.status = e.status),
          l.activeBatchId && fn(l.activeBatchId, e.promptIndex, e.status));
      }
      if ("BANNED" === e.subType) return (Xe(e.message), zn(!1), void Oa());
      if ("LIMIT_REACHED" === e.subType) {
        if (
          (Te(`🚫 ${e.message || "Daily limit reached."}`, "error"),
          le("limit_reached", {
            remaining: e.remaining,
            plan: i?.plan || "free",
          }),
          void 0 !== e.remaining &&
            Te(`📊 ${e.remaining} prompts remaining today.`, "warn"),
          (r("#limit-message").textContent =
            e.message ||
            "Daily limit reached. Reduce the batch size for unlimited."),
          (r("#limit-modal").style.display = "flex"),
          l.activeBatchId)
        ) {
          const e = pn(l.activeBatchId);
          (e &&
            (e.prompts.forEach((e) => {
              ("running" !== e.status && "submitted" !== e.status) ||
                (e.status = "pending");
            }),
            gn(l.activeBatchId, "pending")),
            (l.activeBatchId = null));
        }
        (m && (clearInterval(m), (m = null)),
          zn(!1),
          De("Limit Reached", "badge badge-disconnected", 5e3),
          Oa(),
          ze());
      }
      if ("STALE_REFERENCES" === e.subType) {
        if (
          (zn(!1),
          De("Stale References", "badge badge-disconnected", 8e3),
          Te(`🔄 ${e.message}`, "warn"),
          l.activeBatchId)
        ) {
          const e = pn(l.activeBatchId);
          if (e) {
            e.prompts.forEach((e) => {
              ("pending" !== e.status && "running" !== e.status) ||
                (e.status = "failed");
            });
            const t = e.prompts.some(
              (e) => "done" === e.status || "submitted" === e.status,
            );
            gn(l.activeBatchId, t ? "partial" : "failed");
          }
          l.activeBatchId = null;
        }
        (m && (clearInterval(m), (m = null)), Oa());
        const t = r("#stale-refs-modal");
        t &&
          "flex" !== t.style.display &&
          ((t.style.display = "flex"),
          "function" == typeof le && le("stale_references_modal_opened", {}));
      }
      if ("QUOTA_EXHAUSTED" === e.subType) {
        if (
          (zn(!1),
          De("Quota Reached", "badge badge-disconnected", 8e3),
          Te(`🚫 ${e.message}`, "error"),
          l.activeBatchId)
        ) {
          const e = pn(l.activeBatchId);
          if (e) {
            e.prompts.forEach((e) => {
              ("pending" !== e.status && "running" !== e.status) ||
                (e.status = "failed");
            });
            const t = e.prompts.some(
              (e) => "done" === e.status || "submitted" === e.status,
            );
            gn(l.activeBatchId, t ? "partial" : "failed");
          }
          l.activeBatchId = null;
        }
        (l.queue.forEach((e) => {
          ("pending" !== e.status &&
            "running" !== e.status &&
            "submitted" !== e.status) ||
            (e.status = "failed");
        }),
          Gn({
            icon: "🚫",
            title: "Google Google Limit Reached",
            message:
              "Your <strong>Google account's</strong> daily generation limit has been reached. This is a limit set by Google, not TurboFlow.",
            hint: "You can:<br><br>\n           <strong>1.</strong> Try using a different model<br>\n           <strong>2.</strong> Upgrade your Google Flow account<br>\n           <strong>3.</strong> Wait a few hours and try again",
          }),
          ze(),
          Oa());
      }
      if ("STALE_REFERENCES" === e.subType) {
        if (
          (zn(!1),
          De("Stale References", "badge badge-disconnected", 8e3),
          Te(`🔄 ${e.message}`, "warn"),
          l.activeBatchId)
        ) {
          const e = pn(l.activeBatchId);
          if (e) {
            e.prompts.forEach((e) => {
              ("pending" !== e.status && "running" !== e.status) ||
                (e.status = "failed");
            });
            const t = e.prompts.some(
              (e) => "done" === e.status || "submitted" === e.status,
            );
            gn(l.activeBatchId, t ? "partial" : "failed");
          }
          l.activeBatchId = null;
        }
        (m && (clearInterval(m), (m = null)), Oa());
        const t = r("#validation-modal");
        t &&
          "flex" !== t.style.display &&
          Gn({
            icon: "🔄",
            title: "Reference Images Are Outdated",
            message:
              "Some of your reference images are from a previous Flow project and no longer work.",
            hint: "<strong>1.</strong> Re-upload the reference images in your Library<br>\n                           <strong>2.</strong> Re-attach them to your prompts<br>\n                           <strong>3.</strong> Try generating again<br><br>\n                           <em>Tip: This happens when switching Flow projects. References are tied to the project they were uploaded to.</em>",
          });
      }
      if ("SERVER_DOWN" === e.subType) {
        if (
          (Te(`⚠️ ${e.message || "Could not reach server."}`, "error"),
          Te("💡 Check your internet connection and try again.", "warn"),
          l.activeBatchId)
        ) {
          const e = pn(l.activeBatchId);
          (e &&
            (e.prompts.forEach((e) => {
              ("running" !== e.status && "submitted" !== e.status) ||
                (e.status = "pending");
            }),
            gn(l.activeBatchId, "pending")),
            (l.activeBatchId = null));
        }
        (m && (clearInterval(m), (m = null)), zn(!1), Oa());
      }
    }
  }),
  Se(),
  He(),
  Z(),
  ne(),
  te(),
  oe(),
  Hn(),
  Te("TurboFlow v" + xe() + " ready 🚀", "info"));
try {
  const e = me();
  chrome.runtime
    .sendMessage({ type: "SET_FINGERPRINT", fingerprint: e })
    .catch(() => {});
} catch (e) {}
function pr(e = 0) {
  s?.token ? ke() : e < 3 ? setTimeout(() => pr(e + 1), 2e3) : ke();
}
async function mr() {
  try {
    const e = await chrome.runtime.sendMessage({ type: "GET_FULL_STATE" });
    if (!e) return;
    let t = l.batches.find((e) => "running" === e.status);
    if (
      (t ||
        (t = [...l.batches]
          .filter(
            (e) =>
              e.startedAt && ("pending" === e.status || "partial" === e.status),
          )
          .sort((e, t) => (t.startedAt || 0) - (e.startedAt || 0))[0]),
      !t && 0 === e.items.length)
    )
      return;
    let a = 0,
      n = 0;
    if (t)
      for (const r of e.items) {
        if (u.has(r.mediaId)) continue;
        let o = null;
        for (const [e, a] of u)
          if (
            a.isPlaceholder &&
            a.batchId === t.id &&
            a.originalIndex === r.promptIndex
          ) {
            o = e;
            break;
          }
        if (o) {
          const a = u.get(o),
            s = a.promptIndex,
            i = a.suffix,
            l = a.isPortrait,
            d = a.refThumbs || [];
          u.delete(o);
          let c = r.fifeUrl;
          ("video" !== r.type &&
            (c = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${r.mediaId}`),
            u.set(r.mediaId, {
              mediaId: r.mediaId,
              promptIndex: s,
              prompt: r.prompt || "",
              fifeUrl: c,
              videoUrl: r.videoUrl || null,
              status: e.running ? "ready" : "done",
              type: r.type || "image",
              isPlaceholder: !1,
              suffix: i || r.suffix || "",
              isPortrait: l,
              originalIndex: r.promptIndex,
              workflowId: r.workflowId || null,
              refThumbs: d,
              batchId: t.id,
              batchName: t.name,
            }),
            n++);
        } else {
          let n = -1;
          for (const [e, t] of u) t.promptIndex > n && (n = t.promptIndex);
          const o = n + 1;
          let s = r.fifeUrl;
          ("video" !== r.type &&
            (s = `https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=${r.mediaId}`),
            u.set(r.mediaId, {
              mediaId: r.mediaId,
              promptIndex: o,
              prompt: r.prompt || "",
              fifeUrl: s,
              videoUrl: r.videoUrl || null,
              status: e.running ? "ready" : "done",
              type: r.type || "image",
              isPlaceholder: !1,
              suffix: r.suffix || "",
              isPortrait: !1,
              originalIndex: r.promptIndex,
              workflowId: r.workflowId || null,
              refThumbs: [],
              batchId: t.id,
              batchName: t.name,
            }),
            a++);
        }
      }
    if (!e.running) {
      let e = 0;
      for (const [t, a] of u)
        a.isPlaceholder &&
          "generating" === a.status &&
          ((a.status = "failed"), (a.isPlaceholder = !1), e++);
      e > 0 &&
        Te(
          `🧹 Cleaned ${e} stale placeholder${e > 1 ? "s" : ""} from previous session`,
          "info",
        );
    }
    let r = -1;
    for (const [e, t] of u) t.promptIndex > r && (r = t.promptIndex);
    if (((h = r + 1), t)) {
      const r = new Set();
      for (const t of e.items) r.add(t.promptIndex);
      let o = 0;
      if (
        (t.prompts.forEach((e, t) => {
          ("running" !== e.status && "pending" !== e.status) ||
            !r.has(t) ||
            ((e.status = "submitted"), o++);
        }),
        e.running ||
          t.prompts.forEach((e) => {
            ("running" !== e.status && "pending" !== e.status) ||
              ((e.status = "failed"), o++);
          }),
        o > 0 && X(),
        e.running)
      )
        ((l.activeBatchId = t.id),
          (l.stats = e.stats),
          gn(t.id, "running"),
          zn(!0),
          Yn(),
          Te(
            `🔄 Reconnected to running batch "${t.name}" — ${e.stats.downloaded}/${e.stats.total}`,
            "success",
          ));
      else if (
        "running" === t.status ||
        ("pending" === t.status && t.startedAt)
      ) {
        const e = t.prompts.filter((e) => "failed" === e.status).length,
          r = t.prompts.filter(
            (e) => "done" === e.status || "submitted" === e.status,
          ).length;
        let o;
        ((o =
          0 === r && e > 0
            ? "failed"
            : e > 0
              ? "partial"
              : r > 0 || a + n > 0
                ? "done"
                : "failed"),
          gn(t.id, o),
          (t.collapsed = !0),
          X(),
          Sn());
      } else Sn();
    }
    const o = a + n;
    o > 0 &&
      (Ba(),
      ee(),
      Te(
        n > 0
          ? `✅ Recovered ${o} item${o > 1 ? "s" : ""} (${n} matched, ${a} new)`
          : `✅ Recovered ${o} item${o > 1 ? "s" : ""} generated while panel was closed`,
        "success",
      ));
  } catch (e) {}
}
(setTimeout(() => {
  le("session_start", { plan: i?.plan || "free" });
}, 4e3),
  setTimeout(() => pr(), 5e3),
  setTimeout(mr, 800));
