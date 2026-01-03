// --- Konfigurasi unit ---
const UNIT_CONFIG = {
  length: {
    base: "meter",
    units: {
      meter:      { label: "meter",      factorToBase: 1 },
      kilometer:  { label: "kilometer",  factorToBase: 1000 },
      centimeter: { label: "centimeter", factorToBase: 0.01 },
      millimeter: { label: "millimeter", factorToBase: 0.001 },
      inch:       { label: "inch",       factorToBase: 0.0254 },
      foot:       { label: "foot",       factorToBase: 0.3048 },
      mile:       { label: "mile",       factorToBase: 1609.344 }
    }
  },
  mass: {
    base: "kilogram",
    units: {
      kilogram: { label: "kilogram", factorToBase: 1 },
      gram:     { label: "gram",     factorToBase: 0.001 },
      milligram:{ label: "milligram",factorToBase: 0.000001 },
      pound:    { label: "pound",    factorToBase: 0.45359237 },
      ounce:    { label: "ounce",    factorToBase: 0.028349523125 },
      stone:    { label: "stone",    factorToBase: 6.35029318 }
    }
  },
  temperature: {
    base: "kelvin",
    units: {
      kelvin:     { label: "kelvin",
        toBase: (v) => v,
        fromBase: (K) => K
      },
      celsius:    { label: "celsius",
        toBase: (v) => v + 273.15,
        fromBase: (K) => K - 273.15
      },
      fahrenheit: { label: "fahrenheit",
        toBase: (v) => (v - 32) * 5/9 + 273.15,
        fromBase: (K) => (K - 273.15) * 9/5 + 32
      }
    }
  }
};

// Format nombor
function formatNumber(num) {
  const s = Number(num).toFixed(6);
  return s.replace(/\.?0+$/, "");
}

// Muat dropdown
function loadUnits() {
  const category = document.getElementById("category").value;
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");

  const cfg = UNIT_CONFIG[category];
  if (!cfg) return;

  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  Object.keys(cfg.units).forEach(key => {
    const u = cfg.units[key];
    const optFrom = document.createElement("option");
    optFrom.value = key;
    optFrom.textContent = u.label;
    fromUnit.appendChild(optFrom);

    const optTo = document.createElement("option");
    optTo.value = key;
    optTo.textContent = u.label;
    toUnit.appendChild(optTo);
  });
}

// Konversi
function convertValue(category, value, from, to) {
  const cfg = UNIT_CONFIG[category];
  if (!cfg) throw new Error("Kategori tidak dikenali: " + category);

  if (from === to) return value;

  if (category === "length" || category === "mass") {
    const uFrom = cfg.units[from];
    const uTo = cfg.units[to];
    const baseVal = value * uFrom.factorToBase;
    return baseVal / uTo.factorToBase;
  }

  if (category === "temperature") {
    const uFrom = cfg.units[from];
    const uTo = cfg.units[to];
    const K = uFrom.toBase(value);
    return uTo.fromBase(K);
  }

  throw new Error("Kategori belum disokong: " + category);
}

function convert() {
  const category = document.getElementById("category").value;
  const inputStr = document.getElementById("inputValue").value.trim();
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;
  const resultEl = document.getElementById("result");
  const historyList = document.getElementById("historyList");

  if (inputStr === "") {
    resultEl.innerText = "Sila masukkan nilai terlebih dahulu.";
    return;
  }
  const value = parseFloat(inputStr);
  if (Number.isNaN(value)) {
    resultEl.innerText = "Nilai tidak sah. Pastikan input adalah nombor.";
    return;
  }

  try {
    const result = convertValue(category, value, from, to);
    const labelFrom = UNIT_CONFIG[category].units[from].label;
    const labelTo = UNIT_CONFIG[category].units[to].label;
    const output = `${formatNumber(value)} ${labelFrom} = ${formatNumber(result)} ${labelTo}`;
    resultEl.innerText = output;

    const li = document.createElement("li");
    li.textContent = output;
    historyList.appendChild(li);
  } catch (err) {
    resultEl.innerText = "Ralat: " + err.message;
  }
}

function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}

// ✅ Panggil sekali masa page load
window.onload = loadUnits;