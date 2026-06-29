// =====================================================
// Agente Clima IES
// heatindex.js
//
// Adaptación JavaScript de la implementación oficial
// de Lu & Romps (2022)
// https://github.com/davidromps/heatindex
//
// Todas las ecuaciones mantienen exactamente la
// formulación física del código original.
//
// La interfaz pública trabaja en °C y %HR.
//
// Internamente el algoritmo trabaja en Kelvin.
// =====================================================



// =====================================================
// Conversión de unidades
// =====================================================

function celsiusToKelvin(t){

    return t + 273.15;

}

function kelvinToCelsius(t){

    return t - 273.15;

}

function rhToFraction(hr){

    return hr / 100;

}



// =====================================================
// Constantes termodinámicas
// =====================================================

const TTRIP = 273.16;

const PTRIP = 611.65;

const E0V = 2.3740e6;

const E0S = 0.3337e6;

const RGASA = 287.04;

const RGASV = 461.0;

const CVA = 719.0;

const CVV = 1418.0;

const CVL = 4119.0;

const CVS = 1861.0;

const CPA = CVA + RGASA;

const CPV = CVV + RGASV;



// =====================================================
// Constantes fisiológicas
// =====================================================

const Q = 180.0;

const PHI_SALT = 0.9;

const TC = 310.0;

const HC = 12.3;

const ZA = 60.6 / HC;

const PA0 = 1600.0;



// =====================================================
// Calores latentes
// =====================================================

function Le(T){

    return E0V

        +

        (CVV - CVL)

        *

        (T - TTRIP)

        +

        RGASV * T;

}



function Lm(T){

    return E0S

        +

        (CVL - CVS)

        *

        (T - TTRIP);

}



// =====================================================
// Presión de vapor de saturación
// Adaptación directa de thermo.cpp
// =====================================================

// -----------------------------------------------------
// Saturación sobre agua líquida
// -----------------------------------------------------

function pvstarl(T){

    if(T <= 0){

        return 0;

    }

    return PTRIP

        *

        Math.pow(

            T / TTRIP,

            (CPV - CVL) / RGASV

        )

        *

        Math.exp(

            (

                E0V

                -

                (CVV - CVL) * TTRIP

            )

            /

            RGASV

            *

            (

                1 / TTRIP

                -

                1 / T

            )

        );

}



// -----------------------------------------------------
// Saturación sobre hielo
// -----------------------------------------------------

function pvstars(T){

    if(T <= 0){

        return 0;

    }

    return PTRIP

        *

        Math.pow(

            T / TTRIP,

            (CPV - CVS) / RGASV

        )

        *

        Math.exp(

            (

                E0V

                +

                E0S

                -

                (CVV - CVS) * TTRIP

            )

            /

            RGASV

            *

            (

                1 / TTRIP

                -

                1 / T

            )

        );

}



// -----------------------------------------------------
// Función oficial utilizada por Heat Index
// -----------------------------------------------------

function pvstar(T){

    if(T < TTRIP){

        return pvstars(T);

    }

    return pvstarl(T);

}



// =====================================================
// Solver de Brent
// Adaptación directa de solve.cpp
// =====================================================

function solve(f,a,b,tol=1e-8,maxIter=100){

    let fa=f(a);
    let fb=f(b);

    if(fa*fb>=0){

        throw new Error(
            "Root not bracketed."
        );

    }

    return solveCore(
        f,
        a,
        b,
        fa,
        fb,
        tol,
        maxIter
    );

}


