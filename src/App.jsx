import { useState, useEffect, useRef } from "react";

// ─── JEEPNEY ROUTE DATABASE ───
const JEEPNEY_ROUTES = [
  { code: "01B", group: "Sambag I / Urgello", route: "Sambag 1 – Piers 2–4 (via Colon)", landmarks: "E-Mall; Colon (Metro/UV/Gaisano); T. Padilla; MJ Cuenco; V. Sotto; Plaza Independencia; Piers 2–4" },
  { code: "01C", group: "Urgello / V. Rama", route: "V. Rama – Colon / Pier area", landmarks: "V. Rama; E-Mall; Colon; Mabini; Zulueta; MJ Cuenco; T. Padilla; V. Sotto; Piers 3–4" },
  { code: "01K", group: "Urgello", route: "Urgello – Parkmall (via SM/NBT)", landmarks: "Colon/Parián; MJ Cuenco; Gen. Maxilom; SM City; North Bus Terminal; Parkmall" },
  { code: "02B", group: "CSBT / Pier", route: "South Bus Terminal – Piers 1–5", landmarks: "E-Mall; Colon; Plaza Independencia; Pier 1–3 (loop to 4–5); MJ Cuenco; Sanciangko" },
  { code: "03A", group: "Mabolo / Panagdait", route: "Panagdait/Mabolo – Carbon", landmarks: "F. Cabahug; Pope John Paul II Ave; Mabolo Church; MJ Cuenco; Museo Sugbo; V. Gullas; Manalili; Carbon" },
  { code: "04B", group: "Lahug", route: "Lahug/JY – Carbon", landmarks: "JY Square; Salinas; Gorordo; Escario; Capitol; Osmeña Blvd; Colon; City Hall; Carbon" },
  { code: "04C", group: "Lahug", route: "Lahug – SM / Downtown (variant)", landmarks: "JY/UP; Gorordo/Escario; Cebu Business Park; Ayala; Gen. Maxilom; SM area (variant paths)" },
  { code: "04D", group: "Busay / Plaza Housing", route: "Plaza Housing (Busay) – Carbon via Tabo-an", landmarks: "Transcentral Hwy; Marco Polo; JY; Escario; Capitol; Jones; Sanciangko; E-Mall; Tabo-an; Magallanes; Carbon" },
  { code: "04H", group: "Busay / Plaza Housing", route: "Plaza Housing – Carbon via Jones/Colon", landmarks: "Veterans Dr; Marco Polo; JY; Gorordo/Escario; Capitol; Jones; Colon; City Hall; Carbon" },
  { code: "06B", group: "Guadalupe", route: "Guadalupe – Carbon", landmarks: "V. Rama; B. Rodriguez; Fuente; Jones; Colon; Carbon" },
  { code: "06C", group: "Guadalupe", route: "Guadalupe – Carbon", landmarks: "V. Rama; B. Rodriguez; Fuente; Jones; Colon; Carbon" },
  { code: "06G", group: "Guadalupe", route: "Guadalupe – Tabo-an", landmarks: "Guadalupe Church; PRC; V. Rama; Tabo-an Public Market" },
  { code: "06H", group: "Guadalupe", route: "Guadalupe – SM City Cebu (via Ayala)", landmarks: "V. Rama; Capitol; Cebu Doctors; Escario; Ayala; Juan Luna; Mabolo Church; SM City" },
  { code: "07B", group: "Banawa", route: "Banawa – Carbon", landmarks: "Banawa; V. Rama; B. Rodriguez; Fuente; Osmeña Blvd; Colon; City Hall; Carbon" },
  { code: "08F", group: "Alumnos / Mambaling", route: "Alumnos – SM City Cebu", landmarks: "Tagunol; UC-METC; C. Padilla; MJ Cuenco; F. Cabahug; SM City" },
  { code: "08G", group: "Alumnos / Mambaling", route: "Alumnos – Colon", landmarks: "Tagunol; UC-METC; C. Padilla; Jai-Alai; Carlock; Spolarium; Pasil; San Nicolas; Colon" },
  { code: "09C", group: "Basak / Pardo", route: "Basak – Colon", landmarks: "N. Bacalso; CCMC; Colon" },
  { code: "09F", group: "Basak / Pardo", route: "Basak – Ibabao / Zulueta corridor", landmarks: "Cebu City Medical Center; USJR; CITU; MJ Cuenco; Zulueta" },
  { code: "09G", group: "Basak / Pardo", route: "Basak – Colon", landmarks: "N. Bacalso; C. Padilla; Colon" },
  { code: "10F", group: "Bulacao / Pardo", route: "Bulacao – Colon", landmarks: "N. Bacalso; CIT-U; Mambaling; CSBT; Colon" },
  { code: "10G", group: "Pardo", route: "Pardo – Magallanes / City Hall", landmarks: "Osmeña Blvd; Jones; Colon; City Hall; Magallanes" },
  { code: "10H", group: "Bulacao / Pardo", route: "Bulacao – SM City Cebu", landmarks: "N. Bacalso; CIT-U; Mambaling; CSBT; CCMC; Cathedral; F. Cabahug; SM City" },
  { code: "11A", group: "Inayawan", route: "Inayawan – Colon / downtown", landmarks: "Inayawan; Pardo; N. Bacalso; C. Padilla; Colon; Manalili" },
  { code: "12D", group: "Labangon", route: "Labangon – Colon", landmarks: "Katipunan; Tres de Abril; N. Bacalso; Sanciangko; Colon" },
  { code: "12G", group: "Labangon", route: "Labangon – SM City Cebu", landmarks: "Katipunan; Tabo-an; C. Padilla; Sanciangko; MJ Cuenco; T. Padilla; F. Cabahug; Juan Luna; SM City" },
  { code: "12I", group: "Labangon", route: "Labangon – SM City Cebu", landmarks: "Labangon Market; N. Bacalso; CSBT; Colon Terminal; SM City" },
  { code: "12L", group: "Labangon / Punta Princesa", route: "Labangon – Ayala", landmarks: "Tres de Abril; N. Bacalso; J. Alcantara; USC South; Vicente Sotto Hospital; Ayala Center" },
  { code: "13B", group: "Talamban", route: "Talamban/Tintay – Carbon", landmarks: "Gov. M. Cuenco; BTC; Country Mall; Escario/Jones; Colon; Carbon" },
  { code: "13C", group: "Talamban", route: "Talamban/Tintay – Colon", landmarks: "USC Talamban; BTC; Country Mall; Cebu Business Park; Ayala; Gorordo; Ramos; Colon" },
  { code: "14B", group: "Osmeña Blvd Corridor", route: "Osmeña Blvd – Colon/Ayala (variant)", landmarks: "Fuente; Cebu Normal; Abellana; Osmeña Blvd; Colon / Ayala" },
  { code: "14D", group: "Osmeña Blvd Corridor", route: "Ayala – Colon", landmarks: "Cebu Business Park; Ayala; Osmeña Blvd; Colon" },
  { code: "15", group: "Opra", route: "Opra – City core", landmarks: "Opra inner-city links to Fuente/Jones/Colon" },
  { code: "15A", group: "Opra", route: "Opra – City core", landmarks: "Opra inner-city links to Fuente/Jones/Colon" },
  { code: "17B", group: "Apas / IT Park", route: "Apas/IT Park – Carbon", landmarks: "IT Park; Geonzon; Salinas; JY; UP; Escario; Capitol; Jones; Colon; Carbon" },
  { code: "20A", group: "Mandaue ↔ Cebu BP", route: "Mandaue (Pacific Mall/J Centre) – Ayala", landmarks: "A.S. Fortuna; Subangdaku; Wireless; Tipolo; Parkmall; Mandaue Market; SB Cabahug; Cebu Business Park" },
  { code: "20B", group: "Mandaue ↔ Cebu BP", route: "Mandaue (Centro/Estancia) – Ayala", landmarks: "A. del Rosario; Guizo; Tipolo; Wireless; Subangdaku; Mabolo; Cebu Business Park" },
  { code: "21A", group: "Mandaue intra-city", route: "Centro/Tipolo/Subangdaku – loops", landmarks: "Mandaue City Hall; Public Market; Tipolo; Subangdaku" },
  { code: "22I", group: "Mandaue to Banilad", route: "Mandaue Market – Gaisano Country Mall", landmarks: "Mandaue City Hall; BIR; J Centre; A.S. Fortuna; BTC; Country Mall" },
  { code: "23", group: "Mactan ↔ Cebu", route: "Parkmall – Punta Engaño", landmarks: "Parkmall; Marcelo Fernan Bridge; Opon Market; MEPZ; Punta Engaño" },
  { code: "24", group: "Consolacion ↔ Cebu", route: "Consolacion – SM/White Gold", landmarks: "SM Consolacion; Fooda; Pacific Mall; J Centre; Wireless; NBT; SM; White Gold" },
  { code: "25", group: "Liloan ↔ Cebu", route: "Liloan – SM/White Gold", landmarks: "Consolacion; SM Consolacion; Pacific Mall; J Centre; Wireless; NBT; SM; Robinsons Galleria" },
  { code: "26", group: "Compostela ↔ Cebu", route: "Compostela – Cebu City", landmarks: "Liloan/Consolacion → Mandaue → North Reclamation → SM/NBT" },
  { code: "27", group: "Danao ↔ Cebu", route: "Sabang, Danao – Cebu City", landmarks: "Sabang/Danao; Consolacion; UN Ave; North Reclamation; SM/NBT" },
  { code: "28", group: "Carmen ↔ Cebu", route: "Carmen – Cebu City", landmarks: "Cebu North corridor → Mandaue → Cebu City" },
  { code: "29", group: "Cordova (Mactan)", route: "Cordova – Lapu-Lapu/Mactan hubs", landmarks: "Cordova; Babag; Opon Market; MEPZ; bridge links" },
  { code: "41", group: "Talisay / Tabunok", route: "Tabunok – Cebu City (Colon/Carbon)", landmarks: "Tabunok; Mambaling; C. Padilla; Pasil; Colon/Carbon" },
  { code: "42", group: "Talisay", route: "Talisay – Cebu City", landmarks: "Talisay corridor → Bacalso spine → downtown" },
  { code: "43", group: "Minglanilla", route: "Minglanilla – Cebu City", landmarks: "Minglanilla → N. Bacalso → Pardo/Mambaling → Cebu City" },
  { code: "44", group: "Naga", route: "Naga – Basak/Punta Princesa / Cebu City", landmarks: "Naga; South Gen Hospital; Basak; Punta Princesa; C. Padilla/Carbon corridors" },
  { code: "45", group: "San Fernando", route: "San Fernando – Cebu City", landmarks: "San Fernando → Carcar → Naga → Minglanilla → Tabunok → Cebu City" },
  { code: "46", group: "Carcar", route: "Carcar – Cebu City", landmarks: "Carcar → San Fernando → Naga → Minglanilla → Talisay → Cebu City" },
  { code: "47", group: "Sibonga", route: "Sibonga – Cebu City", landmarks: "South coastal towns → Bacalso spine → Cebu City" },
  { code: "51", group: "Pung-ol / Sibugay", route: "Barangay connectors – Cebu City", landmarks: "Local barangays → Talamban corridor → city" },
  { code: "62B", group: "Pit-os", route: "Pit-os – Carbon", landmarks: "Pit-os; Talamban; Gaisano Country Mall; BTC; Ayala; Ramos/Echavez; Colon; Carbon" },
  { code: "62C", group: "Pit-os", route: "Pit-os – City (variant)", landmarks: "Similar to 62B with variant streets/stops" },
];

