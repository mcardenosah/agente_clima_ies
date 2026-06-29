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
