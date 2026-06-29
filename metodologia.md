# Metodología del Agente Clima IES

## 1. Objetivo del proyecto

El Agente Clima IES es una herramienta destinada a analizar las condiciones ambientales interiores de centros educativos a partir de registros continuos de temperatura y humedad relativa.

Su finalidad es proporcionar indicadores objetivos que permitan:

* Evaluar las condiciones ambientales de las aulas.
* Detectar situaciones potencialmente problemáticas.
* Facilitar la toma de decisiones relacionadas con confort térmico, adaptación al calor y gestión de espacios educativos.
* Generar informes reproducibles y transparentes basados en datos.

---

## 2. Variables medidas

Actualmente el sistema utiliza exclusivamente las variables registradas por los sensores instalados en las aulas:

### Temperatura del aire

* Unidad: °C

### Humedad relativa

* Unidad: %

### Fecha y hora

* Marca temporal asociada a cada medición.

---

## 3. Variables no medidas

El sistema no dispone actualmente de información sobre:

* Velocidad del aire.
* Temperatura radiante media.
* Radiación solar.
* Actividad metabólica de los ocupantes.
* Nivel de aislamiento de la vestimenta.

Como consecuencia, determinados índices de confort térmico no pueden calcularse de forma rigurosa.

---

## 4. Indicadores calculados

### 4.1. Estadísticos básicos

Para cada aula se calculan:

#### Temperatura

* Temperatura mínima.
* Temperatura media.
* Temperatura máxima.

#### Humedad relativa

* Humedad relativa mínima.
* Humedad relativa media.
* Humedad relativa máxima.

---

### 4.2. Tiempo de exposición fuera de los límites del RD 486/1997

Se calcula:

* Tiempo con temperatura inferior a 17 °C.
* Tiempo con temperatura superior a 27 °C.
* Tiempo con humedad relativa inferior al 30 %.
* Tiempo con humedad relativa superior al 70 %.

Asimismo se calculan los porcentajes de tiempo asociados a cada situación.

---

### 4.3. Índice de Disconfort de Thom (DI)

#### Justificación

Se adopta el Índice de Disconfort de Thom como indicador principal de confort térmico debido a que:

* Es un índice ampliamente utilizado en climatología aplicada y estudios de confort.
* Puede calcularse únicamente a partir de temperatura y humedad relativa.
* Es compatible con los datos registrados por los sensores disponibles.
* Permite comparar condiciones térmicas entre aulas y periodos temporales.

#### Fórmula utilizada

DI = T − (0,55 − 0,0055 × HR) × (T − 14,5)

Donde:

* T = temperatura del aire (°C)
* HR = humedad relativa (%)

#### Variables derivadas

Para cada aula se calculan:

* DI mínimo.
* DI medio.
* DI máximo.
* Horas con DI superior a 24.
* Horas con DI superior a 27.
* Porcentaje de tiempo con DI superior a 24.
* Porcentaje de tiempo con DI superior a 27.

---

### 4.4. ETA27

#### Definición

ETA27 es un indicador de exposición térmica acumulada desarrollado para el proyecto.

Mide simultáneamente:

* Intensidad de la exposición térmica.
* Duración de la exposición térmica.

#### Cálculo

Para cada periodo en el que la temperatura supera 27 °C se calcula:

ETA27 = Σ[(T − 27) × tiempo]

#### Unidad

°C·h

#### Interpretación

ETA27 permite distinguir situaciones que presentan la misma temperatura máxima pero distinta duración de exposición.

Ejemplo:

* 30 °C durante 30 minutos.
* 30 °C durante 5 horas.

Ambas situaciones generan impactos diferentes y ETA27 permite cuantificar esa diferencia.

---

## 5. Índices considerados y descartados

Durante el diseño metodológico se han evaluado diversos índices de confort térmico.

### Índice de Disconfort de Thom

Estado: Adoptado.

Motivo:

* Compatible con las variables medidas.
* Amplio uso científico.
* Fácil interpretación.

### PMV/PPD (Fanger)

Estado: No adoptado.

Motivo:

Requiere variables no disponibles:

