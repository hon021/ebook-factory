# 🎯 ¿Qué Sigue? - Roadmap Post-Orchestrator

**Escrito:** 2026-10-30  
**Basado en:** Análisis del proyecto + Orchestrator implementado  
**Objetivo:** Claridad sobre próximos pasos (semanas 2-4)

---

## 🏗️ Fases Recomendadas

### FASE 1: Clarificación Editorial (Esta Semana - Esta Semana)
**Duración:** 3-5 días  
**Owner:** Editorial (Sarah, equipo)  
**Dependencias:** Ninguna  
**Bloqueador:** No (puedes hacer en paralelo)

#### Tareas
1. **Confirmar brief del piloto educativo**
   - [ ] Título final (¿"IA útil en el trabajo" o variante?)
   - [ ] Público exacto (descripción de 50+ caracteres)
   - [ ] Promesa verificable (qué aprenderá el lector)
   - [ ] Tono y estilo (simple, accesible, etc.)
   - [ ] Restricciones de contenido (lenguaje, temas)

2. **Definir índice inicial** (capítulos y temas)
   - [ ] 6-8 capítulos propuestos
   - [ ] Temas por capítulo
   - [ ] Ejercicios previstos
   - [ ] Palabras estimadas

3. **Decidir sobre publicación**
   - [ ] Canal confirmado (¿Amazon KDP?)
   - [ ] Precio estimado (¿$9.99? ¿$14.99?)
   - [ ] Presupuesto de anuncios
   - [ ] Umbrales de éxito (cuándo parar/continuar)
   - [ ] Período de prueba (6 semanas propuesto)

4. **Revisar propuesta de valor**
   - [ ] ¿Es realista?
   - [ ] ¿Es diferente de competencia?
   - [ ] ¿Resuelve un problema real?

**Deliverable:** Brief normalizado en formato standar (↓ Intake form)

---

### FASE 2: Validación Técnica (Semana 2)
**Duración:** 3-5 días  
**Owner:** Dev + Test  
**Dependencias:** Orchestrator ✅ (ya hecho)  
**Bloqueador:** No

#### Tareas
1. **Configurar ambiente de desarrollo**
   - [ ] Clonar repo: `git clone ...`
   - [ ] Instalar deps: `npm install`
   - [ ] Inicializar BD: `npm run init:db`
   - [ ] Confirmar acceso a DB

2. **Testear orchestrator con proyecto dummy**
   - [ ] Crear proyecto de prueba
   - [ ] Crear artifact en intake
   - [ ] Validar campos
   - [ ] Avanzar a siguiente stage
   - [ ] Crear gate y decidir
   - [ ] Consultar status y audit trail
   
3. **Revisar código y documentación**
   - [ ] ¿Son claros los flujos?
   - [ ] ¿Faltan edge cases?
   - [ ] ¿La BD es eficiente?
   
4. **Documentar cualquier ajuste**
   - [ ] Cambios en schema
   - [ ] Cambios en lógica
   - [ ] Cambios en validaciones

**Deliverable:** Orchestrator validado, listo para usar en desarrollo

---

### FASE 3: Skills Core - Batch 1 (Semanas 2-3)
**Duración:** 1-2 semanas  
**Owner:** Dev (diferentes devs pueden trabajar en paralelo)  
**Dependencias:** Orchestrator ✅, Brief aprobado  
**Bloqueador:** Sí (necesita brief para empezar)

#### Tareas - Skill Intake

```typescript
// src/skills/intake-skill.ts
async function intakeSkill(rawBrief: any) {
  // 1. Recibir brief crudo (JSON o form)
  // 2. Normalizar campos
  // 3. Validar contra schema
  // 4. Generar preguntas para campos faltantes
  // 5. Crear artifact en BD
  // 6. Retornar: normalized brief + validation errors (si hay)
  
  return {
    artifact_id: "art-xxx",
    status: "valid" | "invalid",
    normalized_brief: { ... },
    missing_fields: [ ... ],
    warnings: [ ... ]
  }
}
```

