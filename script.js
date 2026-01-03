// Unit tersedia
const units = {
  length: ["meter", "kilometer", "centimeter", "inch", "foot"],
  mass: ["gram", "kilogram", "pound", "ounce"],
  temperature: ["celsius", "fahrenheit", "kelvin"]
};

// Faktor ke unit dasar
// Length: ke meter
const lengthFactors = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  inch: 0.0254,
  foot: 0.3048
};

// Mass: ke kilogram
const massFactors = {
  kilogram: 1,
  gram: 0.001,
  pound: 0.45359237,
  ounce: 0.028349523125
};

// Util: format angka (pembulatan rapi)
function formatNumber(num) {
  // Bulatkan ke 6 desimal, dan hilangkan nol di belakang
  const s = Number(num).toFixed(6);
  return s.replace(/\.?0+$/, "");
}

// Muat unit berdasarkan kategori
function loadUnits() {
  const category = document.getElementById("category").value;
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");

  // Simpan pilihan sebelumnya (kalau ada)
  const prevFrom = fromUnit.value;
  const prevTo = toUnit.value;

  // Kosongkan dropdown dengan aman
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  // Isi opsi
  units[category].forEach(u => {
    const optFrom = document.createElement("option");
    optFrom.value = u;
    optFrom.textContent = u;
    fromUnit.appendChild(optFrom);

    const optTo = document.createElement("option");
    optTo.value = u;
    optTo.textContent = u;
    toUnit.appendChild(optTo);
  });

  // Pulihkan pilihan jika masih relevan
  if (units[category].includes(prevFrom)) fromUnit.value = prevFrom;
  if (units[category].includes(prevTo)) toUnit.value = prevTo;
}

// Konversi temperature (C, F, K)
function convertTemperature(value, from, to) {
  if (from === to) return value;

  // Normalisasi via Kelvin
  let kelvin;
  if (from === "celsius") kelvin = value + 273.15;
  else if (from === "fahrenheit") kelvin = (value - 32) * 5/9 + 273.15;
  else if (from === "kelvin") kelvin = value;
  else throw new Error("Unit temperature tidak dikenal: " + from);

  if (to === "kelvin") return kelvin;
  if (to === "celsius") return kelvin - 273.15;
  if (to === "fahrenheit") return (kelvin - 273.15) * 9/5 + 32;

  throw new Error("Unit temperature tidak dikenal: " + to);
}

// Konversi via faktor (linear): length/mass
function convertLinear(value, from, to, factorMap) {
  if (from === to) return value;
  const fFrom = factorMap[from];
  const fTo = factorMap[to];
  if (fFrom == null || fTo == null) {
    throw new Error(`Unit tidak dikenal (from=${from}, to=${to})`);
  }
  const baseValue = value * fFrom;       // ke unit dasar
  const result = baseValue / fTo;        // dari unit dasar ke target
  return result;
}

// Handler utama konversi
function convert() {
  const category = document.getElementById("category").value;
  const inputStr = document.getElementById("inputValue").value.trim();
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;
  const resultEl = document.getElementById("result");
  const historyList = document.getElementById("historyList");

  // Validasi input
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
    let result;

    if (category === "length") {
      result = convertLinear(value, from, to, lengthFactors);
    } else if (category === "mass") {
      result = convertLinear(value, from, to, massFactors);
    } else if (category === "temperature") {
      result = convertTemperature(value, from, to);
    } else {
      resultEl.innerText = "Kategori tidak dikenali.";
      return;
    }

    const output = `${formatNumber(value)} ${from} = ${formatNumber(result)} ${to}`;
    resultEl.innerText = output;

    // Tambah ke history
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

// Muat default units saat halaman siap
window.onload = loadUnits;