* Temperatura radiante.
* Velocidad del aire.
* Actividad metabólica.
* Vestimenta.

### WBGT

Estado: No adoptado.

Motivo:

Requiere sensores específicos para temperatura de globo y temperatura húmeda natural.

### UTCI

Estado: No adoptado.

Motivo:

Requiere variables ambientales no disponibles.

### Heat Index

Estado: Pendiente de evaluación futura.

Motivo:

Puede calcularse con temperatura y humedad relativa, aunque está diseñado principalmente para ambientes exteriores.

---

## 6. Filosofía metodológica

El proyecto se fundamenta en los siguientes principios:

### Transparencia

Todos los indicadores utilizados deben estar claramente documentados.

### Reproducibilidad

Los resultados deben poder reproducirse a partir de los datos originales.

### Fundamentación científica

Los indicadores empleados deben estar respaldados por literatura científica reconocida.

### Separación entre medición e interpretación

La aplicación calcula indicadores físicos y termohigrométricos.

La interpretación educativa, sanitaria o de confort constituye una capa posterior que debe fundamentarse en la literatura correspondiente.

---
## Definición adoptada del Índice de Disconfort

El Agente Clima IES adopta como definición operativa del Índice de Disconfort (DI) la formulación clásica basada en temperatura del aire y humedad relativa:

DI = T − (0,55 − 0,0055·HR) · (T − 14,5)

donde:

* T es la temperatura del aire (°C).
* HR es la humedad relativa (%).

### Justificación

Durante el diseño metodológico se revisaron distintas formulaciones del Índice de Thom presentes en la literatura científica.

Se identificó una formulación alternativa empleada por el servicio Urban SIS de Copernicus, basada en la temperatura de bulbo húmedo:

TDI = (Ta + Tw) / 2

Sin embargo, se decidió mantener la formulación clásica porque:

* Utiliza directamente las variables medidas por los sensores del proyecto.
* Evita introducir una estimación intermedia de la temperatura de bulbo húmedo.
* Mantiene la coherencia con los indicadores ya implementados en la aplicación.
* Está ampliamente utilizada en climatología aplicada y estudios de confort térmico.

La existencia de formulaciones alternativas queda reconocida y documentada, pero no se adoptan en la versión actual del sistema.

### Clasificación operativa adoptada para el Índice de Disconfort:

<21      Confortable
21-24    Ligero disconfort
24-27    Disconfort moderado
27-29    Disconfort severo
29-32    Estrés térmico intenso
>32      Estrés térmico extremo

Estas categorías describen niveles crecientes de disconfort térmico y no deben interpretarse como categorías clínicas de riesgo sanitario.

## 7. Estado actual de las decisiones metodológicas

### Decisiones adoptadas

* Utilizar temperatura y humedad relativa como variables básicas.
* Utilizar el Índice de Disconfort de Thom como indicador principal de confort térmico.
* Utilizar ETA27 como indicador complementario de exposición térmica acumulada.
* Mantener separados los conceptos de confort térmico y estrés térmico.
* No utilizar índices que requieran variables no medidas por los sensores actuales.


3.X. Heat Index (HI)
Definición

El Heat Index (HI) o Índice de Calor es un indicador biometeorológico que combina la temperatura del aire y la humedad relativa para estimar la temperatura aparente que experimenta el organismo humano. A diferencia de la temperatura ambiental, el Heat Index incorpora el efecto que la humedad ejerce sobre la evaporación del sudor, principal mecanismo fisiológico de disipación del calor.

El resultado se expresa en grados Celsius (°C) y representa la temperatura equivalente que produciría la misma respuesta fisiológica bajo unas condiciones de referencia.

Objetivo

El Heat Index se incorpora al Agente Clima IES como un indicador complementario al Índice de Thom.

Mientras que el Índice de Thom (DI) evalúa el grado de confort o disconfort térmico percibido, el Heat Index estima el esfuerzo fisiológico que debe realizar el organismo para mantener constante su temperatura corporal.

Ambos índices proporcionan información complementaria sobre el ambiente térmico del edificio.

Variables utilizadas

