// =====================================================
// Agente Clima IES v1.9
// pdf.js
// Exportación PDF
// =====================================================

function exportToPDF(elementId, fileName) {

    const element =
        document.getElementById(elementId);

    const options = {

        margin: 10,

        filename:
            `${fileName}.pdf`,

        image: {
            type: "jpeg",
            quality: 0.98
        },

        html2canvas: {
            scale: 2
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "landscape"
        }

    };

    html2pdf()
        .set(options)
        .from(element)
        .save();

}

// =====================================
// Exportación específica de mapas
// =====================================

function exportHeatmapPDF() {

    const heatmap =
        document.getElementById(
            "temperatureHeatmap"
        );

    if (!heatmap) {
        return;
    }

    const fecha =
        document.getElementById(
            "daySelector"
        )?.value || "sin_fecha";

    const tipoMapa =
        document.getElementById(
            "mapTypeSelector"
        )?.value || "temperature";

    const titulo =
        tipoMapa === "di"
        ? "Mapa_DI"
        : "Mapa_Temperatura";

    const contenedorTemporal =
        document.createElement("div");

    contenedorTemporal.style.padding =
        "20px";

    contenedorTemporal.innerHTML = `

        <h1 style="font-size:24px;margin-bottom:10px;">
            Agente Clima IES
        </h1>

        ${heatmap.innerHTML}

    `;

    const options = {

        margin: 10,

        filename:
            `${titulo}_${fecha}.pdf`,

        image: {
            type: "jpeg",
            quality: 0.98
        },

        html2canvas: {
            scale: 2
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "landscape"
        }

    };

    html2pdf()
        .set(options)
        .from(contenedorTemporal)
        .save();

}