// ─── GAS ADVISOR CONSTANTS ───
const FUEL_GAUGE_LEVELS = [
  { label: "Almost Empty", range: "0–15%", value: 10, color: "#FF3B30" },
  { label: "Quarter Tank", range: "15–30%", value: 22, color: "#FF9500" },
  { label: "Half Tank", range: "30–55%", value: 42, color: "#FFCC00" },
  { label: "More Than Half", range: "55–80%", value: 67, color: "#34C759" },
  { label: "Almost Full", range: "80%+", value: 90, color: "#30D158" },
];

const DISTANCE_LEVELS = [
  { label: "Short", range: "< 20 km/day", value: 15 },
  { label: "Moderate", range: "20–50 km/day", value: 35 },
  { label: "Long", range: "50–100 km/day", value: 75 },
  { label: "Very Long", range: "100+ km/day", value: 120 },
];

// ─── SHARED COMPONENTS ───
function GaugeArc({ percent, size = 160 }) {
  const sw = 16, r = (size - sw) / 2, cx = size / 2, cy = size / 2;
  const sA = 135, eA = 405, tA = eA - sA;
  const fA = sA + tA * (percent / 100);
  const p2c = (a) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arc = (s, e) => {
    const st = p2c(s), en = p2c(e);
    return `M ${st.x} ${st.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${en.x} ${en.y}`;
  };
  const col = percent <= 15 ? "#FF3B30" : percent <= 30 ? "#FF9500" : percent <= 55 ? "#FFCC00" : "#34C759";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={arc(sA, eA)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} strokeLinecap="round" />
      {percent > 0 && <path d={arc(sA, Math.min(fA, eA))} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${col}66)`, transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)" }} />}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="32" fontWeight="800" fontFamily="'Azeret Mono', monospace">{percent}%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="'Azeret Mono', monospace" letterSpacing="2">FUEL LEVEL</text>
    </svg>
  );
}

function StatBox({ label, value, color = "white" }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 14px", minWidth: 110 }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function PriceTickerBar({ news }) {
  if (!news || news.length === 0) return null;
  const text = news.join("  ◆  ");
  return (
    <div style={{ overflow: "hidden", background: "rgba(255,59,48,0.08)", borderTop: "1px solid rgba(255,59,48,0.15)", borderBottom: "1px solid rgba(255,59,48,0.15)", padding: "10px 0", marginBottom: 20 }}>
      <div style={{ display: "inline-block", whiteSpace: "nowrap", animation: "ticker 30s linear infinite", fontFamily: "'Azeret Mono', monospace", fontSize: 11, color: "#FF6B6B", letterSpacing: 1 }}>
        {text}{"  ◆  "}{text}
      </div>
    </div>
  );
}

// ─── LANDMARK ALIASES (maps common names to DB landmark text) ───
const LANDMARK_ALIASES = {
  "sm": ["SM City", "SM"],
  "sm city": ["SM City", "SM"],
  "sm cebu": ["SM City", "SM"],
  "ayala": ["Ayala", "Cebu Business Park", "Ayala Center"],
  "ayala center": ["Ayala", "Cebu Business Park", "Ayala Center"],
  "ayala mall": ["Ayala", "Cebu Business Park"],
  "carbon": ["Carbon", "Carbon Market"],
  "carbon market": ["Carbon", "Manalili"],
  "colon": ["Colon"],
  "it park": ["IT Park"],
  "fuente": ["Fuente"],
  "fuente osmena": ["Fuente", "Osmeña Blvd"],
  "capitol": ["Capitol"],
  "parkmall": ["Parkmall"],
  "mandaue": ["Mandaue", "Mandaue City Hall", "Mandaue Market"],
  "mabolo": ["Mabolo", "Mabolo Church"],
  "lahug": ["Lahug", "JY", "JY Square"],
  "jy": ["JY", "JY Square"],
  "jy square": ["JY", "JY Square"],
  "banawa": ["Banawa"],
  "guadalupe": ["Guadalupe", "Guadalupe Church"],
  "talamban": ["Talamban", "USC Talamban"],
  "usc talamban": ["USC Talamban", "Talamban"],
  "basak": ["Basak"],
  "pardo": ["Pardo"],
  "labangon": ["Labangon", "Labangon Market"],
  "mambaling": ["Mambaling"],
  "tabo-an": ["Tabo-an", "Tabo‑an"],
  "taboan": ["Tabo-an", "Tabo‑an"],
  "inayawan": ["Inayawan"],
  "bulacao": ["Bulacao"],
  "country mall": ["Country Mall", "Gaisano Country Mall"],
  "gaisano country mall": ["Country Mall", "Gaisano Country Mall"],
  "consolacion": ["Consolacion", "SM Consolacion"],
  "liloan": ["Liloan"],
  "danao": ["Danao", "Sabang"],
  "mactan": ["Mactan", "MEPZ", "Punta Engaño"],
  "pier": ["Pier", "Piers"],
  "north bus terminal": ["North Bus Terminal", "NBT"],
  "nbt": ["North Bus Terminal", "NBT"],
  "south bus terminal": ["South Bus Terminal", "CSBT"],
  "csbt": ["South Bus Terminal", "CSBT"],
  "urgello": ["Urgello"],
  "v. rama": ["V. Rama"],
  "v rama": ["V. Rama"],
  "escario": ["Escario"],
  "gorordo": ["Gorordo"],
  "jones": ["Jones"],
  "osmena blvd": ["Osmeña Blvd"],
  "osmena": ["Osmeña Blvd", "Fuente"],
  "robinsons galleria": ["Robinsons Galleria"],
  "city hall": ["City Hall"],
  "magallanes": ["Magallanes"],
  "plaza independencia": ["Plaza Independencia"],
  "talisay": ["Talisay", "Tabunok"],
  "tabunok": ["Tabunok"],
  "minglanilla": ["Minglanilla"],
  "naga": ["Naga"],
  "san fernando": ["San Fernando"],
  "carcar": ["Carcar"],
  "cordova": ["Cordova"],
  "pacific mall": ["Pacific Mall"],
  "j centre": ["J Centre"],
  "marco polo": ["Marco Polo"],
  "busay": ["Busay", "Plaza Housing", "Transcentral"],
  "plaza housing": ["Plaza Housing", "Busay"],
  "pit-os": ["Pit-os", "Pit‑os"],
  "pitos": ["Pit-os", "Pit‑os"],
  "opra": ["Opra"],
  "apas": ["Apas", "IT Park"],
  "sambag": ["Sambag"],
  "panagdait": ["Panagdait"],
  "punta princesa": ["Punta Princesa"],
  "btc": ["BTC"],
  "banilad": ["Banilad", "BTC", "Country Mall"],
  "usc": ["USC"],
  "cit-u": ["CIT-U", "CIT‑U", "CITU"],
  "citu": ["CIT-U", "CIT‑U", "CITU"],
  "uc": ["UC-METC", "UC‑METC"],
  "cebu doctors": ["Cebu Doctors"],
  "vicente sotto": ["Vicente Sotto Hospital"],
  "cathedral": ["Cathedral"],
  "san nicolas": ["San Nicolas"],
  "pasil": ["Pasil"],
  "compostela": ["Compostela"],
  "carmen": ["Carmen"],
  "sibonga": ["Sibonga"],
  "subangdaku": ["Subangdaku"],
  "tipolo": ["Tipolo"],
  "fortuna": ["A.S. Fortuna"],
  "as fortuna": ["A.S. Fortuna"],
  "a.s. fortuna": ["A.S. Fortuna"],
};

// Build a list of all unique landmarks for autocomplete suggestions
const ALL_LANDMARKS = (() => {
  const set = new Set();
  JEEPNEY_ROUTES.forEach(r => {
    // Add the group/origin area
    set.add(r.group.split(" / ")[0].trim());
    if (r.group.includes("/")) set.add(r.group.split(" / ")[1]?.trim());
    // Add individual landmarks
    r.landmarks.split(";").forEach(l => {
      const cleaned = l.trim().replace(/‑/g, "-");
      if (cleaned.length > 1) set.add(cleaned);
    });
  });
  // Add common aliases
  Object.keys(LANDMARK_ALIASES).forEach(k => set.add(k.charAt(0).toUpperCase() + k.slice(1)));
  return [...set].filter(Boolean).sort();
})();

// ─── ROUTE MATCHING ENGINE ───
function normalizeText(text) {
  return text.toLowerCase().replace(/[‑–—]/g, "-").replace(/[^a-z0-9\s\-./]/g, "").trim();
}

function getSearchTerms(input) {
  const normalized = normalizeText(input);
  // Check aliases first
  const aliasKey = Object.keys(LANDMARK_ALIASES).find(k => normalizeText(k) === normalized);
  if (aliasKey) return LANDMARK_ALIASES[aliasKey].map(normalizeText);
  // Otherwise use the input itself
  return [normalized];
}

function routeMatchesLocation(route, searchTerms) {
  const haystack = normalizeText(`${route.group} ${route.route} ${route.landmarks}`);
  return searchTerms.some(term => haystack.includes(term));
}

function scoreRoute(route, searchTerms) {
  const landmarks = normalizeText(route.landmarks);
  const routeName = normalizeText(route.route);
  const group = normalizeText(route.group);
  let score = 0;
  for (const term of searchTerms) {
    // Exact word match in landmarks gets highest score
    if (landmarks.split(/[;,]/).some(l => normalizeText(l).includes(term))) score += 10;
    // Match in route name
    if (routeName.includes(term)) score += 8;
    // Match in group
    if (group.includes(term)) score += 6;
  }
  return score;
}

function findDirectRoutes(origin, destination) {
  const originTerms = getSearchTerms(origin);
  const destTerms = getSearchTerms(destination);

  return JEEPNEY_ROUTES
    .filter(r => routeMatchesLocation(r, originTerms) && routeMatchesLocation(r, destTerms))
    .map(r => ({
      route: r,
      score: scoreRoute(r, originTerms) + scoreRoute(r, destTerms)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ route }) => route);
}

function findTransferRoutes(origin, destination) {
  const originTerms = getSearchTerms(origin);
  const destTerms = getSearchTerms(destination);

  const originRoutes = JEEPNEY_ROUTES.filter(r => routeMatchesLocation(r, originTerms));
  const destRoutes = JEEPNEY_ROUTES.filter(r => routeMatchesLocation(r, destTerms));

  // Find common transfer points
  const transfers = [];
  const commonHubs = ["Colon", "Carbon", "Fuente", "SM City", "SM", "Ayala", "Capitol", "Jones", "Osmeña Blvd",
    "MJ Cuenco", "Sanciangko", "C. Padilla", "N. Bacalso", "Mabolo", "F. Cabahug", "Mandaue", "NBT", "North Bus Terminal",
    "CSBT", "South Bus Terminal", "Cathedral", "Magallanes", "V. Rama", "Escario", "BTC", "Country Mall"];

  for (const oRoute of originRoutes) {
    for (const dRoute of destRoutes) {
      if (oRoute.code === dRoute.code) continue;
      const oLandmarks = oRoute.landmarks.split(";").map(l => normalizeText(l));
      const dLandmarks = dRoute.landmarks.split(";").map(l => normalizeText(l));

      for (const hub of commonHubs) {
        const hubNorm = normalizeText(hub);
        const oHas = oLandmarks.some(l => l.includes(hubNorm));
        const dHas = dLandmarks.some(l => l.includes(hubNorm));
        if (oHas && dHas) {
          transfers.push({
            first: oRoute,
            second: dRoute,
            transferPoint: hub,
            score: scoreRoute(oRoute, originTerms) + scoreRoute(dRoute, destTerms)
          });
        }
      }
    }
  }

  // Deduplicate by route pair and pick best transfer point
  const seen = new Set();
  return transfers
    .sort((a, b) => b.score - a.score)
    .filter(t => {
      const key = `${t.first.code}-${t.second.code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 2);
}