function solveCore(
    f,
    a,
    b,
    fa,
    fb,
    tol,
    maxIter
){

    if(Math.abs(fa)<Math.abs(fb)){

        [a,b]=[b,a];
        [fa,fb]=[fb,fa];

    }

    let c=a;
    let fc=fa;

    let s=b;

    let d=b-a;

    let mflag=true;

    for(
        let i=0;
        i<maxIter;
        i++
    ){

        if(
            fa!==fc &&
            fb!==fc
        ){

            s=

            a*fb*fc/

            ((fa-fb)*(fa-fc))

            +

            b*fa*fc/

            ((fb-fa)*(fb-fc))

            +

            c*fa*fb/

            ((fc-fa)*(fc-fb));

        }

        else{

            s=

            b

            -

            fb

            *

            (b-a)

            /

            (fb-fa);

        }


        const condicion=

        !(
            (
                s>(3*a+b)/4 &&
                s<b
            )

            ||

            (

                s<(3*a+b)/4 &&
                s>b

            )

        )

        ||

        (

            mflag &&
            Math.abs(s-b)>=Math.abs(b-c)/2

        )

        ||

        (

            !mflag &&
            Math.abs(s-b)>=Math.abs(c-d)/2

        );


        if(condicion){

            s=(a+b)/2;

            mflag=true;

        }

        else{

            mflag=false;

        }

        const fs=f(s);

        d=c;

        c=b;

        fc=fb;

        if(fa*fs<0){

            b=s;

            fb=fs;

        }

        else{

            a=s;

            fa=fs;

        }

        if(

            Math.abs(fa)

            <

            Math.abs(fb)

        ){

            [a,b]=[b,a];

            [fa,fb]=[fb,fa];

        }

        if(

            Math.abs(b-a)

            <

            tol

        ){

            return b;

        }

    }

    throw new Error(
        "Maximum iterations reached."
    );

}


// =====================================================
// Modelo fisiológico
// Adaptación directa de heatindex.cpp
// =====================================================


// -----------------------------------------------------
// Pérdida respiratoria de calor
// -----------------------------------------------------

function Qv(Ta, Pa){

    const p = 1.013e5;

    const eta = 1.43e-6;

    const L = 2417405.2;

    return (

        eta

        *

        Q

        *

        (

            CPA * (TC - Ta)

            +

            L

            *

            RGASA

            /

            (p * RGASV)

            *

            (PC - Pa)

        )

    );

}



// -----------------------------------------------------
// Resistencia evaporativa de la piel
// -----------------------------------------------------

function Zs(Rs){

    return 6.0e8

        *

        Math.pow(Rs,5);

}



// -----------------------------------------------------
// Resistencia térmica piel-aire
// -----------------------------------------------------

function Ra(T1,T2){

    const epsilon = 0.97;

    const phiRad = 0.80;

    const sigma = 5.67e-8;

    const hr =

        epsilon

        *

        phiRad

        *

        sigma

        *

        (

            T1*T1

            +

            T2*T2

        )

        *

        (

            T1

            +

            T2

        );

    return 1/(HC+hr);

}



// -----------------------------------------------------
// Inicialización de PC
// (debe hacerse después de definir pvstar())
// -----------------------------------------------------

PC = PHI_SALT * pvstar(TC);




// =====================================================
// Modelo fisiológico
// =====================================================

function physiology(T,rh){

    if(T<=0){

        throw new Error(

            "Temperature must be positive."

        );

    }

    if(rh<0 || rh>1){

        throw new Error(

            "Relative humidity must be between 0 and 1."

        );

    }



    const Ta = T;

    const Pa = rh * pvstar(T);



    let CdTcdt =

        Q

        -

        Qv(Ta,Pa)

        -

        (TC-Ta)/Ra(TC,Ta)

        -

        (PC-Pa)/ZA;



    let Rs = 0;



    if(CdTcdt<0){

        CdTcdt = 0;

        const respiracion =

            Q-Qv(Ta,Pa);



        const f = function(Ts){

            const RsLocal =

                (TC-Ts)/respiracion;



            const evaporacion =

                Math.min(

                    (PC-Pa)

                    /

                    (

                        Zs(RsLocal)

                        +

                        ZA

                    ),

                    (

                        PHI_SALT

                        *

                        pvstar(Ts)

                        -

                        Pa

                    )

                    /

                    ZA

                );



            return (

                (Ts-Ta)

                /

                Ra(Ts,Ta)

                +

                evaporacion

                -

                respiracion

            );

        };



        const Ts = solve(

            f,

            0,

            TC,

            1e-10,

            100

        );



        Rs =

            (TC-Ts)

            /

            respiracion;

    }



    return {

        Rs,

        CdTcdt

    };

}

// =====================================================
// Heat Index oficial de Lu & Romps
// =====================================================

