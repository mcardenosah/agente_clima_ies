// =====================================================
// Agente Clima IES v1.0
// parser.js
// Lectura e importación de CSV
// =====================================================

let rawData = {};
let processedStats = [];

// -----------------------------------------------------
// Configuración de la interfaz
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const dropZone =
        document.getElementById("drop-zone");

    const fileInput =
        document.getElementById("file-input");

    // -----------------------------------------
    // Selección mediante clic
    // -----------------------------------------

    dropZone.addEventListener("click", () => {

        fileInput.click();

    });

    // -----------------------------------------
    // Selección mediante explorador
    // -----------------------------------------

    fileInput.addEventListener("change", (e) => {

        if (e.target.files.length > 0) {

            processFiles(
                Array.from(e.target.files)
            );
        }
    });

    // -----------------------------------------
    // Drag & Drop
    // -----------------------------------------

    dropZone.addEventListener(
        "dragover",
        (e) => {

            e.preventDefault();

            dropZone.classList.add(
                "drag-active"
            );
        }
    );

    dropZone.addEventListener(
        "dragleave",
        () => {

            dropZone.classList.remove(
                "drag-active"
            );
        }
    );

    dropZone.addEventListener(
        "drop",
        (e) => {

            e.preventDefault();

            dropZone.classList.remove(
                "drag-active"
            );

            const files =
                Array.from(
                    e.dataTransfer.files
                );

            processFiles(files);
        }
    );
});

// -----------------------------------------------------
// Procesamiento de archivos
// -----------------------------------------------------

async function processFiles(files) {

    document
        .getElementById("processing-status")
        .classList.remove("hidden");

    rawData = {};

    processedStats = [];

    let procesados = 0;

    files.forEach(file => {

        Papa.parse(file, {

            skipEmptyLines: true,

            complete: function(results) {

                try {

                    const aula =
                        file.name.split("_")[0];

                    const registros =
                        parseCSVData(
                            results.data
                        );

                    rawData[aula] =
                        registros;

                } catch (error) {

                    console.error(
                        "Error procesando archivo:",
                        file.name,
                        error
                    );
                }

                procesados++;

                if (
                    procesados === files.length
                ) {

                    finishProcessing();
                }
            },

            error: function(error) {

                console.error(
                    "Error leyendo CSV:",
                    error
                );

                procesados++;

                if (
                    procesados === files.length
                ) {

                    finishProcessing();
                }
            }
        });
    });
}

// -----------------------------------------------------
// Conversión CSV → registros
// -----------------------------------------------------

function parseCSVData(rows) {

    const registros = [];

    rows.forEach(row => {

        if (
            !row ||
            row.length < 3
        ) {
            return;
        }

        const fechaTexto =
            String(row[0]).trim();

        const temperatura =
            parseFloat(row[1]);

        const humedad =
            parseFloat(row[2]);

        const fecha =
            new Date(fechaTexto);

        // Ignorar cabeceras
        if (
            isNaN(
                fecha.getTime()
            )
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
            a.timestamp -
            b.timestamp
    );

    return registros;
}

// -----------------------------------------------------
// Finalización
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

    console.log(
        "Aulas procesadas:",
        processedStats
    );

    updateSummary();

    populateTable();

    createCharts();

    document
        .getElementById(
            "processing-status"
        )
        .classList.add("hidden");

    document
        .getElementById(
            "results-summary"
        )
        .classList.remove("hidden");

    document
        .getElementById(
            "btn-informe"
        )
        .disabled = false;

    document
        .getElementById(
            "btn-dashboard"
        )
        .disabled = false;
}
