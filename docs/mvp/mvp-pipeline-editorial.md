# Ebook factory: definición del MVP editorial

**Estado:** propuesta operativa v0.3  
**Fecha:** 2026-10-29  
**Base editorial:** [propuesta-editorial.md](propuesta-editorial.md)

## 1. Objetivo de la fábrica

Construir una fábrica editorial asistida por IA capaz de producir ebooks breves, claros y atractivos en distintos géneros, desde cuentos infantiles y ficción (romance, erotismo adulto y misterio) hasta libros educativos. “Ligero” significa accesible y enfocado, no superficial ni necesariamente corto.

La fábrica debe reutilizar un núcleo de planificación, escritura, QA y producción, activando perfiles de género con instrucciones, artefactos y controles especializados. Las skills realizan tareas acotadas; un orquestador conserva el estado, las versiones y los gates humanos. La aprobación editorial y la publicación no se automatizan.

## 2. Modelo modular

| Capa | Responsabilidad |
|---|---|
| Núcleo común | Intake, definición de público y promesa, planificación, escritura por secciones, edición sustantiva y de línea, corrección lingüística por variante, QA, diseño de portada frontal para ebook, producción y trazabilidad. |
| Perfil de género | Define estructura narrativa o didáctica, artefactos intermedios, pruebas de calidad, límites de contenido y estilo editorial propios del género. |
| Orquestador | Selecciona el perfil, valida entradas, gestiona versiones y estados, exige gates y enruta correcciones a la etapa responsable. |
| Revisión humana | Decide enfoque, contenido, adecuación al público y publicación; puede aprobar, rechazar o solicitar cambios en cada gate. |

### Perfiles de género previstos

| Perfil | Artefactos y QA específicos |
|---|---|
| Cuento infantil | Edad objetivo, vocabulario y complejidad adecuados, estructura comprensible, tratamiento apropiado de temas sensibles y revisión adulta. |
| Romance | Arcos emocionales y relacionales coherentes, evolución de personajes, expectativas del subgénero y representación de consentimiento y agencia. |
| Erotismo adulto | Confirmación de público adulto, personajes adultos y consentimiento; clasificación de contenido y revisión de requisitos legales y de las plataformas de distribución. |
| Misterio | Registro de pistas, sospechosos, cronología y revelación; comprobar que la solución sea coherente y esté preparada por el texto. |
| Educativo/no ficción | Dossier de fuentes cuando corresponda, objetivos de aprendizaje, afirmaciones trazables, ejercicios y comprobación de resultados. |

Estos son perfiles configurables, no una promesa de que cada género ya está validado. Se pueden añadir otros sin alterar el núcleo si definen sus entradas, artefactos y criterios de QA.

## 3. Alcance del MVP

- **Primer piloto completo:** *IA útil en el trabajo*, título provisional, para probar el perfil educativo/no ficción de principio a fin.
- **Prueba mínima de generalidad:** un relato breve de misterio como segundo perfil, para comprobar que la arquitectura también maneja ficción, continuidad y pistas. Es una prueba técnica/editorial, no necesariamente un segundo ebook comercial.
- **Objetivo de la fábrica:** admitir perfiles de cualquier género mediante configuración modular; el MVP no pretende validar exhaustivamente todos los géneros ni producir varios libros en paralelo.
- **Idiomas y mercados:** español de México (`es-MX`) e inglés de Estados Unidos (`en-US`). Las ediciones se localizarán y validarán por separado; los resultados de un mercado no se generalizarán automáticamente al otro.
- **Lector propuesto:** personas que usan herramientas digitales en tareas de oficina, tienen poca o ninguna experiencia con IA generativa y necesitan ayuda práctica para redactar, resumir y organizar trabajo. Es una hipótesis editorial; se evaluará con datos de lanzamiento, no con entrevistas previas.
- **Resultado esperado:** las personas lectoras practican cómo usar una herramienta de IA para redactar un correo, resumir un texto, preparar una reunión y convertir notas en acciones; además, revisan el resultado antes de usarlo.
- **Contenido del piloto educativo:** un mismo libro conceptual con ediciones localizadas en español e inglés, además de brief, dossier de investigación, propuesta e índice, muestras, manuscritos sujetos a aprobación, QA editorial y una prueba pública de mercado medida por idioma.
- **Fuera de alcance:** automatizar la publicación, producir un catálogo o afirmar que los perfiles están listos para uso comercial sin probarlos. La publicación del piloto será una prueba acotada y aprobada por una persona; la fábrica no promete exactitud ni calidad uniforme sin revisión.

