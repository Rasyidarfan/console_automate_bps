#!/usr/bin/env node
/**
 * Change FASIH-SM assignment mode → CAPI for rows still not CAPI.
 * Source: datatable-all-user-survey-periode (live).
 *
 * Browser (recommended):
 *   1. Login + buka halaman survey:
 *      .../app/surveys/{surveyId}/{periodId}/data?...
 *   2. Paste file ini di Console
 *   3. await run({ dryRun: true, chooseRegion: true, filterStatus: "OPEN" })
 *   4. await run({ dryRun: false, chooseRegion: "9705010", filterStatus: "OPEN" })
 *
 * Picker wilayah (chooseRegion):
 *   - true → cascade interaktif level1–6
 *   - string kode (mis. "9705010") → resolve otomatis ke region1Id..regionNId
 *   - Interaktif: nomor, 0=SEMUA, atau ketik kode wilayah
 *   - Filter: region1Id, region2Id, ... sesuai path
 *
 * Status: filterStatus / assignmentStatusAlias (default "OPEN"). null = tanpa filter status.
 *
 * Node:
 *   FASIH_COOKIE=... FASIH_XSRF=... FASIH_SURVEY_ID=... FASIH_SURVEY_PERIOD_ID=...
 *   FASIH_REGION1_ID=... FASIH_REGION2_ID=... FASIH_FILTER_STATUS=OPEN
 *   node fasih-change-mode-capi.js --dry-run|--run
 *
 * Delay antar change-mode: random 2–5s.
 */

const DATATABLE_URL =
  "https://fasih-sm.bps.go.id/app/api/analytic/api/v2/assignment/datatable-all-user-survey-periode";
const CHANGE_BASE =
  "https://fasih-sm.bps.go.id/app/api/assignment-submit/api/assignment";
const REGION_BASE =
  "https://fasih-sm.bps.go.id/app/api/region/api/v1/region";
const DEFAULT_REGION_GROUP_ID = "a45adac1-e711-4c15-b3f9-1f30fc151565";

const UUID_RE =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
const SURVEY_PATH_RE = new RegExp(
  `/app/surveys/(${UUID_RE})/(${UUID_RE})`
);

const COLUMN_KEYS = [
  "id",
  "codeIdentity",
  "data1",
  "data2",
  "data3",
  "data4",
  "data5",
  "data6",
  "data7",
  "data8",
  "data9",
  "data10",
  "mode",
];

