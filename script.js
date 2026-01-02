const units = {
  length: ["meter", "kilometer", "centimeter", "inch", "foot"],
  mass: ["gram", "kilogram", "pound", "ounce"],
  temperature: ["celsius", "fahrenheit", "kelvin"]
};

function loadUnits() {
  const category = document.getElementById("category").value;
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");

  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  units[category].forEach(u => {
    fromUnit.innerHTML += `<option value="${u}">${u}</option>`;
    toUnit.innerHTML += `<option value="${u}">${u}</option>`;
  });
}

function convert() {
  const category = document.getElementById("category").value;
  const value = parseFloat(document.getElementById("inputValue").value);
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;
  let result = value;

  if (category === "length") {
    if (from === "meter" && to === "kilometer") result = value / 1000;
    else if (from === "kilometer" && to === "meter") result = value * 1000;
    else if (from === "meter" && to === "centimeter") result = value * 100;
    else if (from === "centimeter" && to === "meter") result = value / 100;
    else if (from === "inch" && to === "meter") result = value * 0.0254;
    else if (from === "meter" && to === "inch") result = value / 0.0254;
    else if (from === "foot" && to === "meter") result = value * 0.3048;
    else if (from === "meter" && to === "foot") result = value / 0.3048;
  }

  if (category === "mass") {
    if (from === "gram" && to === "kilogram") result = value / 1000;
    else if (from === "kilogram" && to === "gram") result = value * 1000;
    else if (from === "pound" && to === "kilogram") result = value * 0.4536;
    else if (from === "kilogram" && to === "pound") result = value / 0.4536;
    else if (from === "ounce" && to === "gram") result = value * 28.35;
    else if (from === "gram" && to === "ounce") result = value / 28.35;
  }

  if (category === "temperature") {
    if (from === "celsius" && to === "fahrenheit") result = (value * 9/5) + 32;
    else if (from === "fahrenheit" && to === "celsius") result = (value - 32) * 5/9;
    else if (from === "celsius" && to === "kelvin") result = value + 273.15;
    else if (from === "kelvin" && to === "celsius") result = value - 273.15;
  }

  const output = `${value} ${from} = ${result} ${to}`;
  document.getElementById("result").innerText = output;

  // Tambah ke history
  const historyList = document.getElementById("historyList");
  const li = document.createElement("li");
  li.textContent = output;
  historyList.appendChild(li);
}

function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}

// load default units on page load
window.onload = loadUnits;