function estimateFare(routeType) {
  if (routeType === "direct") return "₱13–₱20";
  return "₱26–₱40 (2 rides)";
}

function buildResult(origin, destination) {
  const directRoutes = findDirectRoutes(origin, destination);

  if (directRoutes.length > 0) {
    return {
      user_area: origin,
      destination_area: destination,
      routes: directRoutes.map(r => ({
        code: r.code,
        name: r.route,
        instruction: `Ride ${r.code} (${r.group}) heading towards your destination. Board near ${origin} area, drop off near ${destination}.`,
        landmarks_passed: r.landmarks,
        type: "direct"
      })),
      transfer_note: null,
      tip: directRoutes.length > 1
        ? "Multiple routes available — pick the one closest to your exact location."
        : "Ask the driver to confirm the route passes your destination before boarding.",
      estimated_fare: estimateFare("direct")
    };
  }

  // Try transfer routes
  const transferRoutes = findTransferRoutes(origin, destination);
  if (transferRoutes.length > 0) {
    const best = transferRoutes[0];
    const routes = transferRoutes.map(t => ([
      {
        code: t.first.code,
        name: t.first.route,
        instruction: `RIDE 1: Board ${t.first.code} (${t.first.group}) from ${origin} area. Drop off at ${t.transferPoint}.`,
        landmarks_passed: t.first.landmarks,
        type: "transfer"
      },
      {
        code: t.second.code,
        name: t.second.route,
        instruction: `RIDE 2: At ${t.transferPoint}, transfer to ${t.second.code} (${t.second.group}) heading to ${destination}.`,
        landmarks_passed: t.second.landmarks,
        type: "transfer"
      }
    ])).flat();

    return {
      user_area: origin,
      destination_area: destination,
      routes: routes.slice(0, 4),
      transfer_note: `No direct route found. Transfer at ${best.transferPoint}: ride ${best.first.code} first, then switch to ${best.second.code}.`,
      tip: "Prepare exact change for both rides. Transfers are common in Cebu!",
      estimated_fare: estimateFare("transfer")
    };
  }

  return null;
}