## 4. Parámetros de entrada

El orquestador solicita estos campos. Los campos obligatorios no pueden completarse por inferencia silenciosa.

| Campo | Estado inicial | Regla |
|---|---|---|
| Género y subgénero | Educativo/no ficción para el primer piloto | Obligatorio; activa un perfil de género versionado |
| Tema | IA aplicada a tareas laborales | Obligatorio |
| Problema que resuelve / experiencia de lectura | Aprender a completar tareas comunes con IA y revisar las respuestas | Obligatorio; en ficción se concreta como experiencia narrativa esperada |
| Público objetivo | Se define en el brief de cada libro; para el piloto, ver sección 3 | Tratar como hipótesis y evaluar con métricas de lanzamiento; no afirmar demanda si la exposición fue insuficiente |
| Edad objetivo y clasificación | Por definir para cada libro | Obligatorio cuando el público o contenido dependa de la edad, en especial infantil y erotismo adulto |
| Longitud y nivel de lectura | Ebook breve y accesible | Definir antes del outline; no confundir sencillez con empobrecimiento |
| Idioma y mercado | Español de México (`es-MX`) e inglés de Estados Unidos (`en-US`) | Localizar cada edición para su mercado y validar por separado; no asumir que traducir equivale a adaptar ni generalizar resultados entre mercados |
| Formato final | Ebook; EPUB/PDF por decidir | No iniciar producción final hasta decidir |
| Herramientas mencionadas | Enfoque neutral, centrado en capacidades | Cada recomendación requiere evidencia, fecha y revisión |
| Límites editoriales | Privacidad, verificación, imparcialidad, lenguaje sencillo | Aplican a todas las etapas |

## 5. Flujo y artefactos

Cada etapa recibe artefactos versionados y entrega una salida revisable. El orquestador marca cada etapa como `pendiente`, `en curso`, `requiere cambios`, `aprobada` o `bloqueada`.

| Etapa / skill | Entrada principal | Salida obligatoria | Control de avance |
|---|---|---|---|
| 0. Intake y planificación | Brief del solicitante | Brief normalizado, supuestos y preguntas abiertas | No avanzar con campos obligatorios vacíos |
| 1. Investigación (según perfil) | Brief aprobado | No ficción: dossier de fuentes. Ficción: investigación de ambientación solo si se necesita; hechos comprobables identificados aparte | No inventar fuentes ni presentar ambientación ficticia como hecho |
| 2. Diseño editorial (según perfil) | Brief y dossier si aplica | No ficción: promesa, índice y objetivos. Ficción: premisa, personajes, arco, mundo, estructura y mapa de capítulos | Presentar título, concepto y diseño al gate humano 1 |
| 3. Muestra | Diseño aprobado | Capítulo/escena, ejercicio si aplica y lista de comprobación del género | Revisión editorial; no requiere panel de lectores previo |
| 4. Manuscrito | Diseño aprobado | Manuscrito completo con referencias y registro de cambios | Pasar a edición editorial |
| 5. Edición editorial | Manuscrito versionado | Edición sustantiva y de línea, corrección lingüística localizada y registro de cambios | Resolver dudas editoriales; no alterar afirmaciones factuales sin verificar las fuentes |
| 6. QA editorial | Manuscrito editado | Informe de defectos por severidad y correcciones propuestas | Resolver defectos críticos; Gate humano 2 aprueba la versión corregida antes de producción |
| 7. Producción | Manuscrito aprobado y especificación de formato | Ebook, portada frontal localizada, metadatos y reporte de comprobaciones | Gate humano final aprueba los archivos y las condiciones de publicación |
| 8. Prueba de mercado en vivo | Ediciones aprobadas y publicadas en el canal elegido | Informe de exposición, resultados y decisión por idioma | Definir de antemano periodo, métricas y umbrales; analizar `es-MX` y `en-US` por separado |