function heatIndexKelvin(T,rh){

    if(Number.isNaN(T) || Number.isNaN(rh)){

        return NaN;

    }

    const physio = physiology(T,rh);

    const Rs = physio.Rs;

    const CdTcdt = physio.CdTcdt;

    // -------------------------------------------------
    // Región II
    // -------------------------------------------------

    if(Rs>0){

        const f = function(Ta){

            const Pa = Math.min(

                PA0,

                pvstar(Ta)

            );

            const Ts =

                TC

                -

                Rs

                *

                (

                    Q

                    -

                    Qv(Ta,Pa)

                );

            const Ps = Math.min(

                (

                    Zs(Rs)

                    *

                    Pa

                    +

                    ZA

                    *

                    PC

                )

                /

                (

                    Zs(Rs)

                    +

                    ZA

                ),

                PHI_SALT

                *

                pvstar(Ts)

            );

            return (

                Q

                -

                Qv(Ta,Pa)

                -

                (Ts-Ta)/Ra(Ts,Ta)

                -

                (Ps-Pa)/ZA

            );

        };

        return solve(

            f,

            0,

            345,

            1e-8,

            100

        );

    }

    // -------------------------------------------------
    // Regiones III-IV-V-VI
    // -------------------------------------------------

    const f = function(Ta){

        const Pa = Math.min(

            PA0,

            pvstar(Ta)

        );

        return (

            Q

            -

            Qv(Ta,Pa)

            -

            (TC-Ta)/Ra(TC,Ta)

            -

            (PC-Pa)/ZA

            -

            CdTcdt

        );

    };

    return solve(

        f,

        340,

        T+3500,

        1e-8,

        100

    );

}



// =====================================================
// Interfaz pública
// =====================================================

function calculateHeatIndex(

    temperaturaC,

    humedad

){

    const T =

        celsiusToKelvin(

            temperaturaC

        );

    const rh =

        rhToFraction(

            humedad

        );

    const HI =

        heatIndexKelvin(

            T,

            rh

        );

    return kelvinToCelsius(HI);

}

// =====================================================
// Clasificación Heat Index
// Agente Clima IES
//
// Basada en:
// - Steadman (1979)
// - Lu & Romps (2022)
// - ISGlobal Heat Index Calculator
//
// El cálculo es el de Lu & Romps.
// La interpretación sanitaria sigue la clasificación
// utilizada por ISGlobal.
// =====================================================

function classifyHeatIndex(hi){

    if(isNaN(hi)){

        return null;

    }

    if(hi < 27){

        return {

            level:0,

            category:"Sin riesgo",

            color:"#4CAF50",

            effects:
            "La mayoría de la población no experimenta efectos adversos por calor.",

            recommendation:
            "Condiciones confortables."

        };

    }

    if(hi < 32){

        return {

            level:1,

            category:"Precaución",

            color:"#FDD835",

            effects:
            "Posible fatiga tras una exposición prolongada o actividad física continuada.",

            recommendation:
            "Mantener hidratación y vigilancia."

        };

    }

    if(hi < 41){

        return {

            level:2,

            category:"Precaución extrema",

            color:"#FB8C00",

            effects:
            "Posibles calambres y agotamiento por calor. La exposición prolongada aumenta el riesgo.",

            recommendation:
            "Reducir la exposición y aumentar los periodos de descanso."

        };

    }

    if(hi < 54){

        return {

            level:3,

            category:"Peligro",

            color:"#E53935",

            effects:
            "Alta probabilidad de agotamiento por calor. Existe riesgo de golpe de calor si la exposición continúa.",

            recommendation:
            "Evitar actividades intensas y limitar la permanencia en espacios cálidos."

        };

    }

    return {

        level:4,

        category:"Peligro extremo",

        color:"#6A1B9A",

        effects:
        "Riesgo muy elevado de golpe de calor incluso con exposiciones relativamente cortas.",

        recommendation:
        "Evitar la exposición. Se requieren medidas inmediatas de protección."

    };

}

function getHeatIndexDescription(hi){

    const info = classifyHeatIndex(hi);

    if(!info){

        return "";

    }

    return info.category;

}



function getHeatIndexColor(hi){

    const info = classifyHeatIndex(hi);

    if(!info){

        return "#999999";

    }

    return info.color;

}



function getHeatIndexEffects(hi){

    const info = classifyHeatIndex(hi);

    if(!info){

        return "";

    }

    return info.effects;

}



function getHeatIndexRecommendation(hi){

    const info = classifyHeatIndex(hi);

    if(!info){

        return "";

    }

    return info.recommendation;

}

function calculateHeatIndexInfo(

    temperatura,

    humedad

){

    const hi =

        calculateHeatIndex(

            temperatura,

            humedad

        );

    return{

        value:hi,

        ...classifyHeatIndex(hi)

    };

}
