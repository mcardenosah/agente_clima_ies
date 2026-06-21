// =====================================================
function openTab(tabId) {
document
    .querySelectorAll(".tab-content")
    .forEach(tab => {
        tab.classList.remove(
            "active"
        );
    });
document
    .getElementById(
        `tab-${tabId}`
    )
    .classList.add(
        "active"
    );
}
// -----------------------------------------------------
// Resumen
// -----------------------------------------------------
function updateSummary() {
const evaluables =
    processedStats.filter(
        s =>
        s.estado === "Evaluable"
    );
const cumplenRD =
    evaluables.filter(
        s =>
        s.cumpleRD
    ).length;
const incumplenRD =
    evaluables.length -
    cumplenRD;
document
    .getElementById(
        "summary-list"
    )
    .innerHTML = `
<li>
<strong>Aulas evaluadas:</strong>
${evaluables.length}
</li>
<li>
<strong>Cumplen RD486:</strong>
${cumplenRD}
</li>
<li>
<strong>No cumplen RD486:</strong>
${incumplenRD}
</li>
`;
}
// -----------------------------------------------------
// Tabla informe
// -----------------------------------------------------
function populateTable() {
const tbody =
    document.getElementById(
        "informe-tbody"
    );
tbody.innerHTML = "";
processedStats.forEach(stat => {
    if (
        stat.estado !==
        "Evaluable"
    ) {
        return;
    }
    const cumple =
        stat.cumpleRD
        ? "✔"
        : "✘";
    tbody.innerHTML += `
<tr>
<td>${stat.aula}</td>
<td>${stat.tMedia.toFixed(1)}</td>
<td>${stat.tMax.toFixed(1)}</td>
<td>${stat.horasMenos17.toFixed(2)}</td>
<td>${stat.horasMas27.toFixed(2)}</td>
<td>${stat.eta27.toFixed(2)}</td>
<td>${stat.hrMedia.toFixed(1)}</td>
<td>${stat.hrMin.toFixed(1)}</td>
<td>${stat.hrMax.toFixed(1)}</td>
<td>${stat.porcentajeHRFueraRango.toFixed(1)}%</td>
<td>${stat.diMedia.toFixed(1)}</td>

<td>${stat.diMax.toFixed(1)}</td>

<td>${stat.horasDI24.toFixed(1)}</td>

<td>${stat.horasDI27.toFixed(1)}</td>

<td>${stat.porcentajeDI24.toFixed(1)}%</td>

<td>${stat.porcentajeDI27.toFixed(1)}%</td>

<td>${stat.categoriaConfort}</td>
<td>${stat.severidad}</td>
<td>${cumple}</td>

</tr>
`;
});
}
