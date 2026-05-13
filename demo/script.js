const slider = document.getElementById("slider");
const demo = document.getElementById("demo");
const weightValue = document.getElementById("weight-value");

slider.oninput = e => {
  const weight = e.target.value;
  // font-variation-settings overrides font-weight for variable fonts,
  // allowing precise axis control beyond the standard keyword values.
  demo.style.fontVariationSettings = `"wght" ${weight}`;
  weightValue.textContent = weight;
  slider.setAttribute("aria-valuenow", weight);
};
