// =====================================================
// Agente Clima IES
// heatmaps.js
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
const fechas = new Set();

aulas.forEach(aula => {

    rawData[aula].forEach(r => {

        const fecha =
            r.timestamp
            .toISOString()
            .split("T")[0];

        fechas.add(fecha);

    });

});

container.innerHTML +=
    "<h3>Fechas detectadas</h3>";

fechas.forEach(fecha => {

    container.innerHTML +=
        `<p>${fecha}</p>`;

});
    const aulas =
        Object.keys(rawData);

    if (!aulas.length) {
        return;
    }
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

console.log(
    "Fechas detectadas:",
    [...fechas]
);
    let html =
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

        html +=
            `<td class='border p-1 font-bold'>
                ${aula}
            </td>`;

        const mediasHora = {};

        rawData[aula].forEach(r => {

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
                        (a,b) => a+b,
                        0
                    )
                    /
                    mediasHora[hora]
                    .length;

                html +=
                    `<td class='border p-1'>
                        ${media.toFixed(1)}
                    </td>`;

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