const LEVEL_LABEL = {
  1: "Provinsi (level1)",
  2: "Kabupaten/Kota (level2)",
  3: "Kecamatan (level3)",
  4: "Desa/Kelurahan (level4)",
  5: "SLS/level5",
  6: "level6",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function randDelay(minMs = 2000, maxMs = 5000) {
  const lo = Math.min(minMs, maxMs);
  const hi = Math.max(minMs, maxMs);
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function cookieVal(name) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

function parseSurveyUrl(url) {
  const href = url || (typeof location !== "undefined" ? location.href : "");
  const m = String(href).match(SURVEY_PATH_RE);
  if (!m) return null;
  return { surveyId: m[1], surveyPeriodId: m[2] };
}

function envGet(key) {
  return (
    (typeof process !== "undefined" &&
      process.env &&
      process.env[key]) ||
    ""
  );
}

/** Kumpulkan region1Id..region6Id dari opts / env. */
function collectRegionFilters(opts = {}) {
  const out = { ...(opts.regionFilters || {}) };
  for (let n = 1; n <= 6; n++) {
    const key = `region${n}Id`;
    const fromOpt = opts[key];
    const fromEnv = envGet(`FASIH_REGION${n}_ID`);
    if (fromOpt != null && fromOpt !== "") out[key] = fromOpt;
    else if (fromEnv) out[key] = fromEnv;
  }
  return out;
}

/** Dari hasil picker: path → { region1Id, region2Id, ... }. */
function regionFiltersFromPick(regionPick) {
  const out = {};
  if (!regionPick || !regionPick.path) return out;
  for (const p of regionPick.path) {
    if (p.id) out[`region${p.level}Id`] = p.id;
  }
  return out;
}

function resolveContext(opts = {}) {
  const fromUrl = parseSurveyUrl(opts.url);
  const surveyId =
    opts.surveyId || envGet("FASIH_SURVEY_ID") || (fromUrl && fromUrl.surveyId) || "";
  const surveyPeriodId =
    opts.surveyPeriodId ||
    envGet("FASIH_SURVEY_PERIOD_ID") ||
    (fromUrl && fromUrl.surveyPeriodId) ||
    "";
  if (!surveyId || !surveyPeriodId) {
    throw new Error(
      "Missing surveyId/surveyPeriodId. Buka halaman .../app/surveys/{id}/{period}/data " +
        "atau pass surveyId & surveyPeriodId"
    );
  }
  const groupId =
    opts.groupId || envGet("FASIH_REGION_GROUP_ID") || DEFAULT_REGION_GROUP_ID;

  // filterStatus: default OPEN; null/false = jangan kirim assignmentStatusAlias
  let filterStatus;
  if (
    Object.prototype.hasOwnProperty.call(opts, "filterStatus") &&
    opts.filterStatus !== undefined
  ) {
    filterStatus = opts.filterStatus;
  } else if (envGet("FASIH_FILTER_STATUS") !== "") {
    filterStatus = envGet("FASIH_FILTER_STATUS");
  } else {
    filterStatus = "OPEN";
  }

  return {
    surveyId,
    surveyPeriodId,
    groupId,
    regionFilters: collectRegionFilters(opts),
    filterStatus,
  };
}

function isBotOrHtml(ct, text) {
  const t = (text || "").slice(0, 800).toLowerCase();
  const c = (ct || "").toLowerCase();
  if (c.includes("text/html")) return true;
  if (t.includes("bot detected") || t.includes("cf-browser-verification"))
    return true;
  return false;
}

function modeList(row) {
  let raw =
    row.mode ??
    row.modes ??
    row.assignmentMode ??
    row.assignmentModes ??
    null;
  if (raw == null) return [];
  if (typeof raw === "string") {
    const s = raw.trim();
    if (s.startsWith("[")) {
      try {
        raw = JSON.parse(s);
      } catch {
        return [s];
      }
    } else {
      return s ? [s] : [];
    }
  }
  if (!Array.isArray(raw)) return [String(raw)];
  return raw.map(String);
}

function isAlreadyCapi(modes) {
  const m = modes.map((x) => x.toUpperCase());
  return m.includes("CAPI") && !m.includes("PAPI");
}

function needsCapi(modes) {
  return !isAlreadyCapi(modes);
}

function authHeaders({ cookie, xsrf }) {
  const headers = {
    accept: "*/*",
    "content-type": "application/json",
    "x-xsrf-token": xsrf,
  };
  if (cookie) headers.cookie = cookie;
  return headers;
}

async function fetchJson(url, { method, body, cookie, xsrf }) {
  const res = await fetch(url, {
    method,
    headers: authHeaders({ cookie, xsrf }),
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: cookie ? "omit" : "include",
  });
  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  if (isBotOrHtml(ct, text)) {
    throw new Error(
      `Bot/HTML response — STOP. status=${res.status} body=${text.slice(0, 200)}`
    );
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  if (!text) return { status: res.status, json: null, text: "" };
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
  }
  return { status: res.status, json, text };
}

function datatableBody(start, length, ctx, extra = {}) {
  const assignmentExtraParam = {
    surveyPeriodId: ctx.surveyPeriodId,
    assignmentErrorStatusType: -1,
    filterTargetType: "TARGET_ONLY",
    ...(ctx.regionFilters || {}),
    ...extra,
  };
  if (ctx.filterStatus != null && ctx.filterStatus !== false && ctx.filterStatus !== "") {
    assignmentExtraParam.assignmentStatusAlias = ctx.filterStatus;
  }
  return {
    start,
    length,
    columns: COLUMN_KEYS.map((data) => ({ data, orderable: true })),
    order: [],
    search: { value: "", regex: false },
    assignmentExtraParam,
  };
}

function extractRows(json) {
  if (json == null) return { rows: [], total: 0, path: "null" };
  if (Array.isArray(json)) {
    return { rows: json, total: json.length, path: "root[]" };
  }
  if (Array.isArray(json.searchData)) {
    return {
      rows: json.searchData,
      total: Number(json.totalHit ?? json.searchData.length),
      path: "searchData[]",
    };
  }
  if (Array.isArray(json.data)) {
    return {
      rows: json.data,
      total: Number(
        json.recordsTotal ?? json.recordsFiltered ?? json.total ?? json.data.length
      ),
      path: "data[]",
    };
  }
  if (json.data && typeof json.data === "object") {
    const inner = json.data;
    if (Array.isArray(inner.data)) {
      return {
        rows: inner.data,
        total: Number(
          inner.recordsTotal ??
            inner.recordsFiltered ??
            inner.total ??
            json.recordsTotal ??
            inner.data.length
        ),
        path: "data.data[]",
      };
    }
    if (Array.isArray(inner.content)) {
      return {
        rows: inner.content,
        total: Number(inner.totalElements ?? inner.total ?? inner.content.length),
        path: "data.content[]",
      };
    }
    if (typeof inner === "string") {
      try {
        return extractRows(JSON.parse(inner));
      } catch {
        /* fallthrough */
      }
    }
  }
  if (Array.isArray(json.content)) {
    return {
      rows: json.content,
      total: Number(json.totalElements ?? json.total ?? json.content.length),
      path: "content[]",
    };
  }
  if (Array.isArray(json.result)) {
    return { rows: json.result, total: json.result.length, path: "result[]" };
  }
  if (Array.isArray(json.aaData)) {
    return {
      rows: json.aaData,
      total: Number(json.iTotalRecords ?? json.aaData.length),
      path: "aaData[]",
    };
  }
  return { rows: [], total: 0, path: "unknown", keys: Object.keys(json) };
}

function asRegionList(json) {
  if (Array.isArray(json)) return json;
  if (!json || typeof json !== "object") return [];
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.content)) return json.content;
  if (Array.isArray(json.result)) return json.result;
  if (Array.isArray(json.regions)) return json.regions;
  return [];
}

