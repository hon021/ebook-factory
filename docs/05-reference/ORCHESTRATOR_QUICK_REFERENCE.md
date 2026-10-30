# Ebook Factory Orchestrator - Quick Reference

## 📚 Documentation Index

Start here based on your role:

### **Project Managers / Editorial Team**
→ Read [README.md](./README.md) for overview  
→ Then [WORKFLOW-DIAGRAM.md](./WORKFLOW-DIAGRAM.md) for visual flows  
→ Check status: `SELECT * FROM v_project_status`  
→ Review pending gates: `SELECT * FROM v_pending_gates`  

### **Developers**
→ Start with [ARCHITECTURE.md](./ARCHITECTURE.md) - complete design  
→ Review [schema.sql](./schema.sql) for database structure  
→ Study [orchestrator.ts](./orchestrator.ts) for state machine  
→ Check [examples.ts](./examples.ts) for working code  

### **DevOps / Database**
→ [schema.sql](./schema.sql) - run this to initialize DB  
→ Setup: `sqlite3 ebook-factory.db < src/orchestrator/schema.sql`  
→ Or programmatically: `await initializeOrchestrator('./ebook-factory.db')`  

### **Skill Developers** (Intake, Design, QA, etc.)
→ [stages.ts](./stages.ts) - your stage definition + validation rules  
→ Reference: `STAGE_VALIDATION_RULES[stage_id]`  
→ Examples: [examples.ts](./examples.ts) - see how skills call orchestrator  

---

## 🎯 Core Capabilities

```
✓ 8-stage editorial pipeline
✓ Artifact versioning (v1, v2, v3, ...)
✓ Human approval gates (2 required gates)
✓ Field-level validation
✓ Complete audit trail
✓ Genre specialization (5 profiles)
✓ Multi-language support
✓ Dependency management
✓ Status reporting via views
```

---

## 🚀 Quick Start

### Initialize Database

```bash
sqlite3 ebook-factory.db < src/orchestrator/schema.sql
```

Or in TypeScript:
```typescript
import { initializeOrchestrator } from './src/orchestrator/init';
const orchestrator = await initializeOrchestrator('./ebook-factory.db');
```

### Create Project

```typescript
const project = await orchestrator.createProject({
  title: "IA útil en el trabajo",
  genre: "educational",
  theme: "Practical AI for office workers",
  target_audience: "Professionals new to AI",
  reading_level: "simple",
  content_classification: "general",
  language: "es-MX",
  format: "epub",
  estimated_word_count: 45000,
  created_by: "user-sarah",
});
```

### Progress Through Pipeline

```typescript
// Create artifact
const brief = await orchestrator.createArtifact(
  project.id, "intake", "brief", 
  "artifacts/intake-brief-v1.md", 
  { metadata }, 
  "user-sarah"
);

// Validate
const errors = await orchestrator.validateArtifact(
  brief.id, 
  ["title", "genre"], 
  briefData
);

// Advance stage
await orchestrator.advanceStage(
  project.id, "intake", "approved", 
  "agent-intake", "Intake complete"
);

// Request gate approval (at stages that need it)
const gate = await orchestrator.createGate(
  project.id, "design", "Design Approval",
  designArtifact.id, "agent-design"
);

// Human decides
await orchestrator.decideGate(
  gate.id, "approve", "editor-jane", 
  "Approved! Minor suggestions in feedback."
);
```

### Monitor Status

```typescript
const status = await orchestrator.getProjectStatus(project.id);
console.log(status.stages); // All 8 stages with current status
console.log(status.pending_gates); // Awaiting human review
```

### Query Database

```sql
-- Project status snapshot
SELECT * FROM v_project_status WHERE project_id = 'proj-123' ORDER BY ordinal;

-- Pending gates (human reviews needed)
SELECT * FROM v_pending_gates ORDER BY decision_deadline;

-- Validation errors
SELECT * FROM v_validation_errors WHERE severity = 'error';

-- Full change history
SELECT * FROM change_log WHERE project_id = 'proj-123' ORDER BY timestamp DESC;
```