**Criterios de aceptación:**
- [ ] Recibe entrada cruda (cualquier formato)
- [ ] Normaliza a campos estándar
- [ ] Valida contra STAGE_VALIDATION_RULES.intake
- [ ] Crea artifact en BD
- [ ] Retorna JSON con resultado
- [ ] Maneja errores gracefully

**Entrega:** Skill que acepta brief crudo → artifact normalizado

#### Tareas - Skill Research

```typescript
// src/skills/research-skill.ts
async function researchSkill(briefId: string, genre: string) {
  // 1. Leer brief del proyecto
  // 2. Extraer tema
  // 3. Ejecutar búsqueda de fuentes (web + local docs)
  // 4. Para non-fiction (educativo): compilar sources dossier
  // 5. Para ficción (misterio): investigar setting/context
  // 6. Crear artifact en BD
  // 7. Retornar: sources + metadata
  
  return {
    artifact_id: "art-xxx",
    sources_count: 12,
    source_list: [ ... ],
    metadata: { ... }
  }
}
```

**Criterios de aceptación:**
- [ ] Lee proyecto desde BD
- [ ] Compila 10+ fuentes verificables (para non-fic)
- [ ] Verifica URLs son válidas
- [ ] Documenta fecha de acceso
- [ ] Crea artifact en BD
- [ ] Retorna structured output

**Entrega:** Skill que genera dossier de fuentes

#### Tareas - Skill Design

```typescript
// src/skills/design-skill.ts
async function designSkill(projectId: string, genre: string) {
  // 1. Leer brief + sources del proyecto
  // 2. Generar promise (qué aprenderá/experimentará el lector)
  // 3. Generar índice (capítulos, temas)
  // 4. Para educativo: generar objetivos de aprendizaje
  // 5. Para ficción: crear estructura narrativa + personajes
  // 6. Crear 3 artifacts (promise, outline, objectives/characters)
  // 7. Retornar: lista de artifacts
  
  return {
    promise_artifact_id: "art-xxx",
    outline_artifact_id: "art-yyy",
    objectives_artifact_id: "art-zzz",
    validation_status: "valid" | "review_needed"
  }
}
```

**Criterios de aceptación:**
- [ ] Lee brief + sources
- [ ] Genera promise clara (no genérica)
- [ ] Genera outline completo (6-8 capítulos)
- [ ] Genera objetivos/estructura apropiada
- [ ] Crea artifacts en BD
- [ ] Valida según GENRE_PROFILES[genre]

**Entrega:** Skill que genera diseño editorial completo

---

### FASE 4: Pilot Book V1 - Research + Design (Semana 3-4)
**Duración:** 1-2 semanas  
**Owner:** Skills + Editorial  
**Dependencias:** Orchestrator ✅, Skills intake/research/design ✅  
**Bloqueador:** Sí (esperar skills)

#### Proceso (Usando Orchestrator)

```
Project: "IA útil en el trabajo" (es-MX)

1. Create project vía API
   POST /projects
   {
     title: "IA útil en el trabajo",
     genre: "educational",
     language: "es-MX",
     ...
   }

2. Run intake skill
   → Normaliza brief
   → Crea artifact en BD
   → Avanza stage a "approved"

3. Run research skill
   → Compila fuentes
   → Crea artifact en BD
   → Avanza stage a "approved"

4. Run design skill
   → Genera promise + outline + objectives
   → Crea 3 artifacts en BD
   → Crea GATE 1 (design approval)

5. [HUMANO] Revisa design
   → Approves o Request Changes

6. [FEEDBACK] Si request_changes:
   → Regenerar outline
   → Crear nuevo artifact
   → Crear nuevo gate
   → [HUMANO] Revisa again
   → Hasta que approved

7. Design aprobado → Siguiente fase
```

**Deliverable:** 
- Brief normalizado ✓
- Dossier de fuentes ✓
- Promise + Outline + Objectives aprobados ✓
- Gate 1 completado ✓

