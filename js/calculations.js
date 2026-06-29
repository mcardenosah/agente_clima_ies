// =====================================================
// Agente Clima IES v1.1
// calculations.js
// Motor de cálculo termohigrométrico
// =====================================================

function calculateMedian(values) {


if (!values.length) return 0;

const sorted = [...values].sort((a, b) => a - b);

const middle = Math.floor(sorted.length / 2);

if (sorted.length % 2 === 0) {
    return (
        sorted[middle - 1] +
        sorted[middle]
    ) / 2;
}

return sorted[middle];


}

// -----------------------------------------------------
// Índice de Disconfort de Thom
// -----------------------------------------------------

function calculateThomIndex(temperatura, humedad) {


return (
    temperatura -
    (
        0.55 -
        0.0055 * humedad
    ) *
    (
        temperatura - 14.5
    )
);


}

// -----------------------------------------------------
// Clasificación de confort
// -----------------------------------------------------

function classifyThom(di) {


if (di < 21) {
    return "Confortable";
}

if (di < 24) {
    return "Ligero disconfort";
}

if (di < 27) {
    return "Disconfort";
}

return "Estrés térmico";


}

// -----------------------------------------------------
// Clasificación de severidad
// -----------------------------------------------------

function calculateSeverity(
eta27,
porcentajeBajo17,
porcentajeHRFuera
) {

const impacto =
    porcentajeBajo17 +
    porcentajeHRFuera;

if (
    eta27 === 0 &&
    impacto === 0
) {
    return "Verde";
}

if (
    eta27 < 5 &&
    impacto < 5
) {
    return "Amarillo";
}

if (
    eta27 < 20 &&
    impacto < 20
) {
    return "Naranja";
}

return "Rojo";


}

// -----------------------------------------------------
// Procesamiento principal
// -----------------------------------------------------

function processClassroomData(
aula,
registros
) {


if (
    !registros ||
    registros.length < 2
) {

    return {
        aula,
        estado: "No evaluable"
    };
}

// =====================================
// Intervalo típico
// =====================================

const intervalos = [];

for (
    let i = 0;
    i < registros.length - 1;
    i++
) {

    const dtMin =
        (
            registros[i + 1].timestamp -
            registros[i].timestamp
        ) /
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
// Variables
// =====================================

let horasEvaluadas = 0;

let horasMenos17 = 0;
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

let diMin = Infinity;
let diMax = -Infinity;
let diSum = 0;
let horasDI24 = 0;
let horasDI27 = 0;
// =====================================
// Recorrido temporal
// =====================================

for (
    let i = 0;
    i < registros.length - 1;
    i++
) {

    const actual =
        registros[i];

    const siguiente =
        registros[i + 1];

    const dtMin =
        (
            siguiente.timestamp -
            actual.timestamp
        ) /
        (1000 * 60);

    if (dtMin > umbralHueco) {
        continue;
    }

    const dtHoras =
        dtMin / 60;

    horasEvaluadas += dtHoras;

    // Temperatura

    if (actual.temp < 17) {
        horasMenos17 += dtHoras;
    }

    if (actual.temp > 27) {

        horasMas27 += dtHoras;

        eta27 +=
            (
                actual.temp - 27
            ) *
            dtHoras;
    }

    // Humedad

    if (actual.hum < 30) {
        horasHRBaja += dtHoras;
    }

    if (actual.hum > 70) {
        horasHRAlta += dtHoras;
    }

    // Estadísticos

    tMin = Math.min(tMin, actual.temp);
    tMax = Math.max(tMax, actual.temp);

    hrMin = Math.min(hrMin, actual.hum);
    hrMax = Math.max(hrMax, actual.hum);

    tSum += actual.temp;
    hrSum += actual.hum;

    // Índice de Thom

    const di =
        calculateThomIndex(
            actual.temp,
            actual.hum
        );
if (di > 24) {
    horasDI24 += dtHoras;
}

if (di > 27) {
    horasDI27 += dtHoras;
}
    diMin = Math.min(diMin, di);
    diMax = Math.max(diMax, di);

    diSum += di;
}

// =====================================
// Último registro
// =====================================

const ultimo =
    registros[
        registros.length - 1
    ];

tMin = Math.min(tMin, ultimo.temp);
tMax = Math.max(tMax, ultimo.temp);

hrMin = Math.min(hrMin, ultimo.hum);
hrMax = Math.max(hrMax, ultimo.hum);

tSum += ultimo.temp;
hrSum += ultimo.hum;

const diUltimo =
    calculateThomIndex(
        ultimo.temp,
        ultimo.hum
    );

diMin = Math.min(diMin, diUltimo);
diMax = Math.max(diMax, diUltimo);

diSum += diUltimo;

// =====================================
// Medias
// =====================================

const tMedia =
    tSum / registros.length;

const hrMedia =
    hrSum / registros.length;

const diMedia =
    diSum / registros.length;

// =====================================
// Porcentajes
// =====================================

const porcentajeBajo17 =
    horasEvaluadas > 0
    ? (horasMenos17 / horasEvaluadas) * 100
    : 0;

const porcentajeSobre27 =
    horasEvaluadas > 0
    ? (horasMas27 / horasEvaluadas) * 100
    : 0;

const porcentajeHRFueraRango =
    horasEvaluadas > 0
    ? (
        (
            horasHRBaja +
            horasHRAlta
        ) /
        horasEvaluadas
    ) * 100
    : 0;

const porcentajeDI24 =
    horasEvaluadas > 0
    ? (
        horasDI24 /
        horasEvaluadas
    ) * 100
    : 0;

const porcentajeDI27 =
    horasEvaluadas > 0
    ? (
        horasDI27 /
        horasEvaluadas
    ) * 100
    : 0;

// =====================================
// Cumplimiento RD486
// =====================================

const cumpleTemperatura =
    horasMenos17 === 0 &&
    horasMas27 === 0;

const cumpleHumedad =
    horasHRBaja === 0 &&
    horasHRAlta === 0;

const cumpleRD =
    cumpleTemperatura &&
    cumpleHumedad;

const severidad =
    calculateSeverity(
        eta27,
        porcentajeBajo17,
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

    horasMenos17,

    porcentajeBajo17,

    horasMas27,

    porcentajeSobre27,

    eta27,

    hrMin,
    hrMedia,
    hrMax,

    horasHRBaja,

    horasHRAlta,

    porcentajeHRFueraRango,

    diMin,

    diMedia,

    diMax,

    horasDI24,

    horasDI27,

    porcentajeDI24,

    porcentajeDI27,

    categoriaConfort:
        classifyThom(
            diMedia
        ),

    cumpleTemperatura,

    cumpleHumedad,

    cumpleRD,

    severidad
};

}

// commit test
// =====================================================
// HEAT INDEX
// Conversión de unidades
// =====================================================

function celsiusToFahrenheit(tempC) {

    return (tempC * 9 / 5) + 32;

}

function fahrenheitToCelsius(tempF) {

    return (tempF - 32) * 5 / 9;

}
