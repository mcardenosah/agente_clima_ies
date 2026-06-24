// =====================================================
// Agente Clima IES v1.6 Leyenda mapa térmico
// heatmaps.js
// v1.3
// Tabla filtrada por fecha seleccionada
// =====================================================

function createHeatmaps() {

    createHeatmap();

}

function createHeatmap() {


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

    createHeatmap();

};


}


const fechaSeleccionada =
    selector
        ? selector.value
        : fechasOrdenadas[0];
const mapTypeSelector =
    document.getElementById(
        "mapTypeSelector"
    );

const tipoMapa =
    mapTypeSelector
        ? mapTypeSelector.value
        : "temperature";

if (mapTypeSelector) {

    mapTypeSelector.onchange =
        function() {

            createHeatmap();

        };

}
// =====================================
// Cabecera
// =====================================

let html = "";

html += `
<h3 class="font-bold text-lg mb-4">
    ${
        tipoMapa === "temperature"
        ? "Mapa térmico diario"
        : "Mapa DI diario"
    }
</h3>

<p class="mb-4">
    Fecha seleccionada:
    <strong>${fechaSeleccionada}</strong>
</p>

<p class="mb-4">
    Número de días detectados:
    ${fechasOrdenadas.length}
</p>

<div class="flex flex-wrap gap-4 mb-4 text-sm">

    <div class="flex items-center gap-2">
        <span class="temp-muy-frio border px-3 py-1"></span>
        <span>&lt; 22°C</span>
    </div>

    <div class="flex items-center gap-2">
        <span class="temp-confortable border px-3 py-1"></span>
        <span>22–25°C</span>
    </div>

    <div class="flex items-center gap-2">
        <span class="temp-calido border px-3 py-1"></span>
        <span>25–27°C</span>
    </div>

    <div class="flex items-center gap-2">
        <span class="temp-calor border px-3 py-1"></span>
        <span>27–30°C</span>
    </div>

    <div class="flex items-center gap-2">
        <span class="temp-extremo border px-3 py-1"></span>
        <span>&gt; 30°C</span>
    </div>

</div>
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

        if (tipoMapa === "temperature") {

    mediasHora[hora].push(
        r.temp
    );

} else {

    mediasHora[hora].push(
        calculateThomIndex(
            r.temp,
            r.hum
        )
    );

}
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

            let claseTemperatura = "";

if (media < 22) {

    claseTemperatura =
        "temp-muy-frio";

} else if (media < 25) {

    claseTemperatura =
        "temp-confortable";

} else if (media < 27) {

    claseTemperatura =
        "temp-calido";

} else if (media < 30) {

    claseTemperatura =
        "temp-calor";

} else {

    claseTemperatura =
        "temp-extremo";

}

html += `
    <td class="border p-1 ${claseTemperatura}">
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
