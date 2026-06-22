// =====================================================
// Agente Clima IES
// heatmaps.js
// v1.3
// Tabla filtrada por fecha seleccionada
// =====================================================

function createHeatmaps() {


createTemperatureHeatmap();


}

function createTemperatureHeatmap() {


const container =
    document.getElementById(
        "temperatureHeatmap"
    );

if (!container) {
    return;
}

container.innerHTML = "";

const aulas =
    Object.keys(rawData);

if (!aulas.length) {
    return;
}

// =====================================
// Fechas disponibles
// =====================================

const fechas = new Set();

aulas.forEach(aula => {

    rawData[aula].forEach(r => {

        fechas.add(
            r.timestamp
                .toISOString()
                .split("T")[0]
        );

    });

});

const fechasOrdenadas =
    [...fechas].sort();

// =====================================
// Selector de fechas
// =====================================

const selector =
    document.getElementById(
        "daySelector"
    );

if (selector) {


const valorAnterior =
    selector.value;

selector.innerHTML = "";

fechasOrdenadas.forEach(fecha => {

    selector.innerHTML += `
        <option value="${fecha}">
            ${fecha}
        </option>
    `;

});

if (
    valorAnterior &&
    fechasOrdenadas.includes(
        valorAnterior
    )
) {

    selector.value =
        valorAnterior;

} else {

    selector.value =
        fechasOrdenadas[0];

}

selector.onchange = function() {

    createTemperatureHeatmap();

};


}


const fechaSeleccionada =
    selector
        ? selector.value
        : fechasOrdenadas[0];

// =====================================
// Cabecera
// =====================================

let html = "";

html += `
<h3 class="font-bold text-lg mb-4">
    Mapa térmico diario
</h3>

<p class="mb-4">
    Fecha seleccionada:
    <strong>${fechaSeleccionada}</strong>
</p>

<p class="mb-4">
    Número de días detectados:
    ${fechasOrdenadas.length}
</p>
`;

// =====================================
// Tabla diaria
// =====================================

html +=
    '<table class="min-w-full border text-xs">';

html += "<tr>";

html +=
    "<th class='border p-1'>Aula</th>";

for (
    let hora = 0;
    hora < 24;
    hora++
) {

    html +=
        `<th class='border p-1'>${hora}</th>`;

}

html += "</tr>";

aulas.forEach(aula => {

    html += "<tr>";

    html += `
        <td class='border p-1 font-bold'>
            ${aula}
        </td>
    `;

    const mediasHora = {};

    rawData[aula].forEach(r => {

        const fechaRegistro =
            r.timestamp
                .toISOString()
                .split("T")[0];

        if (
            fechaRegistro !==
            fechaSeleccionada
        ) {
            return;
        }

        const hora =
            r.timestamp.getHours();

        if (!mediasHora[hora]) {

            mediasHora[hora] = [];

        }

        mediasHora[hora].push(
            r.temp
        );

    });

    for (
        let hora = 0;
        hora < 24;
        hora++
    ) {

        if (
            mediasHora[hora]
        ) {

            const media =
                mediasHora[hora]
                    .reduce(
                        (a, b) => a + b,
                        0
                    ) /
                mediasHora[hora]
                    .length;

            html += `
                <td class='border p-1'>
                    ${media.toFixed(1)}
                </td>
            `;

        } else {

            html +=
                "<td class='border'></td>";

        }

    }

    html += "</tr>";

});

html += "</table>";

container.innerHTML =
    html;


}