Las skills no deben cambiar el estado del flujo por sí mismas. Solo el orquestador registra una aprobación explícita y vinculada a la versión exacta revisada.

## 6. Gates humanos

- **Gate 1, enfoque:** aprobar género, público/edad, título, promesa o experiencia de lectura, límites de contenido y outline. Devolver cambios es una salida válida. No se redacta el libro completo sin esta aprobación.
- **Gate 2, manuscrito editado:** aprobar la versión completa después de edición y QA, antes de producción.
- **Gate final, publicación:** aprobar ebooks renderizados, portadas localizadas, metadatos, precio, canal, alcance y condiciones de la prueba pública.

Una modificación sustancial posterior a un gate invalida esa aprobación y obliga a revisar de nuevo el material afectado.

## 7. Prueba de mercado en vivo

La validación del piloto educativo será una publicación pública, no un estudio con entrevistas o lectores reclutados antes del lanzamiento. La estrategia de partida es publicar solo ebooks, lanzar `es-MX` y `en-US` en la misma ventana y medir durante seis semanas. Los resultados serán señales de mercado, no evidencia estadística ni garantía de demanda futura.

- Usar ebook digital como único formato inicial; no añadir edición impresa durante esta prueba.
- La tarifa de KDP por publicar el ebook es **US$0**; Amazon retiene su parte de las ventas y puede descontar el costo de entrega si se elige la regalía del 70%. Los anuncios son opcionales y se pagan aparte.
- Publicar las ediciones `es-MX` y `en-US` en la misma ventana, después de completar los gates editoriales y de producción; registrar resultados por separado y no compensar un resultado débil en un idioma con el otro.
- Planificar promoción acotada y comparable para ambas ediciones; no depender únicamente del descubrimiento orgánico. Definir el presupuesto máximo antes del lanzamiento.
- Considerar Amazon KDP como canal candidato, sujeto a confirmar disponibilidad en ambos mercados y que sus informes permitan medir la exposición y ventas necesarias.
- Antes de publicar, definir para cada edición el precio y los umbrales de decisión, además del presupuesto. Mantener seis semanas como duración inicial y no fijar umbrales después de observar los resultados.
- Registrar las métricas disponibles en el canal, como impresiones o visitas, visitas a la ficha, compras o descargas, conversión, devoluciones, reseñas y costos. Documentar las limitaciones de medición de la plataforma y no recopilar datos personales innecesarios.
- **Continuar:** alcanzar los umbrales predefinidos con exposición suficiente y sin defectos críticos o señales de daño.
- **Ajustar:** hay exposición suficiente, pero los resultados quedan por debajo de los umbrales o los comentarios señalan problemas corregibles de promesa, presentación o contenido.
- **Detener o declarar inconcluso:** hay riesgos críticos no resueltos, o la exposición es insuficiente para distinguir falta de interés de falta de visibilidad. No interpretar cero ventas sin datos de exposición como rechazo del mercado.
- Para el relato de misterio, mantener la prueba técnica de continuidad: cronología, pistas, sospechosos y resolución. No extrapolar el resultado del piloto educativo a otros perfiles.

## 8. Guardrails editoriales y de seguridad