function normalizeRegion(item) {
  const id = item.id || item.regionId || item.region1Id || null;
  const fullCode =
    item.fullCode ||
    item.code ||
    item.level1FullCode ||
    item.level2FullCode ||
    item.level3FullCode ||
    item.level4FullCode ||
    item.level5FullCode ||
    item.level6FullCode ||
    "";
  const name =
    item.name ||
    item.nama ||
    item.label ||
    item.regionName ||
    item.wilayah ||
    fullCode ||
    id ||
    "?";
  return { id, fullCode: String(fullCode), name: String(name), raw: item };
}

function digitsOnly(s) {
  return String(s || "").replace(/\D/g, "");
}

function regionCodeMatches(region, targetRaw) {
  const target = String(targetRaw).trim();
  const targetDig = digitsOnly(target);
  const codes = [
    region.fullCode,
    region.raw && region.raw.code,
    region.raw && region.raw.fullCode,
  ]
    .filter(Boolean)
    .map(String);
  for (const c of codes) {
    if (c === target || digitsOnly(c) === targetDig) return "exact";
  }
  for (const c of codes) {
    const d = digitsOnly(c);
    if (d && targetDig.startsWith(d)) return "prefix";
  }
  return null;
}

function pickRegionForCode(list, targetRaw) {
  const exact = [];
  const prefix = [];
  for (const r of list) {
    const m = regionCodeMatches(r, targetRaw);
    if (m === "exact") exact.push(r);
    else if (m === "prefix") prefix.push(r);
  }
  if (exact.length) return exact[0];
  if (!prefix.length) return null;
  prefix.sort(
    (a, b) => digitsOnly(b.fullCode).length - digitsOnly(a.fullCode).length
  );
  return prefix[0];
}

