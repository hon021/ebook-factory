# Orchestrator Module

Core orchestration system for Ebook Factory editorial workflow.

## Overview

The Orchestrator manages the complete lifecycle of book projects through an 8-stage editorial pipeline:

```
Intake → Research → Design [GATE 1] → Sample → Manuscript → Editing → QA [GATE 2] → Production
```

**Key features:**
- State machine with status transitions
- Artifact versioning and history
- Human approval gates with configurable criteria
- Field and artifact-level validations
- Complete audit trail
- Genre-specific QA profiles

## Quick Start

### 1. Initialize System

```typescript
import { initializeOrchestrator } from './src/orchestrator/init';

const orchestrator = await initializeOrchestrator('./ebook-factory.db');
```

### 2. Create a Project

```typescript
const project = await orchestrator.createProject({
  title: "IA útil en el trabajo",
  genre: "educational",
  theme: "Practical AI for office workers",
  target_audience: "Professionals with basic digital skills, new to AI",
  reading_level: "simple",
  content_classification: "general",
  language: "es-MX",
  format: "epub",
  estimated_word_count: 45000,
  created_by: "user-sarah",
});

console.log(`Created project: ${project.id}`);
```

### 3. Progress Through Pipeline

```typescript
// Create an artifact in the intake stage
const brief = await orchestrator.createArtifact(
  project.id,
  "intake",
  "brief",
  "artifacts/intake-brief-v1.md",
  { submitted_by: "user-sarah" },
  "user-sarah"
);

// Validate required fields
const errors = await orchestrator.validateArtifact(
  brief.id,
  ["title", "genre", "audience"],
  briefData
);

if (errors.length === 0) {
  // Advance stage
  await orchestrator.advanceStage(
    project.id,
    "intake",
    "approved",
    "agent-intake",
    "Intake complete and validated"
  );
}
```

### 4. Request Human Approval (Gates)

```typescript
// Stage 3 (Design) requires human approval via Gate 1
const gate = await orchestrator.createGate(
  project.id,
  "design",
  "Editorial Design Approval",
  designArtifact.id,
  "agent-design",
  new Date(Date.now() + 48 * 3600000) // 48-hour deadline
);

console.log(`Gate ${gate.gate_number} created. Awaiting human review.`);

// Later, human reviewer makes decision
const decision = await orchestrator.decideGate(
  gate.id,
  "approve", // or "reject" or "request_changes"
  "human-editor-jane",
  "Outline is clear. Suggest: expand section 2."
);
```

### 5. Monitor Status

```typescript
const status = await orchestrator.getProjectStatus(project.id);
console.log(status);

// Output:
// {
//   project: { id, title, genre, ... },
//   stages: [
//     { stage_id: "intake", stage_name: "Intake", ordinal: 1, status: "approved", ... },
//     { stage_id: "research", stage_name: "Research", ordinal: 2, status: "in_progress", ... },
//     { stage_id: "design", stage_name: "Design", ordinal: 3, status: "pending", ... },
//     ...
//   ],
//   pending_gates: [
//     { id: "gate-xxx", gate_name: "Editorial Design Approval", ... }
//   ]
// }
```

## Architecture

See [ORCHESTRATOR_ARCHITECTURE.md](../../docs/05-reference/ORCHESTRATOR_ARCHITECTURE.md) for detailed design documentation:

- Database schema and relationships
- State transitions and validation rules
- Gate approval flow
- Audit trail design
- Genre profiles and QA checklists
- Usage examples

## Complete Documentation

- **[Architecture Guide](../../docs/05-reference/ORCHESTRATOR_ARCHITECTURE.md)** — System design, patterns, and database schema
- **[Implementation Guide](../../docs/05-reference/ORCHESTRATOR_IMPLEMENTATION.md)** — Technical decisions and build process
- **[Quick Reference](../../docs/05-reference/ORCHESTRATOR_QUICK_REFERENCE.md)** — API reference and common patterns
- **[Workflow Diagrams](../../docs/05-reference/WORKFLOW_DIAGRAMS.md)** — State diagrams and visual flows

## Files

- **schema.sql** - Database tables, indexes, views
- **orchestrator.ts** - Core orchestration logic
- **stages.ts** - Pipeline stages, validation rules, genre profiles
- **init.ts** - Database initialization

## Database

The orchestrator uses SQLite. Initialize with:

```bash
sqlite3 ebook-factory.db < src/orchestrator/schema.sql
```