---

### FASE 5: Pilot Book V1 - Manuscript (Semana 4-5)
**Duración:** 1-2 semanas  
**Owner:** Manuscript skill (probablemente Claude/Copilot)  
**Dependencias:** Phase 4 complete ✓  
**Bloqueador:** Sí

#### Skills Needed
- Sample skill (escribir 1 capítulo test)
- Manuscript skill (escribir todo el libro)

#### Proceso (Usando Orchestrator)

```
Post-Gate-1-Approval:

1. Run sample skill (test design)
   → Escribe capítulo 1 (5K words)
   → Crea artifact
   → Run QA checks (vocabulario, claridad, ejercicio)
   → Crea artifact en BD
   → Avanza sample stage

2. Run manuscript skill (full book)
   → Escribe 8 capítulos (~45K words)
   → Mantiene índice del brief
   → Incluye referencias a fuentes
   → Tracks changes
   → Crea artifact en BD
   → Avanza manuscript stage

3. [QA] Review sample
   → Grammar, style, clarity
   → ¿Matches genre profile?
   → Approve o block

4. [QA] Review manuscript
   → Estructura completa
   → Consistencia
   → Todos ejercicios presentes
   → Approve o request changes
```

**Deliverable:**
- Muestra capítulo ✓
- Manuscrito completo ✓
- Aprobación de QA ✓

---

### FASE 6: Pilot Book V1 - Edición (Semana 5-6)
**Duración:** 1 semana  
**Owner:** Editing skill + Human reviewers  
**Dependencias:** Phase 5 complete ✓  
**Bloqueador:** Sí

#### Skills Needed
- Editing skill (sustantivo + línea + lenguaje)

#### Proceso

```
1. Run editing skill (es-MX variant)
   → Revisa structure y flow
   → Edición de línea (clarity, concisión)
   → Corrección de lenguaje (es-MX specific)
   → Track todos los cambios
   → Crea artifact "edited-es-MX-v1"

2. [HUMAN] Human editor review
   → ¿Cambios son correctos?
   → ¿Tono y voz preservados?
   → ¿Localization apropiada?
   → Approve o suggest changes

3. Repeat si necessary

4. Final manuscript ready
```

**Deliverable:**
- Manuscrito editado ✓
- Todos cambios tracked ✓
- Aprobación humana ✓

---

### FASE 7: Pilot Book V1 - QA + Production (Semana 6-7)
**Duración:** 1 semana  
**Owner:** QA skill + Production skill  
**Dependencias:** Phase 6 complete ✓  
**Bloqueador:** Sí

#### Skills Needed
- QA skill (genre-specific validation)
- Production skill (formato EPUB/PDF)

#### Proceso

```
1. Run QA skill
   → Educativo checklist: 10 items
   → Verificar todas claims traceable
   → Verificar ejercicios tienen soluciones
   → Generar defect report
   → Crea artifact "qa-report"
   → [GATE 2] Request final approval

2. [HUMAN] QA Manager review
   → ¿Todos defects críticos fixed?
   → ¿Genre checklist passed?
   → Approve o reject

3. If approved:
   
4. Run production skill
   → Format to EPUB
   → Generar metadata (title, author, etc.)
   → Integrar cover image
   → Validar file
   → Crea artifact "product-package"

5. [FINAL] Manuscript ready to publish
```

**Deliverable:**
- QA report + Gate 2 approval ✓
- EPUB file listo ✓
- Metadata correcto ✓

---

## 📊 Timeline Propuesto

