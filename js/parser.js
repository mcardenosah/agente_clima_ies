// =====================================================
// Agente Clima IES v1.0
// parser.js
// Lectura e importación de CSV
// =====================================================

let rawData = {};
let processedStats = [];

// -----------------------------------------------------
// Configurar zona de carga
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const dropZone =
        document.getElementById("drop-zone");

    const fileInput =
        document.getElementById("file-input");

    dropZone.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {

        if (e.target.files.length > 0) {

            processFiles(
                Array.from(e.target.files)
            );
        }
    });

});

// -----------------------------------------------------
// Procesar múltiples archivos
// -----------------------------------------------------

async function processFiles(files) {

    document
        .getElementById("processing-status")
        .classList.remove("hidden");

    rawData = {};
    processedStats = [];

    let procesados = 0;

    for (const file of files) {

        Papa.parse(file, {

            skipEmptyLines: true,

            complete: function(results) {

                const aula =
                    file.name.split("_")[0];

                const registros =
                    parseCSVData(results.data);

                rawData[aula] =
                    registros;

                procesados++;

                if (procesados === files.length) {

                    finishProcessing();
                }
            }

        });

    }
}

// -----------------------------------------------------
// Convertir CSV a registros válidos
// -----------------------------------------------------

function parseCSVData(rows) {

    const registros = [];

    rows.forEach(row => {

        if (!row || row.length < 3) {
            return;
        }

        const fechaTexto =
            row[0]?.trim();

        const temperatura =
            parseFloat(row[1]);

        const humedad =
            parseFloat(row[2]);

        const fecha =
            new Date(fechaTexto);

        if (
            isNaN(fecha.getTime())
        ) {
            return;
        }

        if (
            isNaN(temperatura)
            ||
            isNaN(humedad)
        ) {
            return;
        }

        registros.push({

            timestamp: fecha,

            temp: temperatura,

            hum: humedad

        });

    });

    registros.sort(
        (a, b) =>
        a.timestamp - b.timestamp
    );

    return registros;
}

// -----------------------------------------------------
// Finalizar procesamiento
// -----------------------------------------------------

function finishProcessing() {

    processedStats = [];

    for (
        const [aula, registros]
        of Object.entries(rawData)
    ) {

        const stats =
            processClassroomData(
                aula,
                registros
            );

        processedStats.push(stats);
    }

    processedStats.sort(
        (a, b) =>
        (b.eta27 || 0)
        -
        (a.eta27 || 0)
    );

    updateSummary();

    populateTable();

    createCharts();

    document
        .getElementById("processing-status")
        .classList.add("hidden");

    document
        .getElementById("results-summary")
        .classList.remove("hidden");

    document
        .getElementById("btn-informe")
        .disabled = false;

    document
        .getElementById("btn-dashboard")
        .disabled = false;
}
