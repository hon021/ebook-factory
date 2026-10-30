# Ebook Factory: Orchestrator Architecture

**Status:** v0.1 - Core orchestrator and gate system  
**Date:** 2026-10-30

## Overview

The Orchestrator is the central control system for the editorial pipeline. It manages:

- **Project state** across 8 editorial stages
- **Artifact versioning** with full history
- **Gates** (human approval points)
- **Validations** at field and artifact level
- **Audit trail** for all changes
- **Dependencies** between stages

---

## Architecture

### 1. Database Schema

#### Core Tables

| Table | Purpose |
|-------|---------|
| `projects` | Book metadata, genre, audience, format |
| `stages` | Pipeline stage definitions (immutable) |
| `project_stage_status` | Current status of each stage per project |
| `artifacts` | Versioned outputs from each stage |
| `gates` | Human approval gates and decisions |
| `validations` | Field-level validation results |
| `change_log` | Audit trail of all changes |
| `stage_dependencies` | Prerequisites between stages |

#### Key Design Principles

- **Immutable stages**: Stages are defined once; projects reference them
- **Versioned artifacts**: Every revision is tracked; one marked as `is_current`
- **Complete audit trail**: Every change is logged with user, timestamp, reason
- **Soft blocking**: Stages can be "blocked" with reasons instead of hard failures
- **Flexible gates**: Gates can require approval, request changes, or reject

---

### 2. Editorial Pipeline Stages

The standard pipeline has **8 stages**, each with entry/exit criteria:

```
1. Intake → 2. Research → 3. Design [GATE 1] → 4. Sample → 
5. Manuscript → 6. Editing → 7. QA [GATE 2] → 8. Production
```

#### Stage Definitions

| # | Stage | Purpose | Gate | Dependencies |
|---|-------|---------|------|--------------|
| 1 | **Intake & Normalization** | Receive brief, validate required fields | No | None |
| 2 | **Research** | Dossier (non-fic) or context (fic) | No | Intake ✓ |
| 3 | **Editorial Design** | Outline, promise, objectives | **YES** | Research ✓ |
| 4 | **Sample** | One chapter/section | No | Design ✓ |
| 5 | **Manuscript** | Complete text | No | Design ✓ |
| 6 | **Editing** | Substantive, line, language | No | Manuscript ✓ |
| 7 | **QA & Final Review** | Genre QA, defect check | **YES** | Editing ✓ |
| 8 | **Production** | Format, metadata, distribution | No | QA ✓ |

#### Stage Status Flow

```
pending → in_progress → {
  approved (completed successfully) → next stage
  requires_changes (changes needed, can retry)
  blocked (severe issues, manual intervention)
}
```

---

### 3. Artifacts & Versioning

Every stage produces **artifacts**. Each artifact:

- Has a **unique UUID**
- Belongs to a **project + stage**
- Has a **sequential version number** within that stage
- Can have **one current version** (is_current = true)
- Stores **metadata** (word count, language, etc.)
- Has a **validation status** (pending, valid, invalid)
- Is **immutable** once created

#### Example Artifact Timeline

```
project-123, stage: "design"
  ├─ artifact-001 v1 (2026-10-30 14:00) → rejected by gate
  ├─ artifact-002 v2 (2026-10-30 15:30) → changes requested
  └─ artifact-003 v3 (2026-10-30 17:00) ← current, approved ✓
```

### 4. Gates & Approval Flow

Gates are **human decision points**. Only stages with `requires_human_gate = true` need approval.

#### Gate Lifecycle

```
1. Gate created when stage submits artifact
   status: "pending", requested_by: [user/agent]
   
2. Human reviews artifact + checklist
   
3. Decision made: approve | reject | request_changes
   status: "approved" | "rejected" | "changes_requested"
   reviewed_by: [reviewer name]
   feedback: [comments]
   
4. Automatic consequence:
   - Approve → Stage status = "approved" → Ready for next stage
   - Reject → Stage status = "blocked" → Major revision needed
   - Request changes → Stage status = "requires_changes" → Can retry same stage
```

