// =====================================================
// Agente Clima IES v1.0
// charts.js
// Gráficos y dashboard
// =====================================================

let chartETA = null;
let chartHoras27 = null;
let chartHR = null;
let chartEvolution = null;

// -----------------------------------------------------
// Crear todos los gráficos
// -----------------------------------------------------

function createCharts() {

    createETAChart();

    createHoras27Chart();

    createHRChart();

    createEvolutionChart();
}

// -----------------------------------------------------
// Destruir gráfico previo
// -----------------------------------------------------

function destroyChart(chart) {

    if (chart) {
        chart.destroy();
    }
}

// -----------------------------------------------------
// ETA27
// -----------------------------------------------------

function createETAChart() {

    destroyChart(chartETA);

    const datos =
        processedStats.filter(
            s => s.estado === "Evaluable"
        );

    chartETA = new Chart(

        document.getElementById("chartETA"),

        {
            type: "bar",

            data: {

                labels:
                    datos.map(
                        s => s.aula
                    ),

                datasets: [

                    {
                        label: "ETA27 (°C·h)",

                        data:
                            datos.map(
                                s => s.eta27
                            )
                    }
                ]
            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: true
                    }
                }
            }
        }
    );
}

// -----------------------------------------------------
// Horas > 27°C
// -----------------------------------------------------

function createHoras27Chart() {

    destroyChart(chartHoras27);

    const datos =
        processedStats.filter(
            s => s.estado === "Evaluable"
        );

    chartHoras27 = new Chart(

        document.getElementById("chartHoras27"),

        {
            type: "bar",

            data: {

                labels:
                    datos.map(
                        s => s.aula
                    ),

                datasets: [

                    {
                        label: "Horas >27°C",

                        data:
                            datos.map(
                                s => s.horasMas27
                            )
                    }
                ]
            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: true
                    }
                }
            }
        }
    );
}

// -----------------------------------------------------
// Humedad fuera de rango
// -----------------------------------------------------

function createHRChart() {

    destroyChart(chartHR);

    const datos =
        processedStats.filter(
            s => s.estado === "Evaluable"
        );

    chartHR = new Chart(

        document.getElementById("chartHR"),

        {
            type: "bar",

            data: {

                labels:
                    datos.map(
                        s => s.aula
                    ),

                datasets: [

                    {
                        label:
                            "% HR fuera de rango",

                        data:
                            datos.map(
                                s =>
                                s.porcentajeHRFueraRango
                            )
                    }
                ]
            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: true
                    }
                },

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

// -----------------------------------------------------
// Evolución temporal
// -----------------------------------------------------

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

                interaction: {

                    mode: "nearest",

                    intersect: false
                },

                scales: {

                    x: {

                        type: "time",

                        time: {

                            tooltipFormat:
                                "dd/MM/yyyy HH:mm"
                        },

                        title: {

                            display: true,

                            text: "Fecha"
                        }
                    },

                    y: {

                        title: {

                            display: true,

                            text: "Temperatura (°C)"
                        }
                    }
                }
            }
        }
    );
}
