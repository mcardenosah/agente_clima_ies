// =====================================================
// Agente Clima IES v1.0
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
            type: 'jpeg',
            quality: 0.98
        },

        html2canvas: {
            scale: 2
        },

        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape'
        }
    };

    html2pdf()
        .set(options)
        .from(element)
        .save();
}