#### Gate Definitions (MVP)

**Gate 1: Editorial Design Approval** (Stage 3)
- Reviews: outline, promise, objectives
- Checks: clarity, completeness, genre fit, audience fit, scope
- Blocks: Entire book if design is flawed

**Gate 2: QA & Final Approval** (Stage 7)
- Reviews: QA report, corrected manuscript, genre checklist
- Checks: No critical defects, genre requirements met, quality acceptable
- Blocks: Production until all critical issues resolved

---

### 5. Validations & Rules

Validations run **per field** within artifacts. Each validation:

- Checks a **field + rule** combination
- Returns **valid/invalid**
- Records **error message** and **severity** (error/warning/info)
- Is **trackable and auditable**

#### Validation Types

| Level | Examples | Trigger |
|-------|----------|---------|
| **Mandatory** | Not empty, required fields | On artifact creation |
| **Format** | Email, URL, date format | On artifact creation |
| **Length** | Min/max characters | On artifact creation |
| **Enum** | Genre, language choices | On artifact creation |
| **Logic** | Chapter order, timeline consistency | Stage-specific QA |
| **Factual** | Claims traceable to sources | Editorial stage (non-fic) |

#### Example: Intake Validations

```
title:
  ✓ not_empty (error if missing)
  ✓ max_length: 200 chars (error if too long)
  
genre:
  ✓ enum: [educational, mystery, romance, children, adult_erotism]
  
audience:
  ✓ not_empty
  ✓ min_length: 50 chars (warning if too brief)
  
language:
  ✓ enum: [es-MX, en-US, fr-FR]
```

---

### 6. Audit Trail

Every meaningful change is logged in `change_log`:

```sql
INSERT INTO change_log (
  project_id,         -- Which book
  artifact_id,        -- Which artifact (if applicable)
  stage_id,           -- Which stage
  action,             -- created | updated | approved | rejected | blocked
  entity_type,        -- project | artifact | gate | validation
  entity_id,          -- ID of what changed
  changes,            -- JSON diff of before/after
  user_id,            -- Who made change
  reason,             -- Why
  timestamp           -- When
)
```

#### Example Audit Trail

```
2026-10-30 14:00 | project-123 | created | project | edu-ai-book | user-sarah | "Project created"
2026-10-30 14:05 | proj-123 / design | created | artifact | brief v1 | agent-intake | "Normalized brief"
2026-10-30 14:10 | project-123 / design | updated | project | status=in_progress | agent-research | "Research started"
2026-10-30 15:00 | project-123 / design | created | artifact | outline v1 | agent-design | "Design artifact created"
2026-10-30 15:30 | project-123 | created | gate | GATE-1 | agent-design | "Design gate created, awaiting review"
2026-10-30 16:00 | project-123 / design | approved | gate | GATE-1 | human-editor | "Gate approved with feedback: 'Clear outline, minor phrasing adjustments needed'"
2026-10-30 16:00 | project-123 / design | updated | project | status=approved | human-editor | "Gate 1 approved, advancing to sample stage"
```

---

## Usage: Step-by-Step

### Creating a Project

```typescript
const orchestrator = new Orchestrator(database);

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
```

Project state after creation:
- All 8 stages initialized as `pending`
- Ready to receive input

### Advancing Through Intake Stage

```typescript
// 1. Create brief artifact
const brief = await orchestrator.createArtifact(
  project.id,
  "intake",
  "brief",
  "artifacts/project-123/brief-v1.md",
  { submitted_at: "2026-10-30T14:00Z" },
  "user-sarah"
);

// 2. Validate required fields
const errors = await orchestrator.validateArtifact(
  brief.id,
  ["title", "genre", "audience", "promise"],
  {
    title: "IA útil en el trabajo",
    genre: "educational",
    audience: "Oficinistas sin experiencia en IA",
    promise: "Aprenderás a usar IA para redactar, resumir y organizar tu trabajo"
  }
);
// Returns: [] (no errors)

// 3. Transition stage to approved (no gate for intake)
await orchestrator.advanceStage(
  project.id,
  "intake",
  "approved",
  "agent-intake",
  "Brief validated and normalized"
);
```