// ─── AUTOCOMPLETE COMPONENT ───
function AutocompleteInput({ value, onChange, onSubmit, placeholder, label, focusColor = "rgba(0,184,212,0.5)" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (val) => {
    onChange(val);
    setActiveSuggestion(-1);
    if (val.trim().length >= 1) {
      const norm = normalizeText(val);
      const filtered = ALL_LANDMARKS.filter(l =>
        normalizeText(l).includes(norm)
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        onChange(suggestions[activeSuggestion]);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      } else {
        onSubmit?.();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (s) => {
    onChange(s);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {label && (
        <label style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 8 }}>
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "14px 16px",
          color: "white", fontSize: 14, fontFamily: "'Azeret Mono', monospace",
          outline: "none", transition: "border-color 0.2s"
        }}
        onFocusCapture={(e) => e.target.style.borderColor = focusColor}
        onBlurCapture={(e) => {
          setTimeout(() => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }, 150);
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          background: "rgba(18,20,25,0.98)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, marginTop: 4, overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)", backdropFilter: "blur(10px)"
        }}>
          {suggestions.map((s, i) => (
            <div
              key={s}
              onClick={() => selectSuggestion(s)}
              style={{
                padding: "10px 16px", fontSize: 12, color: i === activeSuggestion ? "#00E5FF" : "rgba(255,255,255,0.7)",
                background: i === activeSuggestion ? "rgba(0,184,212,0.1)" : "transparent",
                cursor: "pointer", fontFamily: "'Azeret Mono', monospace",
                borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                transition: "all 0.15s"
              }}
              onMouseEnter={(e) => { e.target.style.background = "rgba(0,184,212,0.08)"; setActiveSuggestion(i); }}
              onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
            >
              📍 {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── JEEPNEY ROUTE FINDER TAB ───
function JeepneyFinder() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const resultRef = useRef(null);

  const findRoute = () => {
    if (!origin.trim() || !destination.trim()) return;
    setLoading(true);
    setResult(null);
    setSearchError(null);

    // Simulate brief processing time for UX
    setTimeout(() => {
      const res = buildResult(origin.trim(), destination.trim());
      if (res) {
        setResult(res);
        setTimeout(() => { resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 200);
      } else {
        setSearchError(`No route found from "${origin}" to "${destination}". Try a nearby landmark or area name.`);
      }
      setLoading(false);
    }, 400);
  };

  const quickOrigins = ["Lahug", "Guadalupe", "Talamban", "Banawa", "Mabolo", "Labangon", "Basak", "Mandaue"];
  const quickDestinations = ["SM City", "Ayala Center", "Carbon", "IT Park", "Colon", "Fuente", "Parkmall", "Mandaue"];

  return (
    <div>
      {/* Origin Input */}
      <div style={{ marginBottom: 16 }}>
        <AutocompleteInput
          value={origin}
          onChange={(val) => { setOrigin(val); setResult(null); }}
          onSubmit={findRoute}
          placeholder="e.g. Lahug, Guadalupe, Talamban..."
          label="📍 WHERE ARE YOU?"
          focusColor="rgba(74,222,128,0.5)"
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
          {quickOrigins.map((d) => (
            <button
              key={d}
              onClick={() => { setOrigin(d); setResult(null); }}
              style={{
                background: origin === d ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${origin === d ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20, padding: "5px 12px", fontSize: 10, color: origin === d ? "#4ADE80" : "rgba(255,255,255,0.45)",
                fontFamily: "'Azeret Mono', monospace", cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Arrow Divider */}
      <div style={{ textAlign: "center", margin: "4px 0 12px", fontSize: 18, color: "rgba(255,255,255,0.15)" }}>▼</div>

      {/* Destination Input */}
      <div style={{ marginBottom: 16 }}>
        <AutocompleteInput
          value={destination}
          onChange={(val) => { setDestination(val); setResult(null); }}
          onSubmit={findRoute}
          placeholder="e.g. SM City, Ayala, Carbon, IT Park..."
          label="🏁 WHERE ARE YOU GOING?"
          focusColor="rgba(0,184,212,0.5)"
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
          {quickDestinations.map((d) => (
            <button
              key={d}
              onClick={() => { setDestination(d); setResult(null); }}
              style={{
                background: destination === d ? "rgba(0,184,212,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${destination === d ? "rgba(0,184,212,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20, padding: "5px 12px", fontSize: 10, color: destination === d ? "#00E5FF" : "rgba(255,255,255,0.45)",
                fontFamily: "'Azeret Mono', monospace", cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={findRoute}
        disabled={!origin.trim() || !destination.trim() || loading}
        style={{
          width: "100%", padding: 16, borderRadius: 14, border: "none",
          fontFamily: "'Azeret Mono', monospace", fontWeight: 700, fontSize: 14, letterSpacing: 2,
          cursor: !origin.trim() || !destination.trim() || loading ? "not-allowed" : "pointer",
          background: !origin.trim() || !destination.trim() || loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #00B8D4, #0091EA)",
          color: !origin.trim() || !destination.trim() || loading ? "rgba(255,255,255,0.2)" : "white",
          transition: "all 0.3s ease",
          boxShadow: origin.trim() && destination.trim() && !loading ? "0 8px 30px rgba(0,184,212,0.2)" : "none",
          marginTop: 4
        }}
      >
        {loading ? "🔍 FINDING ROUTES..." : "🚐 FIND MY JEEPNEY"}
      </button>

      {loading && (
        <div style={{ textAlign: "center", marginTop: 24, animation: "pulse 1.5s infinite" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>MATCHING ROUTES...</div>
        </div>
      )}

      {searchError && (
        <div style={{ marginTop: 20, padding: 16, background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.2)", borderRadius: 12, fontSize: 12, color: "#FF6B6B", textAlign: "center" }}>
          {searchError}
        </div>
      )}

      {/* Results */}
      {result && (
        <div ref={resultRef} style={{ marginTop: 24, animation: "slideUp 0.5s ease" }}>
          {/* Journey Summary */}
          <div style={{
            background: "rgba(0,184,212,0.06)", border: "1px solid rgba(0,184,212,0.15)",
            borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 16px" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>FROM</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#4ADE80", marginTop: 2 }}>{result.user_area}</div>
              </div>
              <div style={{ fontSize: 20, color: "rgba(255,255,255,0.2)" }}>→</div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 16px" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>TO</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#00E5FF", marginTop: 2 }}>{result.destination_area}</div>
              </div>
            </div>
            {result.estimated_fare && (
              <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                Est. fare: <span style={{ color: "#FFCC00", fontWeight: 700 }}>{result.estimated_fare}</span>
              </div>
            )}
          </div>

          {/* Route Cards */}
          {result.routes?.map((route, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: 20, marginBottom: 12, animation: "slideUp 0.4s ease",
              animationDelay: `${i * 0.1}s`, animationFillMode: "forwards", opacity: 0
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  background: route.type === "direct" ? "linear-gradient(135deg, #00B8D4, #0091EA)" : "linear-gradient(135deg, #FF9500, #FF6B00)",
                  borderRadius: 10, padding: "10px 14px", minWidth: 56, textAlign: "center"
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1 }}>{route.code}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 2 }}>{route.name}</div>
                  <div style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 6, display: "inline-block",
                    background: route.type === "direct" ? "rgba(0,184,212,0.15)" : "rgba(255,149,0,0.15)",
                    color: route.type === "direct" ? "#00E5FF" : "#FFB84D"
                  }}>
                    {route.type === "direct" ? "DIRECT" : "TRANSFER"}
                  </div>
                </div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, marginBottom: 10,
                borderLeft: `3px solid ${route.type === "direct" ? "rgba(0,184,212,0.4)" : "rgba(255,149,0,0.4)"}`
              }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{route.instruction}</div>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                <span style={{ letterSpacing: 1.5, marginRight: 6 }}>VIA:</span>{route.landmarks_passed}
              </div>
            </div>
          ))}

          {/* Transfer Note */}
          {result.transfer_note && (
            <div style={{
              background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.15)",
              borderRadius: 12, padding: "14px 16px", marginBottom: 12, fontSize: 12,
              color: "#FFB84D", display: "flex", gap: 8
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>🔄</span>
              {result.transfer_note}
            </div>
          )}

          {/* Tip */}
          {result.tip && (
            <div style={{
              background: "rgba(0,184,212,0.08)", border: "1px solid rgba(0,184,212,0.15)",
              borderRadius: 12, padding: "14px 16px", fontSize: 12, color: "#4DD0E1", display: "flex", gap: 8
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
              {result.tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── GAS ADVISOR TAB ───
function GasAdvisor() {
  const [tankLevel, setTankLevel] = useState(null);
  const [dailyDistance, setDailyDistance] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newsHeadlines, setNewsHeadlines] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const resultRef = useRef(null);

  useEffect(() => {
    // Localized news for demo
    const demoNews = [
      "Petron and Shell announce ₱1.50/L hike for Diesel next Tuesday",
      "DOE monitoring local pumps for price transparency",
      "Global crude prices stabilize after week of volatility",
      "Public transport groups seeking fare hike amid fuel costs",
      "Cleanfuel offering ₱2.00/L discount on selected stations"
    ];
    setNewsHeadlines(demoNews);
    setNewsLoading(false);
  }, []);

  const getVerdict = async () => {
    if (tankLevel === null || dailyDistance === null) return;
    setLoading(true);
    setAnalysis(null);

    const tank = FUEL_GAUGE_LEVELS[tankLevel], dist = DISTANCE_LEVELS[dailyDistance];

    // Local deterministic analyzer logic for demo
    setTimeout(() => {
      const isLow = tank.value <= 30;
      const isHighUsage = dist.value >= 75;
      const willRise = true; // Simulating a predicted price hike next week

      let verdict, confidence, reasons, tip;

      if (isLow) {
        verdict = "GAS UP NOW";
        confidence = 95;
        reasons = [
          "Tank level is critical (" + tank.range + ")",
          "Confirmed price hike of ₱1.50/L coming next Tuesday",
          "Local supply constraints reported in Cebu North"
        ];
        tip = "Don't wait until the weekend — queues will be longer due to the hike news.";
      } else if (isHighUsage && tank.value < 60) {
        verdict = "GAS UP NOW";
        confidence = 85;
        reasons = [
          "High daily usage detected (" + dist.range + ")",
          "Significant savings if you fill before Tuesday's hike",
          "Price trend remains upward for the next 7 days"
        ];
        tip = "Filling up now will save you approximately ₱150–₱200 on your next full tank.";
      } else {
        verdict = "YOU CAN WAIT";
        confidence = 70;
        reasons = [
          "You have sufficient fuel for your currently selected range",
          "Tuesday hike is moderate; you can wait for off-peak hours",
          "New supply arrivals expected by mid-week may stabilize prices"
        ];
        tip = "Check back on Monday afternoon for the final price adjustment updates.";
      }

      setAnalysis({
        verdict,
        confidence,
        days_remaining: Math.max(1, Math.round((tank.value / 100) * 45 * (12 / dist.value))),
        current_trend: "RISING",
        price_now: "₱62.40/L",
        price_forecast: "₱63.90/L",
        reasons,
        tip
      });
      setTimeout(() => { resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 100);
      setLoading(false);
    }, 1200);
  };

  const reset = () => { setTankLevel(null); setDailyDistance(null); setAnalysis(null); setStep(0); };
  const isGasUp = analysis?.verdict?.includes("GAS UP") || analysis?.verdict?.includes("NOW");

  return (
    <div>
      {newsLoading ? (
        <div style={{ textAlign: "center", padding: "10px 0", marginBottom: 20, fontSize: 11, color: "rgba(255,255,255,0.3)", animation: "pulse 1.5s infinite" }}>
          Fetching live fuel market data...
        </div>
      ) : <PriceTickerBar news={newsHeadlines} />}

      {/* Step 1 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: tankLevel !== null ? "#FF9500" : "rgba(255,255,255,0.08)", color: tankLevel !== null ? "black" : "rgba(255,255,255,0.5)", transition: "all 0.3s" }}>1</span>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5 }}>CURRENT TANK LEVEL</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {FUEL_GAUGE_LEVELS.map((l, i) => (
            <button key={i} className={`opt-btn ${tankLevel === i ? "sel" : ""}`}
              onClick={() => { setTankLevel(i); setStep(1); setAnalysis(null); }}
              style={i === 4 ? { gridColumn: "1 / -1" } : {}}>
              <div style={{ fontWeight: 600, marginBottom: 1 }}>{l.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{l.range}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      <div style={{ marginBottom: 24, opacity: step >= 1 || dailyDistance !== null ? 1 : 0.3, transition: "opacity 0.4s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: dailyDistance !== null ? "#FF9500" : "rgba(255,255,255,0.08)", color: dailyDistance !== null ? "black" : "rgba(255,255,255,0.5)", transition: "all 0.3s" }}>2</span>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5 }}>DAILY DRIVE DISTANCE</span>
        </div>
        <div style={{ gridDisplay: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, display: "grid" }}>
          {DISTANCE_LEVELS.map((l, i) => (
            <button key={i} className={`opt-btn ${dailyDistance === i ? "sel" : ""}`}
              onClick={() => { setDailyDistance(i); setAnalysis(null); }}>
              <div style={{ fontWeight: 600, marginBottom: 1 }}>{l.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{l.range}</div>
            </button>
          ))}
        </div>
      </div>

      <button className="action-btn orange" disabled={tankLevel === null || dailyDistance === null || loading} onClick={getVerdict}>
        {loading ? "⏳ ANALYZING MARKET..." : "⛽ GET MY VERDICT"}
      </button>

      {loading && <div style={{ textAlign: "center", marginTop: 24, animation: "pulse 1.5s infinite" }}><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>PROCESSING LOCAL DATA...</div></div>}

      {analysis && (
        <div ref={resultRef} style={{ marginTop: 28, animation: "slideUp 0.5s ease" }}>
          <div style={{
            background: isGasUp ? "linear-gradient(135deg, rgba(255,59,48,0.12), rgba(255,149,0,0.08))" : "linear-gradient(135deg, rgba(52,199,89,0.12), rgba(48,209,88,0.08))",
            border: `1px solid ${isGasUp ? "rgba(255,59,48,0.3)" : "rgba(52,199,89,0.3)"}`,
            borderRadius: 20, padding: 24, textAlign: "center",
            animation: isGasUp ? "glow 2s infinite" : "glowGreen 2s infinite",
          }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{isGasUp ? "🔴" : "🟢"}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 700, color: isGasUp ? "#FF6B6B" : "#4ADE80", marginBottom: 6 }}>{analysis.verdict}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>{analysis.confidence}% CONFIDENCE</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
            <GaugeArc percent={FUEL_GAUGE_LEVELS[tankLevel]?.value || 50} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <StatBox label="DAYS LEFT" value={`~${analysis.days_remaining}`} />
              <StatBox label="TREND" value={analysis.current_trend} color={analysis.current_trend === "RISING" ? "#FF6B6B" : "#4ADE80"} />
              <StatBox label="NOW" value={analysis.price_now} />
              <StatBox label="FORECAST" value={analysis.price_forecast} />
            </div>
          </div>

          <div style={{ marginTop: 20, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 18, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>WHY</div>
            {analysis.reasons?.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < analysis.reasons.length - 1 ? 8 : 0, animation: "slideUp 0.4s ease forwards", animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <span style={{ color: "#FF9500", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{r}</span>
              </div>
            ))}
          </div>

          {analysis.tip && (
            <div style={{ marginTop: 12, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.15)", borderRadius: 12, padding: "12px 16px", fontSize: 12, color: "#FFB84D", display: "flex", gap: 8 }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>{analysis.tip}
            </div>
          )}

          <button onClick={reset} style={{
            width: "100%", marginTop: 16, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: "'Azeret Mono', monospace",
            fontSize: 11, letterSpacing: 2, cursor: "pointer"
          }}>↺ CHECK AGAIN</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ───
export default function App() {
  const [tab, setTab] = useState("jeepney"); // default to jeepney since user is in Cebu

  // Reset scroll position on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  return (
    <div style={{
      minHeight: "100vh", background: "#08090B", color: "white",
      fontFamily: "'Azeret Mono', monospace", position: "relative"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(255,59,48,0.3); } 50% { box-shadow: 0 0 40px rgba(255,59,48,0.5); } }
        @keyframes glowGreen { 0%, 100% { box-shadow: 0 0 20px rgba(52,199,89,0.3); } 50% { box-shadow: 0 0 40px rgba(52,199,89,0.5); } }
        .opt-btn {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: white; padding: 12px 14px; border-radius: 10; cursor: pointer;
          transition: all 0.25s ease; text-align: left; font-family: 'Azeret Mono', monospace; font-size: 12px;
          border-radius: 10px;
        }
        .opt-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); transform: translateY(-1px); }
        .opt-btn.sel { background: rgba(255,165,0,0.12); border-color: #FF9500; box-shadow: 0 0 16px rgba(255,149,0,0.12); }
        .action-btn {
          width: 100%; padding: 15px; border-radius: 14px; border: none;
          font-family: 'Azeret Mono', monospace; font-weight: 700; font-size: 13px; letter-spacing: 2px;
          cursor: pointer; transition: all 0.3s ease;
        }
        .action-btn:disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.2); cursor: not-allowed; }
        .action-btn.orange:not(:disabled) { background: linear-gradient(135deg, #FF9500, #FF6B00); color: black; }
        .action-btn.orange:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,149,0,0.25); }
        .action-btn.cyan:not(:disabled) { background: linear-gradient(135deg, #00B8D4, #0091EA); color: white; }
        .action-btn.cyan:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,184,212,0.25); }
        .tab-btn {
          flex: 1; padding: 14px 8px; border: none; cursor: pointer;
          font-family: 'Azeret Mono', monospace; font-size: 12px; font-weight: 600;
          letter-spacing: 1px; transition: all 0.3s ease; border-radius: 12px;
          background: transparent; color: rgba(255,255,255,0.35);
        }
        .tab-btn.active-gas { background: rgba(255,149,0,0.12); color: #FF9500; box-shadow: 0 0 20px rgba(255,149,0,0.1); }
        .tab-btn.active-jeep { background: rgba(0,184,212,0.12); color: #00E5FF; box-shadow: 0 0 20px rgba(0,184,212,0.1); }
        .tab-btn:not(.active-gas):not(.active-jeep):hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); }
      `}</style>

      {/* Ambient bg */}
      <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: tab === "gas" ? "radial-gradient(circle, rgba(255,149,0,0.05) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,184,212,0.05) 0%, transparent 70%)", pointerEvents: "none", transition: "background 0.5s" }} />
      <div style={{ position: "absolute", bottom: -150, left: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,59,48,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 40px", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 6, paddingTop: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>CEBU COMMUTER TOOLKIT</div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, margin: "8px 0 4px",
            background: tab === "gas" ? "linear-gradient(135deg, #FFF 0%, #FF9500 100%)" : "linear-gradient(135deg, #FFF 0%, #00E5FF 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.2, transition: "all 0.3s"
          }}>
            {tab === "gas" ? "Should I Gas Up?" : "Sakay Na!"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0, letterSpacing: 1 }}>
            {tab === "gas" ? "AI-powered fuel price advisor" : "Cebu jeepney route finder"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: 6, padding: 4, background: "rgba(255,255,255,0.03)", borderRadius: 14, marginBottom: 24, marginTop: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
          <button className={`tab-btn ${tab === "jeep" || tab === "jeepney" ? "active-jeep" : ""}`}
            onClick={() => setTab("jeepney")}>
            🚐 JEEPNEY
          </button>
          <button className={`tab-btn ${tab === "gas" ? "active-gas" : ""}`}
            onClick={() => setTab("gas")}>
            ⛽ GAS PRICE
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ animation: "slideUp 0.3s ease" }} key={tab}>
          {tab === "gas" ? <GasAdvisor /> : <JeepneyFinder />}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 36, fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>
          Powered by Claude AI • Cebu City
        </div>
      </div>
    </div>
  );
}
