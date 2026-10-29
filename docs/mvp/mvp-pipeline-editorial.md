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
| Núcleo común | Intake, definición de público y promesa, planificación, escritura por secciones, revisión de claridad, consistencia, corrección, diseño/exportación y trazabilidad. |
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
- **Idiomas y mercados:** español e inglés, tratados como mercados editoriales de primera clase. La geografía y variante lingüística inicial de cada edición están por definir.
- **Lector propuesto:** personas hispanohablantes y angloparlantes que usan herramientas digitales en tareas de oficina, tienen poca o ninguna experiencia con IA generativa y necesitan ayuda práctica para redactar, resumir y organizar trabajo. Es una hipótesis que se validará por separado en cada idioma.
- **Resultado esperado:** las personas lectoras practican cómo usar una herramienta de IA para redactar un correo, resumir un texto, preparar una reunión y convertir notas en acciones; además, revisan el resultado antes de usarlo.
- **Contenido del piloto educativo:** un mismo libro conceptual con ediciones localizadas en español e inglés, además de brief, dossier de investigación, propuesta e índice, muestras, validación de lectores por idioma, manuscritos sujetos a aprobación y QA editorial.
- **Fuera de alcance:** automatizar publicación, traducciones, producir un catálogo o afirmar que los perfiles están listos para uso comercial sin probarlos. La fábrica no promete exactitud ni calidad uniforme sin revisión.

## 4. Parámetros de entrada

El orquestador solicita estos campos. Los campos obligatorios no pueden completarse por inferencia silenciosa.

| Campo | Estado inicial | Regla |
|---|---|---|
| Género y subgénero | Educativo/no ficción para el primer piloto | Obligatorio; activa un perfil de género versionado |
| Tema | IA aplicada a tareas laborales | Obligatorio |
| Problema que resuelve / experiencia de lectura | Aprender a completar tareas comunes con IA y revisar las respuestas | Obligatorio; en ficción se concreta como experiencia narrativa esperada |
| Público objetivo | Se define en el brief de cada libro; para el piloto, ver sección 3 | Debe validarse con lectores |
| Edad objetivo y clasificación | Por definir para cada libro | Obligatorio cuando el público o contenido dependa de la edad, en especial infantil y erotismo adulto |
| Longitud y nivel de lectura | Ebook breve y accesible | Definir antes del outline; no confundir sencillez con empobrecimiento |
| Idioma y mercado | Español e inglés; países y variantes iniciales por definir | Localizar cada edición y confirmar geografía antes de investigación local o publicación; no asumir que traducir equivale a adaptar |
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
| 3. Muestra | Diseño aprobado | Capítulo/escena, ejercicio si aplica y lista de comprobación del género | Revisión editorial antes de probar con lectores |
| 4. Validación con lectores | Material aprobado para prueba en cada idioma | Hallazgos anonimizados y recomendación por idioma: continuar, ajustar o detener | Aplicar los umbrales por idioma de la sección 7; no compensar un resultado débil en un idioma con el otro |
| 5. Manuscrito | Diseño y validación aprobados | Manuscrito completo con referencias y registro de cambios | Gate humano 2 antes de QA final/producción |
| 6. QA editorial | Manuscrito versionado | Informe de defectos por severidad y correcciones propuestas | No publicar con defectos críticos abiertos |
| 7. Producción | Manuscrito aprobado y especificación de formato | EPUB/PDF y reporte de comprobaciones | Gate humano final de publicación |

Las skills no deben cambiar el estado del flujo por sí mismas. Solo el orquestador registra una aprobación explícita y vinculada a la versión exacta revisada.

## 6. Gates humanos

- **Gate 1, enfoque:** aprobar género, público/edad, título, promesa o experiencia de lectura, límites de contenido y outline. Devolver cambios es una salida válida. No se redacta el libro completo sin esta aprobación.
- **Gate 2, manuscrito:** aprobar el manuscrito completo y su versión antes de producción.
- **Gate final, publicación:** aprobar archivos renderizados, metadatos, portada, precio y canal de publicación.

Una modificación sustancial posterior a un gate invalida esa aprobación y obliga a revisar de nuevo el material afectado.

## 7. Validación inicial del MVP

