# 🎯 ¿Qué Sigue Después del Orchestrator?

**Escrito:** 2026-10-30 15:00  
**Status:** Plan operativo para próximas 2 semanas  

---

## 🗺️ Mapa de Dependencias

```
HECHO ✅:
  └─ Orchestrator (state machine, gates, DB)

AHORA (Esta semana):
  ├─ 1. Brief Editorial Finalizado
  ├─ 2. Decisiones Operacionales
  └─ 3. Setup de Ambiente Dev

SEMANA 2-3:
  ├─ 4. Intake Skill
  ├─ 5. Research Skill
  └─ 6. Design Skill

SEMANA 4+:
  ├─ Sample Skill
  ├─ Manuscript Skill
  ├─ Editing Skill
  ├─ QA Skill
  └─ Production Skill
```

---

## 📋 PASO 1: Brief Editorial Finalizado (CRÍTICO)

**Owner:** Editorial (Sarah + team)  
**Duración:** 2-3 días  
**Bloqueador:** SÍ - sin esto no puedes empezar skills  

### Tareas:

#### ☐ Confirmar Brief Normalizado

Usa este template:

```json
{
  "title": "IA útil en el trabajo",
  "genre": "educational",
  "subgenre": "practical-guide",
  "theme": "AI applications for office workers",
  "target_audience": "Professionals with basic digital skills, no prior AI experience",
  "target_age_min": 18,
  "target_age_max": null,
  "reading_level": "simple",
  "content_classification": "general",
  "language": "es-MX",
  "format": "epub",
  "estimated_word_count": 45000,
  "promise": "Learn to use AI for writing emails, summarizing texts, organizing work, and reviewing results before using them"
}
```

**Preguntas a responder:**
- [ ] ¿Título final? (no provisional)
- [ ] ¿Público exacto? (descripción 50+ chars)
- [ ] ¿Promesa verificable? (¿qué aprenderá el lector?)
- [ ] ¿Tono? (formal, conversacional, etc.)
- [ ] ¿Restricciones de contenido?

#### ☐ Definir Índice Inicial

```markdown
# IA útil en el trabajo

## Capítulo 1: ¿Qué puede hacer la IA? (5K palabras)
- Explicación breve de capacidades
- Lo que NO puede hacer
- Ejemplos cotidianos

## Capítulo 2: Tu primera tarea con IA (5K palabras)
- Cómo describir una tarea
- Dar contexto
- Ejercicio: describe tu propia tarea

## Capítulo 3: Redactar un correo (5.5K palabras)
- Ejemplo completo
- Revisión del resultado
- Checklist: ¿está bien?

## Capítulo 4: Resumir un documento (5.5K palabras)
- Paso a paso
- Casos donde falla la IA
- Ejercicio práctico

## Capítulo 5: Organizar una reunión (5K palabras)
- Estructura propuesta
- Planificación con IA
- Validar el resultado

## Capítulo 6: De notas a acciones (5K palabras)
- Convertir caos en orden
- Plantilla reutilizable
- Ejercicio

## Capítulo 7: Cuidado con los datos (6K palabras)
- Privacidad
- Información confidencial
- Cuándo NO usar IA

## Capítulo 8: Próximos pasos (5K palabras)
- Resumen de capacidades
- Herramientas recomendadas
- Recursos adicionales

TOTAL: ~45K palabras
```

**Preguntas:**
- [ ] ¿8 capítulos es correcto?
- [ ] ¿Temas cubren la promesa?
- [ ] ¿Palabras estimadas son realistas?
- [ ] ¿Dónde van ejercicios?

#### ☐ Revisar Propuesta de Valor

```markdown
## Propuesta de Valor

**Problema que resuelve:**
- Personas confundidas por IA, sin saber usar
- Miedo a errores o mal uso
- No saben por dónde empezar

**Cómo lo resuelve este libro:**
- Explicación clara sin jerga
- Ejemplos prácticos que puede adaptar
- Ejercicios pequeños para practicar
- Guía para detectar errores
- Consejos de privacidad

**Diferencia vs competencia:**
- No es teoría de modelos (superficial)
- No es lista de prompts sin contexto
- ES: método repetible + checklist + seguridad
```