---

## 📊 Database Schema

8 core tables:

| Table | Records | Purpose |
|-------|---------|---------|
| `projects` | 1 per book | Book metadata |
| `stages` | 8 total | Pipeline definitions (shared) |
| `project_stage_status` | 8 per project | Current status |
| `artifacts` | N per project | Versioned outputs |
| `gates` | M per project | Human approvals |
| `validations` | K per artifact | Field validation results |
| `change_log` | N per project | Audit trail |
| `stage_dependencies` | 7 total | Prerequisites (shared) |

3 pre-built views for reporting.

---

## 🎭 Pipeline Stages

```
1. Intake (normalize & validate brief)
   ↓
2. Research (compile sources/context)
   ↓
3. Design [GATE 1: Approval] (outline, promise, objectives)
   ↓ (branches into both sample and manuscript in parallel)
   4. Sample (one chapter test)
   5. Manuscript (full text)
   ↓ (merge back)
6. Editing (substantive, line, language)
   ↓
7. QA [GATE 2: Approval] (genre QA, defects)
   ↓
8. Production (format, package, ready to sell)
```

---

## 🚪 Gates (Human Approvals)

### Gate 1: Editorial Design Approval (Stage 3)
- **Reviews**: Outline, promise, learning objectives
- **Decides**: Title, structure, approach sound?
- **Decisions**:
  - ✓ **Approve** → Proceed to writing
  - ⚠ **Request Changes** → Revise outline, resubmit same gate
  - ✗ **Reject** → Block project, major restructuring needed

### Gate 2: QA & Final Approval (Stage 7)
- **Reviews**: QA report, defect list, corrected manuscript
- **Decides**: Quality acceptable for production?
- **Decisions**:
  - ✓ **Approve** → Ready for production
  - ⚠ **Request Changes** → Fix issues, resubmit
  - ✗ **Reject** → Block production

---

## 🔄 State Transitions

Every stage follows this lifecycle:

```
pending 
  → in_progress 
    → approved (success, next stage unlocked)
    → requires_changes (revisions needed, can retry)
    → blocked (fatal issue, manual review)
```

---

## ✔️ Validation Rules

Runs at every artifact creation. Per-stage configuration:

```typescript
// Example: Intake stage validation rules
STAGE_VALIDATION_RULES.intake = {
  required_fields: ["title", "genre", "theme", "audience"],
  validations: [
    { field: "title", rule: "not_empty", message: "Title required" },
    { field: "title", rule: "max_length:200", message: "Max 200 chars" },
    { field: "genre", rule: "enum", values: ["educational", "mystery", ...] },
    { field: "audience", rule: "min_length:50", message: "≥50 chars" },
  ]
}
```

Validation errors are stored and prevent stage advancement.

---

## 🎨 Genre Profiles

5 specialized QA checklists:

| Genre | Key QA | Specialized Artifacts |
|-------|--------|----------------------|
| **Educational** | Sources verified, objectives clear, exercises work | source_dossier, learning_objectives, exercise_solutions |
| **Mystery** | Clues planted before reveal, solution logical | clue_register, suspect_profiles, timeline_map |
| **Romance** | Character arc coherent, relationship progression organic | emotional_beats, relationship_arc, character_dev_log |
| **Children** | Age-appropriate, no frightening content | age_appropriateness_review, vocabulary_analysis |
| **Adult** | All adults, clear consent, legal compliance | adult_verification, content_tags, platform_reqs |

---

## 🔐 Audit Trail

Every change logged:

```
project_id    → Which book
artifact_id   → Which artifact (if applicable)  
stage_id      → Which stage
action        → created | updated | approved | rejected | blocked
entity_type   → project | artifact | gate | validation
entity_id     → ID of what changed
changes       → JSON diff (before/after)
user_id       → Who made the change
reason        → Why
timestamp     → When
```

