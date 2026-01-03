// Panggil loadUnits bila DOM siap
document.addEventListener("DOMContentLoaded", loadUnits);

// Konfigurasi semua kategori
const UNIT_CONFIG = {
  length: {
    base: "meter",
    units: {
      meter: { label: "meter", factorToBase: 1 },
      kilometer: { label: "kilometer", factorToBase: 1000 },
      centimeter: { label: "centimeter", factorToBase: 0.01 },
      millimeter: { label: "millimeter", factorToBase: 0.001 },
      inch: { label: "inch", factorToBase: 0.0254 },
      foot: { label: "foot", factorToBase: 0.3048 },
      mile: { label: "mile", factorToBase: 1609.344 }
    }
  },
  mass: {
    base: "kilogram",
    units: {
      kilogram: { label: "kilogram", factorToBase: 1 },
      gram: { label: "gram", factorToBase: 0.001 },
      milligram: { label: "milligram", factorToBase: 0.000001 },
      pound: { label: "pound", factorToBase: 0.45359237 },
      ounce: { label: "ounce", factorToBase: 0.028349523125 },
      stone: { label: "stone", factorToBase: 6.35029318 }
    }
  },
  temperature: {
    base: "kelvin",
    units: {
      kelvin: { label: "kelvin", toBase: v => v, fromBase: K => K },
      celsius: { label: "celsius", toBase: v => v + 273.15, fromBase: K => K - 273.15 },
      fahrenheit: { label: "fahrenheit", toBase: v => (v - 32) * 5/9 + 273.15, fromBase: K => (K - 273.15) * 9/5 + 32 }
    }
  },
  time: {
    base: "second",
    units: {
      second: { label: "second", factorToBase: 1 },
      minute: { label: "minute", factorToBase: 60 },
      hour: { label: "hour", factorToBase: 3600 },
      day: { label: "day", factorToBase: 86400 }
    }
  },
  area: {
    base: "square_meter",
    units: {
      square_meter: { label: "m²", factorToBase: 1 },
      square_kilometer: { label: "km²", factorToBase: 1e6 },
      hectare: { label: "hectare", factorToBase: 10000 },
      acre: { label: "acre", factorToBase: 4046.86 },
      square_foot: { label: "ft²", factorToBase: 0.092903 },
      square_inch: { label: "in²", factorToBase: 0.00064516 }
    }
  },
  volume: {
    base: "liter",
    units: {
      liter: { label: "liter", factorToBase: 1 },
      milliliter: { label: "milliliter", factorToBase: 0.001 },
      cubic_meter: { label: "m³", factorToBase: 1000 },
      gallon: { label: "gallon (US)", factorToBase: 3.78541 },
      pint: { label: "pint (US)", factorToBase: 0.473176 }
    }
  },
  speed: {
    base: "meter_per_second",
    units: {
      meter_per_second: { label: "m/s", factorToBase: 1 },
      kilometer_per_hour: { label: "km/h", factorToBase: 0.277778 },
      mile_per_hour: { label: "mph", factorToBase: 0.44704 },
      knot: { label: "knot", factorToBase: 0.514444 }
    }
  },
  pressure: {
    base: "pascal",
    units: {
      pascal: { label: "Pa", factorToBase: 1 },
      bar: { label: "bar", factorToBase: 100000 },
      atmosphere: { label: "atm", factorToBase: 101325 },
      psi: { label: "psi", factorToBase: 6894.76 }
    }
  },
  energy: {
    base: "joule",
    units: {
      joule: { label: "joule", factorToBase: 1 },
      kilojoule: { label: "kilojoule", factorToBase: 1000 },
      calorie: { label: "calorie", factorToBase: 4.184 },
      kilowatt_hour: { label: "kWh", factorToBase: 3600000 }
    }
  },
  power: {
    base: "watt",
    units: {
      watt: { label: "watt", factorToBase: 1 },
      kilowatt: { label: "kilowatt", factorToBase: 1000 },
      horsepower: { label: "horsepower", factorToBase: 745.7 }
    }
  }
};

// Format nombor
function formatNumber(num) {
  const s = Number(num).toFixed(6);
  return s.replace(/\.?0+$/, "");
}

// Muat dropdown ikut kategori
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

// Logik convert
function convertValue(category, value, from, to) {
  const cfg = UNIT_CONFIG[category];
  if (!cfg) throw new Error("Kategori tidak dikenali: " + category);
  if (from === to) return value;

  if (category === "length" || category === "mass" || category === "time" ||
      category === "area" || category === "volume" || category === "speed" ||
      category === "pressure" || category === "energy" || category === "power") {
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

// Fungsi utama convert
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

// Clear history
function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}