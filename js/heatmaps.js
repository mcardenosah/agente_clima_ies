// =====================================================
// Agente Clima IES v1.7e - Interpretación metodológica del mapa DI
// heatmaps.js
// Mapa Temperatura + DI
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
    // Selector de fecha
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

        selector.onchange =
            function() {

                createHeatmap();

            };

    }

    // =====================================
    // Selector tipo mapa
    // =====================================

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

    const fechaSeleccionada =
        selector
            ? selector.value
            : fechasOrdenadas[0];
// =====================================
// Resumen ejecutivo
// =====================================

let valorMaximo = -Infinity;
let aulaMaxima = "";

let sumaGlobal = 0;
let contadorGlobal = 0;

let aulasSobre27 = 0;
let aulasSobre30 = 0;

let aulasDI27 = 0;
let aulasDI29 = 0;
let aulasDI32 = 0;

aulas.forEach(aula => {

    let maxAula = -Infinity;

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

        const valor =
            tipoMapa === "temperature"
            ? r.temp
            : calculateThomIndex(
                r.temp,
                r.hum
            );

        sumaGlobal += valor;
        contadorGlobal++;

        if (valor > maxAula) {
            maxAula = valor;
        }

        if (valor > valorMaximo) {

            valorMaximo = valor;

            aulaMaxima = aula;

        }

    });

    if (tipoMapa === "temperature") {

        if (maxAula > 27) {
            aulasSobre27++;
        }

        if (maxAula > 30) {
            aulasSobre30++;
        }

    } else {

        if (maxAula >= 27) {
            aulasDI27++;
        }

        if (maxAula >= 29) {
            aulasDI29++;
        }

        if (maxAula >= 32) {
            aulasDI32++;
        }

    }

});

const mediaGlobal =
    contadorGlobal > 0
    ? sumaGlobal / contadorGlobal
    : 0;
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
    `;
html += `
<div class="mb-6 p-4 bg-slate-50 border rounded">

<h4 class="font-bold mb-2">
Resumen ejecutivo del día
</h4>

<p>
Aulas analizadas:
<strong>${aulas.length}</strong>
</p>
`;

if (tipoMapa === "temperature") {

    html += `
    <p>
    Temperatura media global:
    <strong>${mediaGlobal.toFixed(1)} °C</strong>
    </p>

    <p>
    Temperatura máxima:
    <strong>
    ${valorMaximo.toFixed(1)} °C
    (${aulaMaxima})
    </strong>
    </p>

    <p>
    Aulas con temperatura &gt;27 °C:
    <strong>${aulasSobre27}</strong>
    </p>

    <p>
    Aulas con temperatura &gt;30 °C:
    <strong>${aulasSobre30}</strong>
    </p>
    `;

} else {

    html += `
    <p>
    DI medio global:
    <strong>${mediaGlobal.toFixed(1)}</strong>
    </p>

    <p>
    DI máximo:
    <strong>
    ${valorMaximo.toFixed(1)}
    (${aulaMaxima})
    </strong>
    </p>

    <p>
    Aulas con DI ≥27:
    <strong>${aulasDI27}</strong>
    </p>

    <p>
    Aulas con DI ≥29:
    <strong>${aulasDI29}</strong>
    </p>

    <p>
    Aulas con DI ≥32:
    <strong>${aulasDI32}</strong>
    </p>
    `;

}

html += `</div>`;
    // =====================================
    // Leyenda
    // =====================================

    if (tipoMapa === "temperature") {

        html += `
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

    } else {

        html += `
        <div class="flex flex-wrap gap-4 mb-4 text-sm">

            <div class="flex items-center gap-2">
                <span class="di-confortable border px-3 py-1"></span>
                <span>&lt; 21</span>
            </div>

            <div class="flex items-center gap-2">
                <span class="di-ligero border px-3 py-1"></span>
                <span>21–24</span>
            </div>

            <div class="flex items-center gap-2">
                <span class="di-moderado border px-3 py-1"></span>
                <span>24–27</span>
            </div>

            <div class="flex items-center gap-2">
                <span class="di-severo border px-3 py-1"></span>
                <span>27–29</span>
            </div>

            <div class="flex items-center gap-2">
                <span class="di-intenso border px-3 py-1"></span>
                <span>29–32</span>
            </div>

            <div class="flex items-center gap-2">
                <span class="di-extremo border px-3 py-1"></span>
                <span>&gt; 32</span>
            </div>

                </div>

        <div class="mt-4 mb-6 overflow-x-auto">

        <table class="min-w-full border text-sm">

        <thead>
        <tr>
        <th>DI</th>
        <th>Interpretación</th>
        </tr>
        </thead>

        <tbody>

        <tr>
        <td>&lt; 21</td>
        <td>Confortable</td>
        </tr>

        <tr>
        <td>21 – 24</td>
        <td>Ligero disconfort</td>
        </tr>

        <tr>
        <td>24 – 27</td>
        <td>Disconfort moderado</td>
        </tr>

        <tr>
        <td>27 – 29</td>
        <td>Disconfort severo</td>
        </tr>

        <tr>
        <td>29 – 32</td>
        <td>Estrés térmico intenso</td>
        </tr>

        <tr>
        <td>&gt; 32</td>
        <td>Estrés térmico extremo</td>
        </tr>

        </tbody>

        </table>

        <p class="mt-3 text-sm text-slate-600">

        El Índice de Disconfort (DI) combina la temperatura y la humedad relativa para estimar el grado de incomodidad térmica percibida. La clasificación utilizada se basa en la interpretación clásica del Índice de Thom.

        </p>

        </div>
        `;

    }

    // =====================================
    // Tabla
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

            if (
                tipoMapa ===
                "temperature"
            ) {

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

                let clase = "";

                if (
                    tipoMapa ===
                    "temperature"
                ) {

                    if (media < 22) {

                        clase =
                            "temp-muy-frio";

                    } else if (
                        media < 25
                    ) {

                        clase =
                            "temp-confortable";

                    } else if (
                        media < 27
                    ) {

                        clase =
                            "temp-calido";

                    } else if (
                        media < 30
                    ) {

                        clase =
                            "temp-calor";

                    } else {

                        clase =
                            "temp-extremo";

                    }

                } else {

                    if (media < 21) {

                        clase =
                            "di-confortable";

                    } else if (
                        media < 24
                    ) {

                        clase =
                            "di-ligero";

                    } else if (
                        media < 27
                    ) {

                        clase =
                            "di-moderado";

                    } else if (
                        media < 29
                    ) {

                        clase =
                            "di-severo";

                    } else if (
                        media < 32
                    ) {

                        clase =
                            "di-intenso";

                    } else {

                        clase =
                            "di-extremo";

                    }

                }

                html += `
                <td class="border p-1 ${clase}">
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