Estos números son umbrales de decisión para un piloto cualitativo, no evidencia estadística de demanda de mercado.

- Entrevistar a **8-12 lectores potenciales por idioma** (16-24 en total), preguntando por tareas recientes, dificultades y soluciones actuales antes de presentar la propuesta. Incluir perfiles de las geografías seleccionadas para el piloto.
- Probar la muestra localizada con **5 lectores por idioma**, observando si pueden aplicar el ejercicio sin que el facilitador les resuelva los pasos.
- **Continuar en cada idioma:** al menos 70% de las personas entrevistadas describen una necesidad relacionada sin que se les sugiera la respuesta; al menos 4 de 5 completan el ejercicio con ayuda mínima; nadie termina con una interpretación de riesgo crítico sobre privacidad o verificación.
- **Ajustar:** el problema se reconoce, pero la promesa, las instrucciones o el ejercicio no se entienden o no se pueden completar.
- **Detener o replantear:** el problema no aparece espontáneamente en la mayoría de entrevistas, o el contenido induce usos inseguros que no se resuelven con una revisión acotada.
- Registrar citas anonimizadas y observaciones; no recopilar datos personales que no sean necesarios.
- Para el relato de misterio, realizar una revisión con lectores del género y una prueba de continuidad: cronología, pistas, sospechosos y resolución. No extrapolar a otros perfiles los resultados del piloto educativo o del misterio.

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
- Se ejecutan las pruebas del perfil activo: por ejemplo, registro de pistas para misterio, coherencia de personajes y trama para ficción, o objetivos de aprendizaje y fuentes para educativo.
- El índice, enlaces, metadatos y archivos exportados funcionan y se leen correctamente en los formatos elegidos.

El MVP se considera completado cuando el piloto educativo alcanza una decisión documentada en español y otra en inglés, produce manuscritos localizados aprobados en ambos idiomas, y el flujo de ficción produce una muestra de misterio que supera sus pruebas de continuidad. Cada ruta pasa QA y una persona aprueba cada versión final; ambas ediciones del ebook educativo pasan las comprobaciones del formato elegido. La publicación comercial queda fuera de este MVP salvo autorización explícita.

## 10. Investigación documental inicial

Revisión preliminar de fuentes primarias consultadas el **2026-10-29** para el piloto educativo sobre IA. Esto orienta ese contenido y sus guardrails, pero no demuestra demanda comercial ni sustituye entrevistas; tampoco valida los perfiles de ficción.

| Fuente | Hallazgo aplicable | Límite |
|---|---|---|
| [NIST, AI Risk Management Framework: Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1), publicado 2024-07-26; ficha actualizada 2026-04-08 | Perfil voluntario para ayudar a organizaciones a incorporar consideraciones de confianza y gestión de riesgos al desarrollar, usar y evaluar IA generativa. Puede orientar la lista de riesgos y controles del QA. | Es un marco organizacional, no una guía para principiantes ni una certificación legal. No debe presentarse como obligación universal. |
| [Microsoft Learn, Data, Privacy, and Security for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-privacy), fecha editorial 2026-07-09; metadatos de actualización 2026-10-26 | La propia documentación advierte que las respuestas generativas no garantizan exactitud y que la persona debe revisarlas. Explica tratamiento de datos y controles dentro de las experiencias Microsoft descritas. | La documentación describe productos y compromisos de Microsoft; no se puede generalizar a otros proveedores, planes o cuentas. |
| [OpenAI Help Center, Data controls in ChatGPT](https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt), consultado 2026-10-29 | Los controles disponibles dependen del tipo de cuenta y del espacio de trabajo. Desactivar el uso para mejora del modelo no equivale a borrar el historial; los espacios administrados y las cuentas personales tienen condiciones distintas. | La configuración y los términos pueden cambiar. Verificar de nuevo antes de publicar cualquier instrucción concreta. |

### Decisiones derivadas