/**
 * Resolve kode wilayah (mis. "9705010") → path + regionFilters.
 * Turun level1..N: exact match stop; else prefix terpanjang lalu lanjut.
 */
async function resolveRegionByCode(
  code,
  { groupId, cookie, xsrf, maxLevel = 6 }
) {
  const target = String(code || "").trim();
  if (!target) throw new Error("Kode wilayah kosong");

  const path = [];
  let parentFullCode = null;

  for (let level = 1; level <= maxLevel; level++) {
    const list = await fetchRegions(level, {
      groupId,
      parentFullCode,
      cookie,
      xsrf,
    });
    if (!list.length) {
      throw new Error(
        `Kode ${target}: tidak ada data region di level${level}` +
          (path.length
            ? ` (path: ${path.map((p) => p.fullCode).join(">")})`
            : "")
      );
    }

    const picked = pickRegionForCode(list, target);
    if (!picked) {
      throw new Error(
        `Kode ${target} tidak ketemu di level${level}. Contoh: ${list
          .slice(0, 5)
          .map((r) => r.fullCode)
          .join(", ")}`
      );
    }

    path.push({ level, ...picked });
    parentFullCode = picked.fullCode;
    console.log(
      `→ level${level} ${picked.name} [${picked.fullCode}] ${picked.id}`
    );

    if (regionCodeMatches(picked, target) === "exact") {
      return {
        path,
        stopLevel: level,
        allAtLevel: false,
        regionFilters: regionFiltersFromPick({ path }),
        byCode: target,
      };
    }
  }

  return {
    path,
    stopLevel: path.length,
    allAtLevel: false,
    regionFilters: regionFiltersFromPick({ path }),
    byCode: target,
  };
}

async function fetchRegions(level, { groupId, parentFullCode, cookie, xsrf }) {
  const params = new URLSearchParams({ groupId });
  if (level >= 2 && parentFullCode) {
    params.set(`level${level - 1}FullCode`, parentFullCode);
  }
  const url = `${REGION_BASE}/level${level}?${params}`;
  const { json, status } = await fetchJson(url, {
    method: "GET",
    cookie,
    xsrf,
  });
  const list = asRegionList(json).map(normalizeRegion).filter((r) => r.id);
  if (!list.length) {
    console.warn(
      `region level${level} empty (status=${status}). keys=`,
      json && typeof json === "object" ? Object.keys(json).join(",") : typeof json,
      "sample=",
      JSON.stringify(json).slice(0, 400)
    );
  }
  return list;
}

function promptLine(message) {
  if (typeof window !== "undefined" && typeof window.prompt === "function") {
    return Promise.resolve(window.prompt(message));
  }
  // Node fallback
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(message + " ", (ans) => {
      rl.close();
      resolve(ans);
    });
  });
}

/**
 * Cascade picker level1..level6.
 * Return: { path[], stopLevel, allAtLevel, regionFilters }
 * - pilih nomor → turun level berikutnya
 * - 0 = SEMUA di level ini → stop; regionFilters = path parent saja
 *   (contoh: Prov+Kab lalu 0 di level3 → region1Id+region2Id)
 */
