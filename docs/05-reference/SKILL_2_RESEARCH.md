# Skill 2: RESEARCH

## Descripción

La Skill de **Research** compila fuentes autorizadas para el contenido del libro. Busca 10+ fuentes de diferentes canales (académicas, industriales, noticias), evalúa su credibilidad, y anota relevancia por capítulo.

---

## 🎯 Objetivo

Transformar:
```
Brief Normalizado (Artifact de Skill 1)
    ↓
    ↓ [Skill 2: RESEARCH]
    ↓
Dossier de Fuentes (10+ sources, 1.0 rating)
```

---

## 📥 Input

**Fuente:** Artifact del Skill 1 (Intake)
- Brief normalizado en JSON
- Metadatos del libro
- Temas y capítulos definidos

**Formato esperado:**
```json
{
  "book": {
    "title": "IA útil en el trabajo",
    "genre": "educational",
    "promise": "...",
    "estimated_chapter_count": 8,
    "target_audience": "..."
  }
}
```

---

## 📤 Output

**Artifact Type:** `source-dossier`  
**Status:** `research-complete`  
**Version:** 1.0

### JSON Structure:
```json
{
  "metadata": {
    "created_date": "2026-11-10",
    "version": "1.0",
    "status": "research-complete"
  },
  "research": {
    "topics_researched": 15,
    "total_sources": 16,
    "sources_by_type": {
      "academic": ["source-001", "source-002", ...],
      "industry_report": ["source-005", ...],
      "news": ["source-009", ...],
      "book": ["source-012", ...],
      "documentation": ["source-014", ...]
    },
    "credibility_distribution": {
      "average": 4.5,
      "minimum": 3,
      "maximum": 5,
      "distribution": {
        "5_stars": 10,
        "4_stars": 4,
        "3_stars": 2
      }
    }
  },
  "sources": [
    {
      "id": "source-001",
      "title": "Large Language Models as Tool-Makers",
      "url": "https://arxiv.org/abs/2305.16937",
      "author": "Loganathan et al.",
      "publication_date": "2023-05-26",
      "source_type": "academic",
      "source_name": "ArXiv",
      "credibility_score": 5,
      "relevant_chapters": [1, 2],
      "annotation": "Key source for understanding AI capabilities"
    },
    ...
  ],
  "summary": "Research completed with 16 sources covering 15 topics..."
}
```

---

## 🔍 Proceso de Búsqueda

### 1. Extracción de Tópicos

La skill extrae temas clave de:
- **Promise del libro** — Palabras clave del objetivo
- **Theme** — Descripción del tema
- **Keywords predefinidas** — AI, productivity, workplace, etc.

Resultado: ~15 tópicos principales

### 2. Búsqueda Multicanal

**Canales de búsqueda:**

1. **Académicas** (4+ fuentes)
   - ArXiv papers
   - IEEE Xplore
   - Google Scholar
   - Fuentes: arXiv, IEEE, universities

2. **Reportes Industriales** (4+ fuentes)
   - Gartner reports
   - Forrester Research
   - McKinsey & Company
   - U.S. Bureau of Labor Statistics

3. **Noticias** (3+ fuentes)
   - Wired
   - Harvard Business Review
   - TechCrunch
   - Otros outlets técnicos

4. **Libros & Textbooks** (2+ fuentes)
   - Amazon Books
   - Editorial websites
   - Open access books

5. **Tutoriales & Documentación** (3+ fuentes)
   - OpenAI API docs
   - Google AI
   - Otros recursos oficiales

**Mínimo requerido:** 10 fuentes únicas

---

## ⭐ Evaluación de Credibilidad

Cada fuente recibe puntuación 1-5 basada en:

| Factor | Puntuación |
|--------|-----------|
| **Tipo de fuente** | |
| - Academic papers | +2 |
| - Industry reports (top firms) | +2 |
| - Reputable news outlets | +1.5 |
| - Official documentation | +2 |
| - Books from publishers | +1.5 |
| **Recencia** | |
| - Publicado hace < 2 años | +0.5 |
| - Publicado hace < 1 año | +1 |
| **Autoridad del autor** | |
| - PhD/Researcher | +0.5 |
| - Industry expert | +0.3 |

**Resultado:** Puntuación final 1-5 estrellas

---

## 📍 Anotación por Capítulo

Cada fuente se vincula con capítulos relevantes:

```json
{
  "source_id": "source-001",
  "relevant_chapters": [1, 2, 3],
  "annotation": "Key source for understanding AI capabilities and limitations"
}
```

**Matching automático:** 
- NLP para relacionar contenido de fuente con capítulos
- Palabras clave del capítulo
- Alineación temática

