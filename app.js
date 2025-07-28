
document.addEventListener("DOMContentLoaded", () => {
  const godinaSelect = document.getElementById("godina");
  const mjesecSelect = document.getElementById("mjesec");
  const ucitajBtn = document.getElementById("ucitaj");
  const tablicaDiv = document.getElementById("tablica");
  const rezultatiDiv = document.getElementById("rezultati");

  const pad = (n) => (n < 10 ? "0" + n : n);
  const radniDanUFondu = 8;

  const blagdani = {
    2025: ["01-01", "06-01", "20-04", "21-04", "01-05", "22-05", "15-06", "22-06", "05-08", "15-08", "01-11", "18-11", "25-12", "26-12"],
    2026: ["01-01", "06-01", "05-04", "06-04", "01-05", "11-06", "04-06", "22-06", "05-08", "15-08", "01-11", "18-11", "25-12", "26-12"],
    2027: ["01-01", "06-01", "28-03", "29-03", "01-05", "27-05", "07-06", "22-06", "05-08", "15-08", "01-11", "18-11", "25-12", "26-12"],
    2028: ["01-01", "06-01", "16-04", "17-04", "01-05", "15-06", "25-05", "22-06", "05-08", "15-08", "01-11", "18-11", "25-12", "26-12"]
  };

  for (let god = 2025; god <= 2028; god++) {
    const option = document.createElement("option");
    option.value = god;
    option.textContent = god;
    godinaSelect.appendChild(option);
  }

  function izracunajRazliku(od, doVrijeme) {
    if (!od || !doVrijeme) return 0;
    const [odH, odM] = od.split(":").map(Number);
    const [doH, doM] = doVrijeme.split(":").map(Number);
    let minuti = (doH * 60 + doM) - (odH * 60 + odM);
    return Math.max(minuti, 0);
  }

  function formatirajMinute(m) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${h}h ${pad(min)}min`;
  }

  ucitajBtn.addEventListener("click", () => {
    const mjesec = parseInt(mjesecSelect.value);
    const godina = parseInt(godinaSelect.value);
    const datum = new Date(godina, mjesec + 1, 0);
    const brojDana = datum.getDate();
    const dani = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];

    let html = "<table><thead><tr><th>Datum</th><th>Od</th><th>Do</th><th>Vrsta</th><th>Ukupno</th></tr></thead><tbody>";
    for (let d = 1; d <= brojDana; d++) {
      const datumObj = new Date(godina, mjesec, d);
      const danTjedna = datumObj.getDay();
      const danLabel = dani[danTjedna];
      const datumStr = pad(d) + "." + pad(mjesec + 1) + "." + godina;
      const id = `${godina}-${pad(mjesec + 1)}-${pad(d)}`;
      const jeBlagdan = blagdani[godina].includes(`${pad(d)}-${pad(mjesec + 1)}`);
      const klasa = danTjedna === 0 || danTjedna === 6 || jeBlagdan ? "neradni" : "";

      html += `<tr class="${klasa}">
        <td>${danLabel}, ${datumStr}</td>
        <td><input type="time" class="od" data-id="${id}" ${jeBlagdan ? "disabled" : ""}></td>
        <td><input type="time" class="do" data-id="${id}" ${jeBlagdan ? "disabled" : ""}></td>
        <td>
          <select class="vrsta" data-id="${id}">
            <option value="">-</option>
            <option value="GODIŠNJI ODMOR">GODIŠNJI ODMOR</option>
            <option value="BOLOVANJE">BOLOVANJE</option>
            <option value="PRIVATNO">PRIVATNO</option>
            <option value="BLAGDAN"${jeBlagdan ? " selected" : ""}>BLAGDAN</option>
          </select>
        </td>
        <td class="ukupno" data-id="${id}">0h 00min</td>
      </tr>`;
    }
    html += "</tbody></table>";
    tablicaDiv.innerHTML = html;

    document.querySelectorAll("input, select").forEach(el => {
      el.addEventListener("change", izracunajSve);
    });

    function izracunajSve() {
      let ukupnoMin = 0, prekovremeniMin = 0;
      let godMin = 0, bolMin = 0;

      document.querySelectorAll("tbody tr").forEach(tr => {
        const od = tr.querySelector(".od")?.value;
        const doVrijeme = tr.querySelector(".do")?.value;
        const vrsta = tr.querySelector(".vrsta").value;
        const ukupnoTd = tr.querySelector(".ukupno");
        let min = 0;

        if (vrsta === "GODIŠNJI ODMOR") min = 480;
        else if (vrsta === "BOLOVANJE") min = 480;
        else if (vrsta === "BLAGDAN") min = 480;
        else if (od && doVrijeme) min = izracunajRazliku(od, doVrijeme);

        ukupnoTd.textContent = formatirajMinute(min);

        if (vrsta === "GODIŠNJI ODMOR") godMin += min;
        else if (vrsta === "BOLOVANJE") bolMin += min;
        else ukupnoMin += min;

        if (min > 480 && vrsta === "") prekovremeniMin += min - 480;
      });

      const fond = [...tablicaDiv.querySelectorAll("tr")].filter(tr => !tr.classList.contains("neradni")).length * 480;
      const sveMin = ukupnoMin + godMin + bolMin;

      rezultatiDiv.innerHTML = `
        <p><strong>Ukupno odrađeni sati:</strong> ${formatirajMinute(ukupnoMin)}</p>
        <p><strong>Godišnji odmor:</strong> ${formatirajMinute(godMin)}</p>
        <p><strong>Bolovanje:</strong> ${formatirajMinute(bolMin)}</p>
        <p><strong>Ukupno (odrađeno + izostanci):</strong> ${formatirajMinute(sveMin)}</p>
        <p><strong>Prekovremeni sati:</strong> ${formatirajMinute(prekovremeniMin)}</p>
        <p><strong>Fond sati:</strong> ${formatirajMinute(fond)}</p>
      `;
    }

    izracunajSve();
  });
});