async function chooseRegionInteractive({ groupId, cookie, xsrf, maxLevel = 6 }) {
  const path = [];
  let parentFullCode = null;

  function finish(stopLevel, allAtLevel) {
    const regionFilters = regionFiltersFromPick({ path });
    return { path, stopLevel, allAtLevel, regionFilters };
  }

  for (let level = 1; level <= maxLevel; level++) {
    const list = await fetchRegions(level, {
      groupId,
      parentFullCode,
      cookie,
      xsrf,
    });
    if (!list.length) {
      console.warn(`Tidak ada anak di level${level}. Stop di parent.`);
      break;
    }

    console.log(`\n=== ${LEVEL_LABEL[level] || "level" + level} ===`);
    console.log("  0) * SEMUA di level ini (stop cascade)");
    list.forEach((r, i) => {
      console.log(`  ${i + 1}) ${r.name}  [${r.fullCode}]  ${r.id}`);
    });

    const parentHint = path.length
      ? path.map((p) => p.name).join(" > ")
      : "(root)";
    const ans = await promptLine(
      `Pilih ${LEVEL_LABEL[level]} (0=SEMUA, 1-${list.length}, atau kode mis. 9705010) — path: ${parentHint}`
    );
    if (ans == null) throw new Error("Region picker dibatalkan");
    const raw = String(ans).trim();

    // Ketik kode wilayah (bukan angka index murni 0..N)
    const asNum = Number(raw);
    const looksLikeIndex =
      /^\d+$/.test(raw) &&
      Number.isFinite(asNum) &&
      asNum >= 0 &&
      asNum <= list.length &&
      raw.length <= String(list.length).length;

    if (!looksLikeIndex) {
      // resolve dari root pakai kode (bisa lompat ke level dalam)
      return resolveRegionByCode(raw, {
        groupId,
        cookie,
        xsrf,
        maxLevel,
      });
    }

    const n = asNum;
    if (n === 0) {
      console.log(
        level === 1
          ? "→ SEMUA wilayah (tanpa filter region)"
          : `→ SEMUA anak di bawah: ${parentHint}`
      );
      return finish(level, true);
    }

    const picked = list[n - 1];
    path.push({ level, ...picked });
    parentFullCode = picked.fullCode;
    console.log(`→ ${picked.name}`);

    if (level === maxLevel) return finish(level, false);
  }

  return finish(path.length, false);
}

async function fetchAllAssignments({ cookie, xsrf, pageSize, ctx, extraParam }) {
  const all = [];
  let start = 0;
  let total = Infinity;
  let page = 0;

  while (start < total) {
    const { json, status } = await fetchJson(DATATABLE_URL, {
      method: "POST",
      body: datatableBody(start, pageSize, ctx, extraParam),
      cookie,
      xsrf,
    });
    const extracted = extractRows(json);
    const rows = extracted.rows;
    total = extracted.total;

    if (page === 0) {
      console.log(
        `datatable status=${status} path=${extracted.path} pageRows=${rows.length} total=${total}` +
          (extracted.keys ? ` keys=${extracted.keys.join(",")}` : "")
      );
      if (rows.length === 0) {
        console.warn(
          "EMPTY datatable — raw json (trim):",
          JSON.stringify(json).slice(0, 800)
        );
        break;
      }
      console.log("sample keys:", Object.keys(rows[0] || {}).join(", "));
      console.log(
        "sample mode:",
        JSON.stringify(rows[0].mode ?? rows[0].modes),
        "name:",
        rows[0].data1
      );
    }

    if (!rows.length) break;
    all.push(...rows);
    start += rows.length;
    page += 1;
    if (rows.length < pageSize) break;
    if (page > 200) throw new Error("pagination safety stop (>200 pages)");
    await sleep(400);
  }
  return all;
}

function normalizeRow(row) {
  const modes = modeList(row);
  return {
    id: row.id,
    modes,
    name: row.data1 || row.codeIdentity || row.id,
    rawMode: row.mode ?? row.modes,
  };
}

