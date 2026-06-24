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

## 7. Estado actual de las decisiones metodológicas

### Decisiones adoptadas

* Utilizar temperatura y humedad relativa como variables básicas.
* Utilizar el Índice de Disconfort de Thom como indicador principal de confort térmico.
* Utilizar ETA27 como indicador complementario de exposición térmica acumulada.
* Mantener separados los conceptos de confort térmico y estrés térmico.
* No utilizar índices que requieran variables no medidas por los sensores actuales.

### Decisiones pendientes

* Revisión bibliográfica específica sobre los umbrales de clasificación del Índice de Disconfort de Thom.
* Definición de los colores y categorías utilizados en los mapas de DI.
* Evaluación de la posible incorporación futura de índices adicionales compatibles con los sensores disponibles.
* Elaboración de la bibliografía de referencia completa del proyecto.