El cálculo del Heat Index requiere únicamente:

Temperatura del aire (°C)
Humedad relativa (%)

No requiere información sobre velocidad del viento, radiación solar o temperatura radiante.

Implementación

El Agente Clima IES implementa el Extended Heat Index, desarrollado por:

Lu, M. & Romps, D. M. (2022).
Extending the Heat Index.
Journal of Applied Meteorology and Climatology.

La implementación utilizada en la aplicación constituye una adaptación a JavaScript de la implementación oficial distribuida por los autores.

No se utiliza la aproximación polinómica clásica de Rothfusz, debido a las limitaciones reconocidas de dicho modelo fuera del rango de temperaturas para el que fue desarrollado.

Conversión de unidades

El algoritmo original del Extended Heat Index está formulado en grados Fahrenheit.

Por este motivo:

la temperatura registrada por los sensores (°C) se convierte inicialmente a grados Fahrenheit;
el cálculo se realiza íntegramente en dicha escala;
el resultado final se convierte nuevamente a grados Celsius para su presentación al usuario.

Este procedimiento garantiza la equivalencia con la implementación oficial del modelo.

Clasificación

La clasificación utilizada por el Agente Clima IES sigue la escala empleada por el National Weather Service (NWS) y adoptada por ISGlobal en su calculadora pública del Heat Index.

HI (°C)	Nivel
<27	Seguro
27–32	Precaución
33–40	Precaución extrema
41–51	Peligro
52–93	Peligro extremo
>93	Límite fisiológico
Interpretación fisiológica

Cada categoría representa un estado diferente de la capacidad del organismo para disipar calor.

Nivel	Interpretación fisiológica
Seguro	La termorregulación funciona con normalidad.
Precaución	Aumenta el esfuerzo termorregulador.
Precaución extrema	La evaporación del sudor comienza a ser insuficiente.
Peligro	El organismo presenta dificultades crecientes para mantener estable su temperatura corporal.
Peligro extremo	Los mecanismos fisiológicos de compensación están prácticamente agotados.
Límite fisiológico	La temperatura corporal aumenta incluso en condiciones ideales de hidratación y sombra.
Posibles efectos sobre la salud

El Agente Clima IES incorpora también los efectos potenciales sobre la salud asociados a cada intervalo del Heat Index, siguiendo la clasificación divulgativa del National Weather Service reproducida por ISGlobal.

Estos efectos tienen carácter orientativo y deben interpretarse como una estimación del riesgo para una persona adulta sana bajo condiciones de referencia.

En población infantil, personas mayores o individuos con patologías previas, los efectos pueden aparecer con valores inferiores.

Ámbito de aplicación

El Heat Index representa la respuesta fisiológica correspondiente a:

persona adulta sana;
correctamente hidratada;
ligera actividad metabólica;
ligera ventilación;
ausencia de radiación solar directa.

La presencia de radiación solar intensa, actividad física o condiciones individuales de vulnerabilidad puede incrementar significativamente el riesgo real de estrés térmico.

Validación

La implementación del algoritmo será validada comparando los resultados obtenidos por el Agente Clima IES con la calculadora pública desarrollada por ISGlobal para un conjunto representativo de combinaciones de temperatura y humedad relativa.

La integración del Heat Index en la aplicación solo se considerará finalizada una vez comprobada la concordancia de los resultados dentro del rango de condiciones habitual en edificios escolares.

Referencias
Lu, M., & Romps, D. M. (2022). Extending the Heat Index. Journal of Applied Meteorology and Climatology.
National Weather Service (NOAA). Heat Index.
ISGlobal. Heat Index Calculator (basada en el Extended Heat Index de Lu & Romps).
Steadman, R. G. (1979). The Assessment of Sultriness.
### Decisiones pendientes

* Revisión bibliográfica específica sobre los umbrales de clasificación del Índice de Disconfort de Thom.
* Definición de los colores y categorías utilizados en los mapas de DI.
* Evaluación de la posible incorporación futura de índices adicionales compatibles con los sensores disponibles.
* Elaboración de la bibliografía de referencia completa del proyecto.
