document.addEventListener("DOMContentLoaded", () => {
  const godinaSelect = document.getElementById("godina");
  const mjesecSelect = document.getElementById("mjesec");
  const ucitajBtn = document.getElementById("ucitaj");
  const tablicaDiv = document.getElementById("tablica");
  const rezultatiDiv = document.getElementById("rezultati");

  for (let god = 2025; god <= 2028; god++) {
    const option = document.createElement("option");
    option.value = god;
    option.textContent = god;
    godinaSelect.appendChild(option);
  }

  ucitajBtn.addEventListener("click", () => {
    const mjesec = parseInt(mjesecSelect.value);
    const godina = parseInt(godinaSelect.value);
    tablicaDiv.innerHTML = `<p>Učitana tablica za <strong>${mjesec + 1}/${godina}</strong> (ovdje ide satnica...)</p>`;
    rezultatiDiv.innerHTML = "<p>Izračun ide ovdje (odrađeni sati, prekovremeni, fond itd.).</p>";
  });
});