- Enseñar a verificar resultados es requisito central, no un apéndice opcional.
- Evitar frases universales como “tus datos no se usan para entrenar” o “puedes pegar información del trabajo”. La recomendación provisional es no introducir datos personales, confidenciales o de clientes salvo que las políticas de la organización y las condiciones vigentes de la herramienta lo permitan expresamente.
- Si se muestran controles de un producto, identificarlos como ejemplo fechado y acompañarlos de una alternativa general: consultar políticas de la organización, condiciones del servicio y configuración de la cuenta.
- El dossier aún no valida qué perfiles tienen mayor necesidad ni su disposición a leer o comprar el libro. Esa pregunta permanece abierta para entrevistas.

## 11. Guía de entrevistas lista para el piloto educativo

**Muestra:** 8-12 personas por idioma (español e inglés) que realicen tareas digitales de oficina y tengan experiencia nula o limitada con IA generativa. Intentar incluir más de un tipo de ocupación y las geografías piloto elegidas; registrar el perfil de forma general y anónima.

**Duración:** 20-30 minutos. Preparar versiones localizadas de esta guía en español e inglés, sin traducir literalmente expresiones culturales. No mostrar el título ni explicar la idea hasta completar las preguntas sobre experiencias actuales. No pedir que compartan correos, documentos ni información confidencial.

1. Cuéntame sobre una tarea reciente de redacción, resumen o preparación de reuniones que te haya tomado esfuerzo.
2. ¿Qué necesitabas conseguir y cómo lo resolviste?
3. ¿Qué parte fue más difícil, lenta o propensa a errores?
4. ¿Qué herramientas o ayudas probaste? ¿Qué funcionó y qué no?
5. ¿Has usado una herramienta de IA para una tarea similar? Si sí, ¿qué hiciste con la respuesta antes de usarla? Si no, ¿qué te ha frenado?
6. ¿Qué información no te sentirías cómodo compartiendo con una herramienta de IA en el trabajo? ¿Qué política o permiso consultarías?
7. (Solo después de las preguntas anteriores) Presentar el título y la promesa provisionales. ¿Qué esperas encontrar en una guía así? ¿Qué parte te resulta poco clara o no te serviría?
8. ¿Qué tarea concreta tendría que ayudarte a completar para que esta guía te resultara útil?

**Registro por entrevista:** tarea y contexto general, frecuencia aproximada, dificultad descrita espontáneamente, solución actual, uso de IA, forma de revisar resultados, inquietudes de privacidad, reacción a la promesa y citas anonimizadas. Separar observaciones de interpretación; no preguntar “¿lo comprarías?” como evidencia de demanda.

## 12. Arranque del proceso: brief y diseño provisionales del piloto educativo

### Brief editorial provisional

- **Título en español:** *IA útil en el trabajo* (provisional).
- **Título de trabajo en inglés:** *Practical AI at Work* (provisional; requiere validación editorial).
- **Subtítulos:** se adaptarán en cada idioma para conservar la promesa, no necesariamente la redacción literal.
- **Lector:** perfiles hispanohablante y angloparlante definidos en la sección 3; validar por idioma y concretar geografías iniciales.
- **Promesa:** al terminar, el lector podrá completar tareas laborales sencillas con una herramienta de IA y revisar sus respuestas antes de utilizarlas.
- **No promete:** exactitud garantizada, ahorro de tiempo cuantificado ni sustitución del criterio profesional.
- **Tareas candidatas:** redactar un correo, resumir un texto, preparar una reunión y convertir notas en una lista de acciones.
- **Preguntas abiertas:** ¿qué ocupaciones concretas priorizar?, ¿qué países/variantes de español e inglés se probarán primero?, ¿qué formatos se producirán?, ¿qué nivel de privacidad puede explicar el capítulo sin depender de un proveedor específico?

### Índice de trabajo para el gate 1

1. Qué puede y qué no puede hacer una herramienta de IA.
2. Cómo explicar una tarea y aportar contexto sin compartir datos sensibles.
3. Redactar y revisar un correo.
4. Resumir un texto y comprobar que conserva lo importante.
5. Preparar una reunión.
6. Convertir notas en acciones y responsables.
7. Una rutina breve para verificar antes de usar o compartir una respuesta.

Este índice es una propuesta para revisión, no una aprobación ni un resultado de investigación. La siguiente etapa ejecutable es definir las geografías piloto y validar el perfil y las tareas con lectores en español e inglés; no se debe iniciar la redacción completa de ninguna edición hasta cerrar los gates correspondientes.