### Gates in Action

```typescript
// After design stage completes:

// 1. Create gate requesting human review
const gate1 = await orchestrator.createGate(
  project.id,
  "design",
  "Editorial Design Approval",
  design_artifact.id,
  "agent-design",
  new Date(Date.now() + 48 * 3600000) // 48-hour deadline
);

// 2. Human reviews and decides
const decision = await orchestrator.decideGate(
  gate1.id,
  "approve",  // or "reject" or "request_changes"
  "human-editor-jane",
  "Clear structure. Suggest: expand objectives section by 200 words."
);
// Returns: { success: true, nextAction: "Stage approved. Ready for next stage." }

// 3. Next stage automatically unlocked
const status = await orchestrator.getProjectStatus(project.id);
// design: approved ✓
// sample: pending (can start now)
```

---

## Key Design Decisions

### 1. Why Soft-Block Instead of Hard Fail?

Stages can be "blocked" with reasons, allowing human operators to:
- Review the block reason
- Decide if work can continue anyway
- Unblock and retry manually if needed
- Never get stuck in permanent failure

### 2. Why Separate Intake from Design?

- **Intake** normalizes raw input → standardized brief
- **Design** creates editorial plan (outline, promise, objectives)
- Separation allows skills to be simple and focused
- Intake can validate format; Design focuses on content

### 3. Why Two Gates?

- **Gate 1 (Design)**: Stops bad editorial decisions early
- **Gate 2 (QA)**: Catches quality issues before production
- Gates are expensive (human time), so only at critical points

### 4. Why Artifact Versions?

- Allows **unlimited retries** within a stage
- Keeps **full history** for audit/review
- Only one marked `is_current` for clarity
- Enables **rollback** if needed

---

## Next Steps

### To Use This System:

1. **Initialize database** with schema.sql
2. **Create projects** via createProject()
3. **Create artifacts** after each stage (createArtifact)
4. **Validate** before advancing (validateArtifact)
5. **Advance stages** with advanceStage()
6. **Create gates** when stage requires approval (createGate)
7. **Review & decide** gates when ready (decideGate)
8. **Query status** anytime (getProjectStatus)

### To Extend:

- Add genre-specific validations in `stages.ts`
- Implement skill wrappers for each stage
- Create dashboard that queries views (v_project_status, v_pending_gates, v_validation_errors)
- Build approval UI for gates

---

## Database Views for Reporting

Three key views are pre-built:

### v_project_status
Shows current pipeline state for all projects:
```sql
SELECT * FROM v_project_status WHERE project_id = 'proj-123' ORDER BY ordinal;
```

**Output:**
| project_id | title | stage_name | status | blocked_reason | artifact_version |
|---|---|---|---|---|---|
| proj-123 | IA útil en el trabajo | Intake | approved | NULL | 1 |
| proj-123 | IA útil en el trabajo | Research | in_progress | NULL | 1 |
| proj-123 | IA útil en el trabajo | Design | pending | NULL | NULL |

### v_pending_gates
Shows all gates awaiting human decision:
```sql
SELECT * FROM v_pending_gates WHERE reviewed_by IS NULL ORDER BY decision_deadline;
```

### v_validation_errors
Shows all validation failures:
```sql
SELECT * FROM v_validation_errors WHERE severity = 'error' ORDER BY project_id;
```

---

## Files in This Module

- **schema.sql**: Database tables, indexes, views
- **orchestrator.ts**: Core orchestration logic (state transitions, gates, validation)
- **stages.ts**: Pipeline stage definitions, genre profiles, validation rules
- **architecture.md**: This document