async function changeOne(id, name, { cookie, xsrf, dryRun }) {
  const url = `${CHANGE_BASE}/${id}/change-mode`;
  if (dryRun) {
    console.log(`[dry-run] ${name} (${id})`);
    return { ok: true, dryRun: true };
  }
  const { status } = await fetchJson(url, {
    method: "POST",
    body: { modes: ["CAPI"] },
    cookie,
    xsrf,
  });
  console.log(`[ok ${status}] ${name}`);
  return { ok: true, status };
}

function resolveAuth(opts = {}) {
  const cookie = opts.cookie || "";
  let xsrf = opts.xsrf || cookieVal("XSRF-TOKEN");
  if (!xsrf && cookie) {
    xsrf = (cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || "";
    try {
      xsrf = decodeURIComponent(xsrf);
    } catch {
      /* keep */
    }
  }
  if (!xsrf) {
    throw new Error(
      "Missing XSRF-TOKEN — buka fasih-sm (logged in), atau pass xsrf / FASIH_XSRF"
    );
  }
  return { cookie, xsrf };
}

function formatRegionFilters(rf) {
  const keys = Object.keys(rf || {}).sort();
  if (!keys.length) return "(none)";
  return keys.map((k) => `${k}=${rf[k]}`).join(" ");
}

async function peekDatatable(opts = {}) {
  const ctx = resolveContext(opts);
  const { cookie, xsrf } = resolveAuth(opts);
  const pageSize = opts.pageSize ?? 100;
  console.log(
    `context surveyId=${ctx.surveyId} periodId=${ctx.surveyPeriodId} status=${ctx.filterStatus} regions=${formatRegionFilters(ctx.regionFilters)}`
  );
  const { json, status } = await fetchJson(DATATABLE_URL, {
    method: "POST",
    body: datatableBody(0, pageSize, ctx, opts.extraParam),
    cookie,
    xsrf,
  });
  const extracted = extractRows(json);
  console.log({
    status,
    path: extracted.path,
    rows: extracted.rows.length,
    total: extracted.total,
    keys: extracted.keys || Object.keys(json),
    sample: extracted.rows[0] || null,
  });
  return { json, extracted, ctx };
}

async function run(opts = {}) {
  const doDry = opts.dryRun !== false;
  const delayMinMs = opts.delayMinMs ?? 2000;
  const delayMaxMs = opts.delayMaxMs ?? 5000;
  const fixedDelay = opts.delayMs != null ? Number(opts.delayMs) : null;
  const pageSize = opts.pageSize ?? 100;
  const chooseRegionOpt = opts.chooseRegion ?? opts.choseRegion;
  const ctx = resolveContext(opts);
  const { cookie, xsrf } = resolveAuth(opts);

  let regionPick = null;
  if (chooseRegionOpt) {
    const maxLevel = opts.maxLevel ?? 6;
    if (typeof chooseRegionOpt === "string") {
      console.log(`resolve region by code: ${chooseRegionOpt}`);
      regionPick = await resolveRegionByCode(chooseRegionOpt, {
        groupId: ctx.groupId,
        cookie,
        xsrf,
        maxLevel,
      });
    } else {
      regionPick = await chooseRegionInteractive({
        groupId: ctx.groupId,
        cookie,
        xsrf,
        maxLevel,
      });
    }
    ctx.regionFilters = regionPick.regionFilters;
    console.log(
      `region dipilih: path=${regionPick.path.map((p) => p.name).join(" > ") || "(semua)"}` +
        ` filters=${formatRegionFilters(ctx.regionFilters)}` +
        (regionPick.allAtLevel ? ` [SEMUA di level${regionPick.stopLevel}]` : "") +
        (regionPick.byCode ? ` code=${regionPick.byCode}` : "")
    );
  }

  console.log(
    `context surveyId=${ctx.surveyId} periodId=${ctx.surveyPeriodId} status=${ctx.filterStatus} regions=${formatRegionFilters(ctx.regionFilters)}`
  );
  console.log(`fetch datatable pageSize=${pageSize} ...`);
  const raw = await fetchAllAssignments({
    cookie,
    xsrf,
    pageSize,
    ctx,
    extraParam: opts.extraParam,
  });
  const rows = raw.map(normalizeRow).filter((r) => r.id);
  const todo = rows.filter((r) => needsCapi(r.modes));
  const skip = rows.length - todo.length;

  console.log(
    `fetched=${rows.length} skip_capi=${skip} todo=${todo.length} dryRun=${doDry} delay=${
      fixedDelay != null
        ? fixedDelay + "ms fixed"
        : `${delayMinMs}-${delayMaxMs}ms random`
    }`
  );

  if (rows.length && todo.length === 0) {
    console.log("Semua sudah CAPI.");
  }
  if (rows.length && rows.every((r) => r.modes.length === 0)) {
    console.warn(
      "WARN: semua mode kosong — keys sample:",
      Object.keys(raw[0] || {}).join(", ")
    );
  }

  for (const r of todo) {
    console.log(`  - ${r.name}  mode=${JSON.stringify(r.modes)}  id=${r.id}`);
  }

  const ok = [];
  const fail = [];
  for (let i = 0; i < todo.length; i++) {
    const row = todo[i];
    console.log(`(${i + 1}/${todo.length}) ${row.name}`);
    try {
      await changeOne(row.id, row.name, { cookie, xsrf, dryRun: doDry });
      ok.push(row);
    } catch (e) {
      console.error(`[fail] ${row.name}: ${e.message}`);
      fail.push({ ...row, error: e.message });
      if (String(e.message).includes("STOP")) break;
    }
    if (!doDry && i < todo.length - 1) {
      const wait =
        fixedDelay != null ? fixedDelay : randDelay(delayMinMs, delayMaxMs);
      console.log(`  wait ${wait}ms ...`);
      await sleep(wait);
    }
  }
  console.log(`done ok=${ok.length} fail=${fail.length}`);
  return {
    ok,
    fail,
    fetched: rows.length,
    todo: todo.length,
    ctx,
    regionPick,
  };
}

const isNode =
  typeof process !== "undefined" && process.versions && process.versions.node;
if (isNode && typeof require !== "undefined" && require.main === module) {
  const args = process.argv.slice(2);
  const doDry = !args.includes("--run") || args.includes("--dry-run");
  run({
    dryRun: doDry,
    cookie: envGet("FASIH_COOKIE"),
    xsrf: envGet("FASIH_XSRF"),
    surveyId: envGet("FASIH_SURVEY_ID") || undefined,
    surveyPeriodId: envGet("FASIH_SURVEY_PERIOD_ID") || undefined,
    groupId: envGet("FASIH_REGION_GROUP_ID") || undefined,
    url: envGet("FASIH_URL") || undefined,
    filterStatus:
      envGet("FASIH_FILTER_STATUS") !== ""
        ? envGet("FASIH_FILTER_STATUS")
        : undefined,
    chooseRegion: args.includes("--choose-region"),
    delayMinMs: Number(envGet("DELAY_MIN_MS") || 2000),
    delayMaxMs: Number(envGet("DELAY_MAX_MS") || 5000),
    delayMs: envGet("DELAY_MS") !== "" ? Number(envGet("DELAY_MS")) : undefined,
    pageSize: Number(envGet("PAGE_SIZE") || 100),
  })
    .then((r) => {
      if (r.fail.length) process.exitCode = 1;
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

if (typeof globalThis !== "undefined") {
  globalThis.fasihChangeModeCapi = {
    run,
    peekDatatable,
    chooseRegionInteractive,
    resolveRegionByCode,
    regionFiltersFromPick,
    fetchRegions,
    fetchAllAssignments,
    needsCapi,
    extractRows,
    parseSurveyUrl,
    resolveContext,
  };
  globalThis.run = run;
  globalThis.peekDatatable = peekDatatable;
  globalThis.chooseRegion = chooseRegionInteractive;
}