Or programmatically:

```typescript
const orchestrator = await initializeOrchestrator('./ebook-factory.db');
```

### Key Tables

| Table | Purpose |
|-------|---------|
| projects | Book metadata |
| stages | Pipeline stage definitions |
| project_stage_status | Current status per project/stage |
| artifacts | Versioned outputs |
| gates | Human approval gates |
| validations | Field-level validation results |
| change_log | Audit trail |
| stage_dependencies | Stage prerequisites |

### Key Views

```sql
-- Current pipeline status
SELECT * FROM v_project_status WHERE project_id = 'proj-123';

-- Pending human reviews
SELECT * FROM v_pending_gates ORDER BY decision_deadline;

-- Validation errors
SELECT * FROM v_validation_errors WHERE severity = 'error';
```

## Stage Definitions

### Core Stages

1. **Intake & Normalization** - Receive and validate brief
2. **Research** - Compile sources (non-fic) or context (fic)
3. **Editorial Design** [GATE 1] - Outline, promise, objectives
4. **Sample** - One chapter/section to test design
5. **Manuscript** - Complete text
6. **Editorial Review** - Substantive, line, language editing
7. **QA & Final Review** [GATE 2] - Genre QA, defect check
8. **Production** - Format, metadata, distribution

### Genre Profiles

Each genre has specialized QA checklists:

- **Educational/Non-Fiction**: Sources, learning objectives, exercises, terminology
- **Mystery**: Clues, suspects, timeline, solution validity
- **Romance**: Emotional arc, character development, relationship progression
- **Children's Stories**: Vocabulary, age-appropriateness, sensitivity
- **Adult Eroticism**: Adult verification, consent, platform requirements

## Validation System

Validations run per field and store results with severity levels:

```typescript
const errors = await orchestrator.validateArtifact(
  artifactId,
  ["title", "audience", "promise"],
  data
);

// Errors include field, rule, message, severity
// error: must fix before proceeding
// warning: should address but not blocking
// info: suggestions
```

## Audit Trail

Every change is logged:

```sql
SELECT * FROM change_log WHERE project_id = 'proj-123' ORDER BY timestamp DESC;
```

Tracks: who, what, when, why, and before/after state for updates.

## State Transitions

Stages follow this state machine:

```
pending
  ↓
in_progress
  ├─→ approved (success → next stage)
  ├─→ requires_changes (revisions needed, can retry)
  └─→ blocked (severe issues, manual intervention)

blocked/requires_changes
  ↓ (after revision)
in_progress
  └─→ ...
```

## Gates

Two gates in the standard pipeline:

### Gate 1: Editorial Design Approval
- **Stage**: Design (stage 3)
- **Reviews**: Outline, promise, objectives
- **Criteria**: Clarity, completeness, genre fit, audience fit, scope
- **Effect**: Blocks entire book if rejected

### Gate 2: QA & Final Approval
- **Stage**: QA (stage 7)
- **Reviews**: QA report, corrected manuscript, defect summary
- **Criteria**: No critical defects, genre requirements, quality acceptable
- **Effect**: Blocks production if rejected

Gate decisions:
- **approve** → Stage marked approved, next stage unlocked
- **reject** → Stage blocked, major revision needed
- **request_changes** → Stage in "requires_changes", can resubmit same stage

## Extending the System

### Add a New Genre Profile

Edit `stages.ts`:

```typescript
export const GENRE_PROFILES = {
  // ... existing profiles ...
  
  my_new_genre: {
    name: "My New Genre",
    qa_checklist: [
      "Specific criterion 1",
      "Specific criterion 2",
      // ...
    ],
    specialized_artifacts: ["artifact-type-1", "artifact-type-2"],
  },
};
```

### Add Validation Rules

Edit `stages.ts` `STAGE_VALIDATION_RULES`:

```typescript
export const STAGE_VALIDATION_RULES = {
  // ... existing stages ...
  
  my_stage: {
    required_fields: ["field1", "field2"],
    validations: [
      { field: "field1", rule: "not_empty", message: "..." },
      { field: "field2", rule: "custom_rule", message: "..." },
    ],
  },
};
```

### Custom Skill Implementation

Stages reference `skill_implementation` (e.g., "intake-skill"). Create a skill wrapper:

```typescript
// src/skills/intake-skill.ts
export async function intakeSk...

[content continues from file truncation]