Query: `SELECT * FROM change_log WHERE project_id = 'proj-123' ORDER BY timestamp DESC;`

---

## 📦 Files in This Module

```
src/orchestrator/
├─ schema.sql              Database tables, indexes, views (11K)
├─ orchestrator.ts         Core state machine (20K)
├─ stages.ts               Pipeline + genres + rules (11K)
├─ init.ts                 Database setup (2K)
├─ examples.ts             Working workflows (13K)
├─ ARCHITECTURE.md         Complete design doc (12K)
├─ README.md               Quick start (8K)
├─ WORKFLOW-DIAGRAM.md     Visual flowcharts (11K)
├─ IMPLEMENTATION.md       Build summary (12K)
└─ INDEX.md                This file
```

**Total: ~88K of code + docs**

---

## 🔧 Configuration Points

Want to customize? Edit these:

| What | Where | How |
|------|-------|-----|
| Add new genre | `stages.ts` | Add to `GENRE_PROFILES` |
| Change validation rules | `stages.ts` | Edit `STAGE_VALIDATION_RULES` |
| Add gate | `stages.ts` | Add to `GATES` |
| Modify database | `schema.sql` | Edit tables/views |

The orchestrator core doesn't need changes for most customizations.

---

## 🎯 Common Queries

```sql
-- What's the status of this project?
SELECT * FROM v_project_status WHERE project_id = 'proj-123';

-- What gates are awaiting decisions?
SELECT * FROM v_pending_gates ORDER BY decision_deadline DESC;

-- What validation errors exist?
SELECT * FROM v_validation_errors WHERE severity = 'error';

-- How many projects in each stage?
SELECT stage_name, COUNT(*) FROM v_project_status GROUP BY stage_name;

-- What's the audit trail for this project?
SELECT timestamp, user_id, action, reason FROM change_log 
WHERE project_id = 'proj-123' ORDER BY timestamp DESC LIMIT 20;

-- Which gates are overdue?
SELECT * FROM v_pending_gates WHERE urgency = 'OVERDUE';

-- Show me the latest artifact for each stage
SELECT DISTINCT ON (stage_id) * FROM artifacts 
WHERE project_id = 'proj-123' AND is_current = TRUE 
ORDER BY stage_id, created_at DESC;
```

---

## 🚨 Troubleshooting

**Q: Project stuck in "blocked" state**  
A: Check `project_stage_status.blocked_reason`. Review change_log to see why. Address root cause, then manually unblock or create new artifact.

**Q: Artifact validation failing**  
A: Check `validations` table for that artifact. Each error shows field, rule, and message. Fix data and recreate artifact.

**Q: Gate decision not updating stage**  
A: Orchestrator should auto-update on `decideGate()`. Check change_log. If no update logged, there's a bug—report it.

**Q: Can't advance stage**  
A: Stage dependencies might not be met. Check `stage_dependencies` table. All prerequisite stages must be "approved".

**Q: Database locked**  
A: SQLite has single-writer limitation. If DB is locked, wait or migrate to PostgreSQL (future).

---

## 📈 Next Steps

### To Use This System:
1. ✅ Database initialized (schema.sql)
2. Create projects via API
3. Create artifacts after each stage completes
4. Validate before advancing
5. Request gates when needed
6. Check status/audit trail

### To Extend:
1. Add genre profiles to `stages.ts`
2. Implement skill runners for each stage
3. Build dashboards querying the views
4. Add webhook notifications for gates
5. Migrate to PostgreSQL for teams

### To Test:
```bash
npm run test examples.ts
```

---

## 📞 Questions?

See documentation:
- **How does it work?** → ARCHITECTURE.md
- **How do I use it?** → README.md
- **Can I see a picture?** → WORKFLOW-DIAGRAM.md
- **How was it built?** → IMPLEMENTATION.md
- **Show me code!** → examples.ts