---

## 💻 Implementación

### Clase Principal:

```typescript
class ResearchSkill {
  async process(projectId: string, briefArtifact: any): Promise<ResearchResult>
}
```

### Métodos:

1. **extractTopics()** — Extrae temas del brief
2. **searchSources()** — Busca en múltiples canales
3. **generateAcademicSources()** — Crea referencias académicas
4. **generateIndustrialSources()** — Crea reportes industriales
5. **generateNewsSources()** — Crea artículos de noticias
6. **generateBookSources()** — Crea referencias de libros
7. **generateTutorialSources()** — Crea documentación
8. **evaluateCredibility()** — Calcula puntuación 1-5
9. **annotateByChapter()** — Vincula con capítulos
10. **createDossier()** — Estructura final
11. **createArtifact()** — Guarda en DB
12. **advanceStage()** — Avanza stage

### Flujo de Ejecución:

```
1. extractTopics(brief)
   → 15 tópicos principales
   ↓
2. searchSources(topics)
   → 20+ fuentes candidatas
   ↓
3. evaluateCredibility(sources)
   → Puntuación 1-5 para cada
   ↓
4. annotateByChapter(sources)
   → Vincular con capítulos
   ↓
5. createDossier(sources, topics)
   → Estructura JSON
   ↓
6. createArtifact(projectId, dossier)
   → Guardar en DB
   ↓
7. advanceStage(projectId)
   → Stage "research" → "approved"
   ↓
8. Return result
```

---

## 📊 Resultados

### Success Response:

```json
{
  "artifact": {
    "id": "art-research-001",
    "project_id": "proj-123",
    "stage": "research",
    "artifact_type": "source-dossier",
    "version": 1,
    "status": "approved",
    "created_at": "2026-11-10T14:30:00Z"
  },
  "sources_found": 16,
  "topics_researched": 15,
  "total_annotations": 42,
  "message": "Research completed successfully"
}
```

### Error Response:

```json
{
  "error": "ResearchError",
  "message": "Insufficient sources found: 7 (minimum 10 required)",
  "sources_found": 7
}
```

---

## 🚀 Uso

### Código:

```typescript
import { initializeOrchestrator } from './init';
import { IntakeSkill } from './skills/intake';
import { ResearchSkill } from './skills/research';

// 1. Initialize
const orchestrator = await initializeOrchestrator('./ebook-factory.db');

// 2. Run Intake skill first to get brief artifact
const intakeSkill = new IntakeSkill(orchestrator);
const intakeResult = await intakeSkill.process(
  'docs/01-brief/BRIEF_EDITORIAL.md',
  projectId
);

// 3. Run Research with Intake artifact
const researchSkill = new ResearchSkill(orchestrator);
const result = await researchSkill.process(projectId, intakeResult.artifact);

console.log(`Found ${result.sources_found} sources`);
console.log(`Researched ${result.topics_researched} topics`);
console.log(`Total annotations: ${result.total_annotations}`);
```

---

## ⏱️ Complejidad

- **Tiempo:** 9 horas
- **Complejidad:** MEDIA
- **Líneas de Código:** ~500 TypeScript
- **Dependencias:** Orchestrator, HTTP clients (in production)

---

## ✨ Características

✅ Multi-channel source search  
✅ Automatic credibility evaluation  
✅ Chapter-by-chapter annotation  
✅ Deduplication by URL  
✅ Comprehensive dossier structure  
✅ 10+ minimum sources validation  
✅ Integration with Orchestrator  
✅ Artifact versionamento  
✅ Audit trail automático  
✅ Type-safe (TypeScript)  

---

## 📋 Checklist de Éxito

- ✅ Mínimo 10 fuentes encontradas
- ✅ Promedio credibilidad ≥ 3.5/5
- ✅ Todas las fuentes con URL válida
- ✅ Cada fuente con anotación
- ✅ Capítulos anotados
- ✅ Artifact creado y versionado
- ✅ Stage avanzado a "approved"
- ✅ Metadatos completos

---

## 🔗 Siguiente Skill

Después de completar Skill 2 (Research):

→ **Skill 3: Design** (14 horas)
- Refinar promesa del libro
- Crear outline detallado (8 capítulos, 500+ palabras c/u)
- Generar learning objectives SMART
- Crear ejercicios prácticos
- Listo para Gate 1 (Editorial Review)

---

## 📚 Archivos

- **Código:** `src/orchestrator/skills/research.ts`
- **Ejemplos:** `src/orchestrator/skills/research-examples.ts`
- **Compilado:** `dist/orchestrator/skills/research.js`
