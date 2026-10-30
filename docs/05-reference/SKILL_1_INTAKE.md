# Skill 1: INTAKE

## Descripción

La Skill de **Intake** normaliza el brief editorial (archivo markdown) a una estructura JSON estructurada, valida todos los campos requeridos y crea un artifact en la base de datos.

Esta es la primera skill del pipeline editorial y es crítica para el flujo de Fase 2.

---

## 🎯 Objetivo

Transformar:
```
Brief Editorial (markdown)
    ↓
    ↓ [Skill 1: INTAKE]
    ↓
Artifact Normalizado (JSON)
```

---

## 📥 Input

**Archivo:** `docs/01-brief/BRIEF_EDITORIAL.md`

- Brief editorial en formato markdown
- Contiene bloque JSON con los metadatos del libro
- 24K, 8 capítulos definidos

**Estructura esperada:**
```markdown
# Brief Editorial: "IA útil en el trabajo"

**Versión:** 1.0 Final  
**Creado:** 2026-10-30  
**Estado:** Listo para producción  

---

## 📋 BRIEF NORMALIZADO (JSON)

```json
{
  "book": {
    "title": "...",
    "genre": "educational",
    "promise": "...",
    ...
  }
}
```
```

---

## 📤 Output

**Artifact Type:** `normalized-brief`  
**Status:** `approved`

### JSON Structure:
```json
{
  "metadata": {
    "created_date": "2026-10-30",
    "version": "1.0",
    "status": "approved"
  },
  "book": {
    "title": "IA útil en el trabajo",
    "genre": "educational",
    "promise": "Learn to use AI for work tasks...",
    "target_audience": {...},
    "estimated_word_count": 48000,
    "estimated_chapter_count": 8,
    ...
  },
  "positioning": {...}
}
```

---

## ✅ Validaciones

La skill valida:

### Campos String Requeridos:
- ✅ `title` (3-200 caracteres)
- ✅ `genre` (one of: educational, mystery, romance, children, adult_erotism)
- ✅ `theme` (5-500 caracteres)
- ✅ `promise` (20-1000 caracteres)
- ✅ `language` (2-10 caracteres, e.g., "es-MX")
- ✅ `format` (2-20 caracteres, e.g., "epub")
- ✅ `reading_level` (2-50 caracteres)
- ✅ `content_classification` (2-50 caracteres)

### Campos Numéricos Requeridos:
- ✅ `estimated_word_count` (5000-200000)
- ✅ `estimated_chapter_count` (1-50)

### Secciones Requeridas:
- ✅ `book` (objeto)
- ✅ `target_audience` (objeto con `primary_description`)

### Validación de Enum:
- ✅ Genre debe estar en lista permitida

**Severity Levels:**
- 🔴 **error**: Bloquea el procesamiento
- 🟡 **warning**: Recomendación (no bloquea)
- ⚪ **info**: Información (no bloquea)

---

## 💻 Implementación

### Clase Principal:

```typescript
class IntakeSkill {
  async process(briefPath: string, projectId: string): Promise<Artifact>
}
```

### Métodos Privados:

1. **readBrief()** — Lee el archivo markdown
2. **extractAndParseJson()** — Extrae el bloque JSON del markdown
3. **validateBrief()** — Valida todos los campos
4. **createArtifact()** — Crea artifact en DB
5. **advanceStage()** — Avanza la etapa

### Flujo de Ejecución:

```
1. readBrief(path)
   ↓
2. extractAndParseJson(content)
   ↓
3. validateBrief(json)
   → Si hay errores: throw ValidationError
   ↓
4. createArtifact(projectId, json)
   ↓
5. advanceStage(projectId, artifactId)
   ↓
6. Return artifact con metadatos
```

---

## 📊 Resultados

### Success Response:

```json
{
  "artifact": {
    "id": "art-intake-001",
    "project_id": "proj-123",
    "stage": "intake",
    "artifact_type": "normalized-brief",
    "version": 1,
    "is_current": true,
    "status": "approved",
    "created_at": "2026-11-06T10:30:00Z"
  },
  "validated_fields": [
    "title", "genre", "theme", "promise", "language", "format", ...
  ],
  "total_validation_passed": true,
  "message": "Brief intake completed successfully"
}
```

### Error Response:

```json
{
  "error": "ValidationError",
  "message": "Brief validation failed",
  "errors": [
    {
      "field": "title",
      "rule": "required",
      "message": "Field 'title' is required",
      "severity": "error"
    },
    {
      "field": "estimated_word_count",
      "rule": "min_value",
      "message": "Field 'estimated_word_count' must be at least 5000",
      "severity": "error"
    }
  ]
}
```

---

## 🚀 Uso

### Código:

```typescript
import { initializeOrchestrator } from './init';
import { IntakeSkill } from './skills/intake';

const orchestrator = await initializeOrchestrator('./ebook-factory.db');
const intakeSkill = new IntakeSkill(orchestrator);

const result = await intakeSkill.process(
  'docs/01-brief/BRIEF_EDITORIAL.md',
  projectId
);

console.log(`Created artifact: ${result.artifact.id}`);
console.log(`Validated fields: ${result.validated_fields.length}`);
```

### Línea de Comando:

```bash
npm run build
node dist/orchestrator/skills/examples.js
```

---

## ⏱️ Complejidad

- **Tiempo:** 4-6 horas
- **Complejidad:** BAJA
- **Líneas de Código:** ~400 TypeScript
- **Dependencias:** Orchestrator, File System, JSON parsing

---

## ✨ Características

✅ Parseo robusto de markdown  
✅ Validación exhaustiva de campos  
✅ Mensajes de error claros  
✅ Integración con Orchestrator  
✅ Artifact versionado  
✅ Audit trail automático  
✅ Tipo-seguro (TypeScript)  

---

## 🔗 Siguiente Skill

Después de completar Skill 1 (Intake):

→ **Skill 2: Research** (9 horas)
- Buscar 10+ fuentes autorizadas
- Evaluar credibilidad
- Crear dossier de fuentes
- Anotar por capítulo

---

## 📚 Archivo

- **Código:** `src/orchestrator/skills/intake.ts`
- **Ejemplos:** `src/orchestrator/skills/examples.ts`
- **Compilado:** `dist/orchestrator/skills/intake.js`