- No inventar fuentes, citas, capacidades, precios, funciones ni resultados de investigación. Marcar lo no verificado como pendiente.
- Mantener una matriz de afirmaciones: afirmación, fuente, fecha, sección del manuscrito y estado de verificación.
- Diferenciar hechos, recomendaciones y ejemplos ficticios. Identificar claramente los ejemplos ficticios.
- No introducir información personal, confidencial o de clientes en prompts ni en ejemplos reales; usar datos sintéticos.
- No presentar salidas de IA como fiables por defecto. Enseñar comprobaciones y cuándo no usar la herramienta.
- Mantener recomendaciones neutrales, explicitar criterios y fechar las comparaciones de herramientas.
- Usar texto original y registrar fuentes; no copiar pasajes protegidos ni imitar la voz de autores vivos.
- Ante contradicciones importantes, riesgos legales/de privacidad o fuentes insuficientes, bloquear la etapa y solicitar revisión humana.
- Conservar brief, entradas y salidas de cada etapa, versión del manuscrito, hallazgos de QA y aprobaciones. No incluir secretos ni datos sensibles en esos registros.
- Aplicar guardrails por perfil: edad objetivo y revisión adulta en infantil; solo adultos (18+) y consentimiento explícito en erotismo adulto; controles de continuidad en ficción; trazabilidad de afirmaciones en no ficción. Si la edad de personajes o lectores no está clara en erotismo, bloquear y pedir aclaración.

## 9. QA y definición de terminado

El QA verifica, como mínimo:

- Cada capítulo aporta al resultado prometido y sigue la estructura acordada.
- Los pasos se pueden ejecutar; los ejemplos incluyen entrada, proceso, resultado y revisión.
- Las afirmaciones factuales tienen referencias rastreables y las limitaciones están bien representadas.
- No hay contradicciones entre capítulos, instrucciones inseguras ni datos personales reales.
- Cada edición mantiene ortografía, terminología, tono y naturalidad en la variante lingüística elegida; no se limita a sustituir palabras de una traducción literal.
- La edición sustantiva y de línea, la corrección lingüística y la portada frontal se revisan para cada variante; no se reutiliza sin adaptación la portada de otro idioma.
- Se ejecutan las pruebas del perfil activo: por ejemplo, registro de pistas para misterio, coherencia de personajes y trama para ficción, o objetivos de aprendizaje y fuentes para educativo.
- El índice, enlaces, metadatos, portada y archivos exportados funcionan y se leen correctamente en los formatos elegidos.

El MVP se considera completado cuando el piloto educativo produce manuscritos editados y aprobados, portadas localizadas y archivos finales que pasan QA y las comprobaciones del formato elegido; además, se documenta una decisión de la prueba pública para `es-MX` y `en-US` por separado. El flujo de ficción debe producir una muestra de misterio que supere sus pruebas de continuidad. Cada versión final y las condiciones de publicación requieren aprobación humana; si la exposición no alcanza los mínimos acordados, el resultado se registra como inconcluso.

## 10. Investigación documental inicial

Revisión preliminar de fuentes primarias consultadas el **2026-10-29** para el piloto educativo sobre IA. Esto orienta ese contenido y sus guardrails, pero no demuestra demanda comercial ni valida los perfiles de ficción.

| Fuente | Hallazgo aplicable | Límite |
|---|---|---|
| [NIST, AI Risk Management Framework: Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1), publicado 2024-07-26; ficha actualizada 2026-04-08 | Perfil voluntario para ayudar a organizaciones a incorporar consideraciones de confianza y gestión de riesgos al desarrollar, usar y evaluar IA generativa. Puede orientar la lista de riesgos y controles del QA. | Es un marco organizacional, no una guía para principiantes ni una certificación legal. No debe presentarse como obligación universal. |
| [Microsoft Learn, Data, Privacy, and Security for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-privacy), fecha editorial 2026-07-09; metadatos de actualización 2026-10-26 | La propia documentación advierte que las respuestas generativas no garantizan exactitud y que la persona debe revisarlas. Explica tratamiento de datos y controles dentro de las experiencias Microsoft descritas. | La documentación describe productos y compromisos de Microsoft; no se puede generalizar a otros proveedores, planes o cuentas. |
| [OpenAI Help Center, Data controls in ChatGPT](https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt), consultado 2026-10-29 | Los controles disponibles dependen del tipo de cuenta y del espacio de trabajo. Desactivar el uso para mejora del modelo no equivale a borrar el historial; los espacios administrados y las cuentas personales tienen condiciones distintas. | La configuración y los términos pueden cambiar. Verificar de nuevo antes de publicar cualquier instrucción concreta. |

