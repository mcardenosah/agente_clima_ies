// =====================================================
// Agente Clima IES v1.0
// calculations.js
// Motor de cálculo termohigrométrico
// =====================================================

function calculateMedian(values) {

    if (!values.length) return 0;

    const sorted = [...values].sort((a, b) => a - b);

    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

// -----------------------------------------------------
// Clasificación de severidad
// -----------------------------------------------------

function calculateSeverity(eta27, porcentajeHRFuera) {

    if (eta27 === 0 && porcentajeHRFuera === 0) {
        return "Verde";
    }

    if (eta27 < 5 && porcentajeHRFuera < 5) {
        return "Amarillo";
    }

    if (eta27 < 20 && porcentajeHRFuera < 20) {
        return "Naranja";
    }

    return "Rojo";
}

// -----------------------------------------------------
// Procesamiento principal por aula
// -----------------------------------------------------

function processClassroomData(aula, registros) {

    if (!registros || registros.length < 2) {

        return {
            aula,
            estado: "No evaluable"
        };
    }

    // =====================================
    // Detectar intervalo típico de muestreo
    // =====================================

    const intervalos = [];

    for (let i = 0; i < registros.length - 1; i++) {

        const dtMin =
            (registros[i + 1].timestamp -
             registros[i].timestamp)
            /
            (1000 * 60);

        if (dtMin > 0) {
            intervalos.push(dtMin);
        }
    }

    const intervaloMediano =
        calculateMedian(intervalos);

    const umbralHueco =
        intervaloMediano * 3;

    // =====================================
    // Variables estadísticas
    // =====================================

    let horasEvaluadas = 0;

    let horasMas27 = 0;

    let eta27 = 0;

    let horasHRBaja = 0;

    let horasHRAlta = 0;

    let tMin = Infinity;
    let tMax = -Infinity;
    let tSum = 0;

    let hrMin = Infinity;
    let hrMax = -Infinity;
    let hrSum = 0;

    let intervalosValidos = 0;

    // =====================================
    // Recorrido temporal
    // =====================================

    for (let i = 0; i < registros.length - 1; i++) {

        const actual = registros[i];

        const siguiente = registros[i + 1];

        const dtMin =
            (siguiente.timestamp -
             actual.timestamp)
            /
            (1000 * 60);

        if (dtMin > umbralHueco) {
            continue;
        }

        const dtHoras = dtMin / 60;

        intervalosValidos++;

        horasEvaluadas += dtHoras;

        // -----------------
        // Temperatura
        // -----------------

        if (actual.temp > 27) {

            horasMas27 += dtHoras;

            eta27 +=
                (actual.temp - 27)
                *
                dtHoras;
        }

        // -----------------
        // Humedad
        // -----------------

        if (actual.hum < 30) {
            horasHRBaja += dtHoras;
        }

        if (actual.hum > 70) {
            horasHRAlta += dtHoras;
        }

        // -----------------
        // Estadísticos
        // -----------------

        if (actual.temp < tMin)
            tMin = actual.temp;

        if (actual.temp > tMax)
            tMax = actual.temp;

        if (actual.hum < hrMin)
            hrMin = actual.hum;

        if (actual.hum > hrMax)
            hrMax = actual.hum;

        tSum += actual.temp;
        hrSum += actual.hum;
    }

    // =====================================
    // Último registro
    // =====================================

    const ultimo =
        registros[registros.length - 1];

    if (ultimo.temp < tMin)
        tMin = ultimo.temp;

    if (ultimo.temp > tMax)
        tMax = ultimo.temp;

    if (ultimo.hum < hrMin)
        hrMin = ultimo.hum;

    if (ultimo.hum > hrMax)
        hrMax = ultimo.hum;

    tSum += ultimo.temp;
    hrSum += ultimo.hum;

    // =====================================
    // Medias
    // =====================================

    const tMedia =
        tSum / registros.length;

    const hrMedia =
        hrSum / registros.length;

    // =====================================
    // Porcentajes
    // =====================================

    const porcentajeSobre27 =
        horasEvaluadas > 0
            ?
            (horasMas27 /
                horasEvaluadas)
            *
            100
            :
            0;

    const porcentajeHRFueraRango =
        horasEvaluadas > 0
            ?
            (
                (
                    horasHRBaja +
                    horasHRAlta
                )
                /
                horasEvaluadas
            )
            *
            100
            :
            0;

    // =====================================
    // Cumplimiento RD486
    // =====================================

    const cumpleTemperatura =
        horasMas27 === 0;

    const cumpleHumedad =
        horasHRBaja === 0
        &&
        horasHRAlta === 0;

    const cumpleRD =
        cumpleTemperatura
        &&
        cumpleHumedad;

    const severidad =
        calculateSeverity(
            eta27,
            porcentajeHRFueraRango
        );

    return {

        aula,

        estado: "Evaluable",

        registros:
            registros.length,

        intervaloMediano,

        umbralHueco,

        horasEvaluadas,

        tMin,
        tMedia,
        tMax,

        horasMas27,

        porcentajeSobre27,

        eta27,

        hrMin,
        hrMedia,
        hrMax,

        horasHRBaja,
        horasHRAlta,

        porcentajeHRFueraRango,

        cumpleTemperatura,
        cumpleHumedad,
        cumpleRD,

        severidad
    };
}