```
WEEK 1 (Oct 30 - Nov 5)
├─ Clarify editorial (brief, index, pricing)
├─ Validate orchestrator with team
└─ Start skills planning

WEEK 2 (Nov 6 - 12)
├─ Build intake skill ✓
├─ Build research skill ✓
├─ Build design skill ✓
└─ Run pilot through design stage + Gate 1

WEEK 3 (Nov 13 - 19)
├─ Build sample skill ✓
├─ Build manuscript skill ✓
└─ Run pilot: sample + manuscript complete

WEEK 4 (Nov 20 - 26)
├─ Build editing skill ✓
├─ Run pilot: editing complete + human review
└─ QA manuscript

WEEK 5 (Nov 27 - Dec 3)
├─ Build QA skill ✓
├─ Build production skill ✓
├─ Run pilot: final QA + GATE 2
└─ Produce EPUB

WEEK 6 (Dec 4 - 10)
├─ Prepare for publication (metadata, cover, price)
├─ Test en-US variant (English translation/localization)
└─ Ready for Amazon KDP launch

WEEK 7+ (Dec 11+)
├─ Publish es-MX on Amazon KDP
├─ Publish en-US on Amazon KDP
├─ Monitor sales, returns, feedback
└─ Gather data for decision
```

---

## 🎯 Decisiones Pendientes

### Críticas (necesarias ESTA SEMANA)
- [ ] ¿Título final del libro?
- [ ] ¿Descripción exacta del público?
- [ ] ¿Amazon KDP o canal diferente?
- [ ] ¿Precio estimado?
- [ ] ¿Presupuesto para anuncios?

### Importantes (necesarias para semana 2)
- [ ] ¿Quién revisa designs? (qué editora)
- [ ] ¿Quién revisa QA? (qué gerente)
- [ ] ¿Velocidad esperada? (semanas? días?)
- [ ] ¿Budget para skills? (¿API costs? ¿equipo?)

### Operacionales (para después)
- [ ] ¿Cómo manejo de cover design?
- [ ] ¿Cómo recolección de metadata (ISBN, etc.)?
- [ ] ¿Notificaciones de gates? (email? Slack?)
- [ ] ¿Dashboard para tracking?

---

## 💼 Estimaciones de Esfuerzo

| Tarea | Horas | Owner | Risk |
|-------|-------|-------|------|
| Clarificar brief | 4 | Editorial | Low |
| Validar orchestrator | 4 | Dev | Low |
| Intake skill | 4 | Dev | Low |
| Research skill | 6 | Dev | Medium |
| Design skill | 8 | Dev | Medium |
| Sample skill | 6 | Dev | Medium |
| Manuscript skill | 12 | AI (Claude) | High |
| Editing skill | 8 | Dev | Medium |
| QA skill | 6 | Dev | Low |
| Production skill | 4 | Dev | Low |
| Testing & fixes | 8 | Dev | Low |
| **TOTAL** | **70 hours** | **Mixed** | **Medium** |

**Rough estimate:** 2 engineers + Claude for 4 weeks = feasible

---

## 🚀 Recomendación

### Do Este Week
1. ✅ **Aceptar orchestrator** (ya hecho)
2. 🔄 **Clarificar brief editorial** (task: editorial)
3. 🔄 **Validar DB + code** (task: dev, 1 day)

### Start Next Week
4. 🔄 **Construir intake skill** (1-2 days)
5. 🔄 **Construir research skill** (1-2 days)
6. 🔄 **Construir design skill** (1-2 days)
7. 🔄 **Test flow intake → design** (1 day)

### Parallel
8. 🔄 **Planificar manuscript skill** (pre-build)
9. 🔄 **Preparar UI/dashboard** (puede empezar ahora)
10. 🔄 **Investigar Amazon KDP requirements** (preparation)

---

## ❓ Questions for Team

1. **Editorial**: ¿Está ok el brief? ¿Cambios a propuesta?
2. **Dev**: ¿Es claro el orchestrator? ¿Necesitas ajustes antes de skills?
3. **Product**: ¿Velocidad? ¿Preferencia Amazon vs otros canales?
4. **Budget**: ¿Puedo usar Claude/GPT-4 para manuscript skill? ¿API costs ok?

---

## 📝 Next Document

When ready for skills phase, we'll need:
- [ ] Skills technical spec
- [ ] Skill interface definitions (inputs/outputs)
- [ ] Integration with orchestrator checklist
- [ ] Testing strategy per skill