### Decisiones derivadas

- Enseñar a verificar resultados es requisito central, no un apéndice opcional.
- Evitar frases universales como “tus datos no se usan para entrenar” o “puedes pegar información del trabajo”. La recomendación provisional es no introducir datos personales, confidenciales o de clientes salvo que las políticas de la organización y las condiciones vigentes de la herramienta lo permitan expresamente.
- Si se muestran controles de un producto, identificarlos como ejemplo fechado y acompañarlos de una alternativa general: consultar políticas de la organización, condiciones del servicio y configuración de la cuenta.
- El dossier no valida demanda ni disposición a comprar. Esa hipótesis se evaluará con los resultados de la publicación, considerando la exposición y las limitaciones del canal.

## 11. Decisiones pendientes para el lanzamiento

La prueba no debe reducirse a publicar y esperar sin fijar cómo se interpretarán los resultados. Antes de producir los archivos finales, completar en el brief:

- Confirmación del canal (Amazon KDP es candidato) y disponibilidad real por país e idioma.
- Precio, portada, metadatos y página de venta para cada edición.
- Presupuesto total de lanzamiento: tarifa de publicación en KDP **US$0**; definir el gasto máximo en anuncios y si se contratarán servicios externos de edición, portada o formato.
- Plan de visibilidad comparable para ambas ediciones.
- Métricas que ofrece el canal, exposición mínima necesaria y umbrales para continuar, ajustar o detener.
- Forma de registrar comentarios y devoluciones respetando la privacidad y las reglas de la plataforma.

Si no se alcanza la exposición mínima, la decisión debe ser “inconclusa”, no “sin demanda”.

## 12. Arranque del proceso: brief y diseño provisionales del piloto educativo

### Brief editorial provisional

- **Título en español:** *IA útil en el trabajo* (provisional).
- **Título de trabajo en inglés:** *Practical AI at Work* (provisional; requiere validación editorial).
- **Subtítulos:** se adaptarán en cada idioma para conservar la promesa, no necesariamente la redacción literal.
- **Lector:** personas en México para la edición `es-MX` y en Estados Unidos para `en-US`, según la hipótesis de la sección 3; evaluar el desempeño de cada edición por separado tras publicar.
- **Promesa:** al terminar, el lector podrá completar tareas laborales sencillas con una herramienta de IA y revisar sus respuestas antes de utilizarlas.
- **No promete:** exactitud garantizada, ahorro de tiempo cuantificado ni sustitución del criterio profesional.
- **Tareas candidatas:** redactar un correo, resumir un texto, preparar una reunión y convertir notas en una lista de acciones.
- **Preguntas abiertas:** ¿qué ocupaciones concretas priorizar?, ¿confirma el canal candidato la disponibilidad y medición necesarias en México y Estados Unidos?, ¿qué precio, presupuesto máximo y umbrales se usarán?, ¿qué nivel de privacidad puede explicar el capítulo sin depender de un proveedor específico?

### Índice de trabajo para el gate 1

1. Qué puede y qué no puede hacer una herramienta de IA.
2. Cómo explicar una tarea y aportar contexto sin compartir datos sensibles.
3. Redactar y revisar un correo.
4. Resumir un texto y comprobar que conserva lo importante.
5. Preparar una reunión.
6. Convertir notas en acciones y responsables.
7. Una rutina breve para verificar antes de usar o compartir una respuesta.

Este índice es una propuesta para revisión, no una aprobación ni un resultado de investigación. La siguiente etapa es cerrar el perfil, la promesa y el índice en el gate 1; antes de producir los archivos finales, confirmar el canal, definir precios, presupuesto y umbrales y preparar ebooks para una prueba de seis semanas. No se publica ninguna edición sin QA y aprobación humana final.