**Preguntas:**
- [ ] ¿Es realista?
- [ ] ¿Es diferente?
- [ ] ¿Resuelve un problema real?

---

## 💰 PASO 2: Decisiones Operacionales (CRÍTICO)

**Owner:** Product/Sarah  
**Duración:** 1-2 días  
**Bloqueador:** SÍ - afecta presupuesto y timeline  

### Tareas:

#### ☐ Canal de Publicación

```
Opciones:
  A) Amazon KDP (más simple, sin costo de publicación)
  B) Gumroad (mejor para solopreneurs)
  C) Tu propia web + Stripe
  D) Múltiples canales

Recomendación: Amazon KDP (explora después)
Requisitos KDP:
  - EPUB o PDF
  - Metadata: title, description, category, price
  - Cover image (800x600 minimum)
  - ISBN (KDP genera uno gratis para ebook)
```

**Decisión:**
- [ ] Amazon KDP confirmado
- [ ] O... ¿cuál?

#### ☐ Precio

```
Rango típico para ebooks educativos:
  $4.99  - Muy barato (parecerá poco serio)
  $9.99  - Estándar (buena conversión)
  $14.99 - Premium (si es muy específico)

Recomendación: $9.99 para piloto
```

**Decisión:**
- [ ] Precio: $______

#### ☐ Presupuesto de Anuncios

```
Opciones:
  A) $0 (solo organic, si tienes audiencia)
  B) $100-200 (test pequeño)
  C) $500+ (serio)

Recomendación: $100-200 para piloto (test)

Canales:
  - Amazon Ads (si KDP)
  - Facebook/Instagram Ads
  - Google Ads
  - Newsletter propia
```

**Decisión:**
- [ ] Budget: $______

#### ☐ Umbrales de Decisión

```
"Continuamos o no basado en:"

Después de 6 semanas de venta:

CONTINUAR SI:
  - 50+ compras en es-MX
  - 30+ compras en en-US
  - OR: 10+ comentarios positivos
  - OR: 15+ ratings 4+ stars

ITERAR SI:
  - 20-50 compras (cambiar cover, descripción, precio)
  - <5 comentarios pero high retention

DETENER SI:
  - <10 compras total
  - Mostly negative comments
  - High refund rate (>20%)
```

**Decisión:**
- [ ] ¿Estos umbrales son razonables?

#### ☐ Período de Prueba

```
Estándar: 6 semanas
  - Semana 1-2: Launch + initial buzz
  - Semana 3-4: Ads running, initial data
  - Semana 5-6: Stabilize, gather feedback

Después de 6 semanas: reunión de decisión
```

**Decisión:**
- [ ] ¿6 semanas es correcto?

---

## 🖥️ PASO 3: Setup de Ambiente Dev (1 día)

**Owner:** Dev  
**Duración:** 4-8 horas  

### Tareas:

#### ☐ Clonar y Setup Repo

```bash
git clone https://github.com/hon021/ebook-factory.git
cd ebook-factory
npm install
```

#### ☐ Inicializar Base de Datos

```bash
# Option 1: CLI
sqlite3 ebook-factory.db < src/orchestrator/schema.sql

# Option 2: Code
npm run init:db
```

#### ☐ Test Orchestrator

```bash
# Run examples
npm run test:orchestrator

# Expected: Can create project, advance stages, create gates
```

#### ☐ Confirmar Dev Environment

- [ ] Node.js versión correcta
- [ ] npm packages instalados
- [ ] DB inicializada
- [ ] Orchestrator testeable
- [ ] Git funcionando

---

## 🛠️ PASO 4: Intake Skill (Semana 2, Día 1-2)

**Owner:** Dev (cualquier developer)  
**Dependencias:** Brief final + Orchestrator ✅  
**Tiempo:** 4-6 horas  

### Qué hace:

```
INPUT:  Raw brief (JSON, form, markdown)
        ↓
NORMALIZE: Map to standard fields
        ↓
VALIDATE: Check required fields
        ↓
OUTPUT: Artifact en BD + validation results
```

### Estructura:

```typescript
// src/skills/intake-skill.ts

interface IntakInput {
  raw_brief: string | object;  // Cualquier formato
  submitted_by: string;
}

interface IntakeOutput {
  artifact_id: string;
  status: 'valid' | 'invalid';
  normalized_brief: {
    title: string;
    genre: string;
    theme: string;
    target_audience: string;
    promise: string;
    // ... etc
  };
  validation_errors: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

async function intakeSkill(input: IntakeInput): Promise<IntakeOutput> {
  // 1. Parse raw input
  // 2. Extract fields
  // 3. Normalize to standard format
  // 4. Validate using STAGE_VALIDATION_RULES.intake
  // 5. Create artifact in DB
  // 6. Return result
}
```

### Criterios de aceptación:

- [ ] Acepta entrada cruda (cualquier formato)
- [ ] Normaliza a campos estándar
- [ ] Valida contra schema
- [ ] Crea artifact en BD
- [ ] Retorna JSON limpio
- [ ] Maneja errores

### Integrate con Orchestrator:

```typescript
// Use the skill in your pipeline
const orchestrator = await initializeOrchestrator('./ebook.db');
const project = await orchestrator.createProject({ ... });

const result = await intakeSkill({
  raw_brief: incomingBrief,
  submitted_by: 'user-sarah'
});

const artifact = await orchestrator.createArtifact(
  project.id,
  'intake',
  'brief',
  'path/to/brief.md',
  result.normalized_brief,
  'skill-intake'
);

const errors = result.validation_errors;
if (errors.filter(e => e.severity === 'error').length === 0) {
  await orchestrator.advanceStage(project.id, 'intake', 'approved', 'skill-intake');
}
```

---

## 🔍 PASO 5: Research Skill (Semana 2, Día 2-3)

**Owner:** Dev  
**Dependencias:** Intake ✅ + Brief ✅  
**Tiempo:** 6-8 horas  

### Qué hace:

Para **educativo** (tu caso):
```
INPUT:  Brief aprobado
        ↓
SEARCH: Buscar 10+ fuentes verificables
        ↓
COMPILE: Dossier con URLs + fechas
        ↓
OUTPUT: Artifact en BD + metadata
```

### Estructura:

```typescript
// src/skills/research-skill.ts

async function researchSkill(
  projectId: string,
  genre: 'educational' | 'mystery' | 'romance' | 'children' | 'adult'
): Promise<ResearchOutput> {
  
  if (genre === 'educational') {
    // 1. Get brief from DB
    // 2. Extract topic/keywords
    // 3. Search web + local docs
    // 4. Verify URLs
    // 5. Compile source dossier
    // 6. Create artifact
    
    return {
      artifact_id: 'art-xxx',
      sources_count: 12,
      source_list: [
        {
          title: 'Source Title',
          url: 'https://...',
          date_accessed: '2026-10-30',
          relevance: 'Defines what AI can do',
          quote: '...'
        }
      ]
    };
  }
  
  if (genre === 'mystery') {
    // Similar but: find setting context, historical facts, etc.
  }
}
```

### Criterios de aceptación:

- [ ] Lee proyecto desde BD
- [ ] Compila 10+ fuentes verificables
- [ ] URLs son válidas
- [ ] Documenta fecha de acceso
- [ ] Crea artifact en BD
- [ ] Retorna structured output

---

## 📐 PASO 6: Design Skill (Semana 2, Día 3 - Semana 3, Día 1)

**Owner:** Dev  
**Dependencias:** Research ✅  
**Tiempo:** 8-12 horas  

### Qué hace:

```
INPUT:  Brief + Research
        ↓
GENERATE:
  - Promise (qué aprenderá)
  - Outline (capítulos, temas)
  - Objectives (para educativo) o Estructura narrativa (para ficción)
        ↓
VALIDATE: Contra género profile
        ↓
OUTPUT: 3 artifacts en BD
        ↓
CREATE: Gate 1 para aprobación humana
```

### Estructura:

```typescript
// src/skills/design-skill.ts

async function designSkill(
  projectId: string,
  genre: string
): Promise<DesignOutput> {
  
  // 1. Get brief + research from DB
  // 2. Generate promise
  const promise = await generatePromise(brief);
  
  // 3. Generate outline
  const outline = await generateOutline(brief, genre);
  
  // 4. Generate genre-specific
  if (genre === 'educational') {
    const objectives = await generateObjectives(outline);
  } else if (genre === 'mystery') {
    const structure = await generateStructure(outline);
  }
  
  // 5. Create artifacts
  const promiseArt = await orch.createArtifact(projectId, 'design', 'promise', ...);
  const outlineArt = await orch.createArtifact(projectId, 'design', 'outline', ...);
  const objArt = await orch.createArtifact(projectId, 'design', 'objectives', ...);
  
  // 6. Create Gate 1
  const gate = await orch.createGate(
    projectId,
    'design',
    'Editorial Design Approval',
    outlineArt.id,
    'skill-design'
  );
  
  return {
    artifacts: [promiseArt, outlineArt, objArt],
    gate_id: gate.id,
    status: 'awaiting_approval'
  };
}
```

### Criterios de aceptación:

- [ ] Lee brief + sources
- [ ] Genera promise clara
- [ ] Genera outline completo
- [ ] Genera objetivos/estructura
- [ ] Crea 3 artifacts
- [ ] Crea Gate 1
- [ ] Resultado es revisable

---

## 🎯 MILESTONE: Gate 1 - Editorial Design Approval

**Cuándo:** Después de Design Skill  
**Quién decide:** Human editor (Sarah o alguien)  

### Flujo:

```
1. Design skill genera 3 artifacts
2. Crea Gate 1 para review
3. [HUMANO] Editor abre Gate 1
   Revisa:
   - ¿Promise es clara?
   - ¿Outline tiene sentido?
   - ¿Capítulos cubren promesa?
   - ¿Es realista el scope?
4. [HUMANO] Decide:
   ✓ APPROVE  → Siguiente fase desbloqueada
   ⚠ CHANGES  → Skill regenera outline + nuevo gate
   ✗ REJECT   → Proyecto bloqueado

5. Si APPROVED:
   - Orchestrator actualiza status a "approved"
   - Sample + Manuscript skills pueden empezar
```

### Lo importante:

**Gate 1 es donde se decide si el libro tiene sentido.**

Si falla aquí = no continúes escribiendo (gastarás tiempo).

---

## 📊 Timeline Detallado

```
HOY (2026-10-30):
  ├─ Revisar este plan
  ├─ Hacer preguntas
  └─ Confirmar decisiones

MAÑANA (2026-10-31):
  ├─ Brief editorial finalizado
  ├─ Decisiones operacionales
  └─ Setup dev environment

VIERNES (2026-11-01):
  ├─ Start Intake skill
  └─ Test con brief real

LUNES (2026-11-04):
  ├─ Intake skill DONE
  ├─ Start Research skill
  └─ First project intake → research

MARTES-MIÉRCOLES (2026-11-05 to 06):
  ├─ Research skill DONE
  ├─ Start Design skill
  └─ First project through research

JUEVES-VIERNES (2026-11-07 to 08):
  ├─ Design skill DONE
  ├─ Gate 1 created
  └─ [HUMANO] Editorial review

LUNES (2026-11-11):
  ├─ Gate 1 decided
  ├─ If approved → Start Sample + Manuscript skills
  └─ If changes → Iterate design
```

---

## ❓ Preguntas para Ti

Ahora:

1. **Editorial:**
   - ¿Brief está OK o necesita cambios?
   - ¿Índice tiene sentido?
   - ¿Qué público exacto?

2. **Product:**
   - ¿Amazon KDP confirmado?
   - ¿Precio? Presupuesto anuncios?
   - ¿Umbrales de decisión OK?

3. **Dev:**
   - ¿Ambiente dev ready?
   - ¿Puedo empezar Intake skill mañana?
   - ¿Necesitas ajustes en Orchestrator?

---

## 📌 Resumen: Los Próximos 2 Pasos

### INMEDIATO (Esta semana):
1. ✅ Finalizar Brief
2. ✅ Decisiones operacionales
3. ✅ Setup dev

### PRÓXIMA SEMANA:
1. 🔄 Intake Skill (día 1-2)
2. 🔄 Research Skill (día 2-3)
3. 🔄 Design Skill (día 3+)
4. 🔄 Gate 1 review + decision

**Después:** Sample + Manuscript (semana 3-4)

---

**¿Hay dudas o cambios? Pregunta ahora.**

