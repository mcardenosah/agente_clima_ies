Agente Termohigrométrico - IES 
📌 Descripción del Proyecto

Esta aplicación web es un Agente de Procesamiento Local (Edge Computing) diseñado para analizar, limpiar y visualizar datos de sensores termohigrométricos (dataloggers). Su objetivo es evaluar las condiciones de confort térmico del profesorado y el alumnado, proporcionando evidencias objetivas para la toma de decisiones dentro del Proyecto de Renaturalización y Adaptación al Cambio Climático del centro educativo.

La herramienta ingiere datos brutos en formato CSV, aplica filtros de validación y evalúa el cumplimiento normativo en materia de Prevención de Riesgos Laborales (PRL).

⚖️ Marco Normativo y Metodología

El motor de cálculo interno está programado siguiendo los siguientes criterios rigurosos:

Límites Normativos: Basado en el Anexo III del Real Decreto 486/1997 sobre disposiciones mínimas de seguridad y salud en los lugares de trabajo (17 °C - 27 °C para trabajos sedentarios).

Validación de Intervalos: El sistema detecta y excluye dinámicamente "huecos de datos" (intervalos de lectura superiores a 22,5 minutos), garantizando que solo se evalúa el tiempo de exposición real y continuo.

Cálculo de Severidad (ETA27): Incorpora el cálculo integral de la Exposición Térmica Acumulada ($ETA_{27}$) mediante la fórmula:
MAX(0, temperatura - 27) × intervalo_valido_en_horas
Esto permite no solo contar cuántas horas se supera el límite, sino la intensidad del calor sufrido.

🚀 Características Técnicas

Privacidad por diseño (Local Processing): Los archivos CSV nunca se suben a ningún servidor o nube. Todo el procesamiento (parseo con PapaParse, lógica de evaluación y renderizado de gráficas con Chart.js) ocurre en el navegador del usuario. Cumplimiento absoluto del RGPD.

Interfaz Interactiva: Panel de control (Dashboard) con mapas de calor horarios, evolución temporal y ranking de severidad por espacios.

Arquitectura SPA: Single Page Application autocontenida en un único archivo index.html.

🛠️ Instrucciones de Uso

Accede a la aplicación web (vía GitHub Pages).

Exporta los datos de tus dataloggers en formato .csv (El formato esperado incluye columnas de fecha/hora, temperatura y humedad).

Selecciona y arrastra todos los archivos .csv a la zona de importación de la aplicación.

El sistema procesará los datos en milisegundos y habilitará las pestañas de Informe Técnico y Dashboard.

🏫 Aplicación Didáctica

Además de su uso administrativo e investigador, esta herramienta está diseñada para poder ser utilizada como simulador interactivo en el aula (Biología y Geología, Física y Química, FP Básica). Permite al alumnado aplicar el modelo 5E (Engage, Explore, Explain, Elaborate, Evaluate), analizando gráficas reales, detectando patrones de estratificación térmica e inercia de los materiales, y argumentando la necesidad de implementar Soluciones Basadas en la Naturaleza (SBN) como cubiertas verdes o fachadas vegetales.

Desarrollado como herramienta de investigación, gestión y docencia.
