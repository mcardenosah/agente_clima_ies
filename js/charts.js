let chartETA = null;
let chartHoras27 = null;
let chartHoras17 = null;
let chartHR = null;
let chartEvolution = null;

function destroyChart(chart) {

    if (chart) {
        chart.destroy();
    }
}

function createCharts() {

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
