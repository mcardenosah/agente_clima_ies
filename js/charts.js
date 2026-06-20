let chartETA = null;
let chartHoras27 = null;
let chartHoras17 = null;
let chartHR = null;
let chartEvolution = null;
let chartDI = null;
let chartVulnerability = null;
function destroyChart(chart) {

    if (chart) {
        chart.destroy();
    }
}

function createCharts() {

    createSummary();

    createDIChart();

    createVulnerabilityChart();

    createETAChart();

    createHoras27Chart();

    createHoras17Chart();

    createHRChart();

    createEvolutionChart();
}

function getValidStats() {

    return processedStats.filter(
        s => s.estado === "Evaluable"
    );
}

function createETAChart() {

    destroyChart(chartETA);

    const datos = getValidStats();

    chartETA = new Chart(

        document.getElementById("chartETA"),

        {
            type: "bar",

            data: {

                labels:
                    datos.map(
                        s => s.aula
                    ),

                datasets: [{
                    label: "ETA27",

                    data:
                        datos.map(
                            s => s.eta27
                        )
                }]
            }
        }
    );
}

function createHoras27Chart() {

    destroyChart(chartHoras27);

    const datos = getValidStats();

    chartHoras27 = new Chart(

        document.getElementById(
            "chartHoras27"
        ),

        {
            type: "bar",

            data: {

                labels:
                    datos.map(
                        s => s.aula
                    ),

                datasets: [{

                    label:
                        "Horas >27°C",

                    data:
                        datos.map(
                            s => s.horasMas27
                        )
                }]
            }
        }
    );
}

function createHoras17Chart() {

    destroyChart(chartHoras17);

    const datos = getValidStats();

    chartHoras17 = new Chart(

        document.getElementById(
            "chartHoras17"
        ),

        {
            type: "bar",

            data: {

                labels:
                    datos.map(
                        s => s.aula
                    ),

                datasets: [{

                    label:
                        "Horas <17°C",

                    data:
                        datos.map(
                            s => s.horasMenos17
                        )
                }]
            }
        }
    );
}

function createHRChart() {

    destroyChart(chartHR);

    const datos = getValidStats();

    chartHR = new Chart(

        document.getElementById("chartHR"),

        {
            type: "bar",

            data: {

                labels:
                    datos.map(
                        s => s.aula
                    ),

                datasets: [{

                    label:
                        "% HR fuera rango",

                    data:
                        datos.map(
                            s =>
                            s.porcentajeHRFueraRango
                        )
                }]
            },

            options: {

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100
                    }
                }
            }
        }
    );
}

function createEvolutionChart() {

    destroyChart(chartEvolution);

    const datasets = [];

    Object.entries(rawData).forEach(

        ([aula, registros]) => {

            datasets.push({

                label: aula,

                data:

                registros.map(
                    r => ({
                        x: r.timestamp,
                        y: r.temp
                    })
                ),

                tension: 0.2
            });
        }
    );

    chartEvolution = new Chart(

        document.getElementById(
            "chartEvolution"
        ),

        {
            type: "line",

            data: {
                datasets
            },

            options: {

                responsive: true,

                scales: {

                    x: {

                        type: "time"
                    }
                }
            }
        }
    );
}
function createSummary() {

    const datos = getValidStats();

    if (!datos.length) return;

    const cumplen =
        datos.filter(
            s => s.cumpleRD
        ).length;

    const incumplen =
        datos.length - cumplen;

    const aulaCritica =
        [...datos]
        .sort(
            (a, b) =>
            b.eta27 - a.eta27
        )[0];

    const tempMax =
        Math.max(
            ...datos.map(
                s => s.tMax
            )
        );

    document
        .getElementById(
            "dashboard-summary"
        )
        .innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><strong>Aulas analizadas:</strong> ${datos.length}</div>
            <div><strong>Cumplen RD486:</strong> ${cumplen}</div>
            <div><strong>Incumplen RD486:</strong> ${incumplen}</div>
            <div><strong>Aula más vulnerable:</strong> ${aulaCritica.aula}</div>
            <div><strong>ETA27 máximo:</strong> ${aulaCritica.eta27.toFixed(1)}</div>
            <div><strong>Temperatura máxima:</strong> ${tempMax.toFixed(1)} °C</div>
        </div>
        `;
}

function createDIChart() {

    destroyChart(chartDI);

    const datos = getValidStats();

    chartDI = new Chart(

        document.getElementById(
            "chartDI"
        ),

        {
            type: "bar",

            data: {

                labels:
                    datos.map(
                        s => s.aula
                    ),

                datasets: [{
                    label:
                        "DI medio",

                    data:
                        datos.map(
                            s => s.diMedia
                        )
                }]
            }
        }
    );
}

function createVulnerabilityChart() {

    destroyChart(
        chartVulnerability
    );

    const datos = getValidStats();

    const vulnerabilidad =
        datos.map(s => {

            const indice =
                (s.eta27 * 2)
                +
                s.porcentajeSobre27;

            return {
                aula: s.aula,
                indice
            };
        });

    chartVulnerability =
        new Chart(

        document.getElementById(
            "chartVulnerability"
        ),

        {
            type: "bar",

            data: {

                labels:
                    vulnerabilidad.map(
                        v => v.aula
                    ),

                datasets: [{

                    label:
                        "Índice de vulnerabilidad",

                    data:
                        vulnerabilidad.map(
                            v => v.indice
                        )
                }]
            }
        });
}
