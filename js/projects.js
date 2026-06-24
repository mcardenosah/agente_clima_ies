// =====================================================
// Agente Clima IES v2.0
// projects.js
// Guardar proyecto JSON
// =====================================================

function saveProject() {

    if (
        !rawData ||
        Object.keys(rawData).length === 0
    ) {

        alert(
            "No hay datos cargados."
        );

        return;
    }

    let totalRegistros = 0;

    Object.values(rawData).forEach(
        registros => {

            totalRegistros +=
                registros.length;

        }
    );

    const project = {

        version: "2.0",

        createdBy:
            "Agente Clima IES",

        exportDate:
            new Date().toISOString(),

        metadata: {

            numAulas:
                Object.keys(rawData)
                    .length,

            aulas:
                Object.keys(rawData),

            numRegistros:
                totalRegistros

        },

        rawData,

        processedStats

    };

    const json =
        JSON.stringify(
            project,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const fecha =
        new Date()
            .toISOString()
            .split("T")[0];

    const enlace =
        document.createElement("a");

    enlace.href = url;

    enlace.download =
        `AgenteClimaIES_${fecha}.json`;

    document.body.appendChild(
        enlace
    );

    enlace.click();

    document.body.removeChild(
        enlace
    );

    URL.revokeObjectURL(
        url
    );

}
