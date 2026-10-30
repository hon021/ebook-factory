# Orchestrator Workflow Diagram

## Editorial Pipeline Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                   EBOOK FACTORY ORCHESTRATOR                           │
│              8-Stage Editorial Pipeline with Gates                      │
└────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐
  │   INTAKE    │
  │  Normalize  │
  │  & Validate │
  └──────┬──────┘
         │ (Brief validated)
  ┌──────▼──────────┐
  │    RESEARCH     │
  │  Compile Sources│
  │  (non-fic) or  │
  │  Context (fic) │
  └──────┬──────────┘
         │ (Sources dossier complete)
  ┌──────▼────────────┐
  │  EDITORIAL DESIGN │  ◄── GATE 1: Design Approval
  │ Outline, Promise, │      (Human review required)
  │ Objectives        │      ✓ approve → proceed
  └──────┬────────────┘      ⚠ request_changes → revise
         │                   ✗ reject → block project
         │ (Gate 1 approved)
  ┌──────▴──────────────────────┐
  │                             │
  │  ┌───────────┐    ┌─────────▼────────┐
  │  │   SAMPLE  │    │   MANUSCRIPT     │
  │  │  Chapter/ │    │   Write Full     │
  │  │   Scene   │    │   Text (all      │
  │  │   (test   │    │   chapters,      │
  │  │   design) │    │   references)    │
  │  └─────┬─────┘    └────────┬─────────┘
  │        │                   │
  │        └───────┬───────────┘
  │                │ (Both complete)
  │        ┌───────▼──────────┐
  │        │  EDITING REVIEW  │
  │        │ Substantive      │
  │        │ Line editing     │
  │        │ Language/locale  │
  │        └───────┬──────────┘
  │                │ (Edited & localized)
  │        ┌───────▼────────────┐
  │        │  QA & FINAL REVIEW │  ◄── GATE 2: QA Approval
  │        │ Genre QA checklist │      (Human review required)
  │        │ Defect severity    │      ✓ approve → production
  │        │ report             │      ⚠ request_changes → revise
  │        └───────┬────────────┘      ✗ reject → block
  │                │ (Gate 2 approved)
  │        ┌───────▼────────┐
  │        │  PRODUCTION    │
  │        │ Format (EPUB/  │
  │        │ PDF), metadata,│
  │        │ cover, package │
  │        └───────┬────────┘
  │                │
  └────────────────┼─────────────────────────────────────────────────────┘
                   │
              ┌────▼──────┐
              │   READY   │
              │ FOR SALE  │
              └───────────┘
```

---

## State Transitions

```
           ┌─────────────────┐
           │     PENDING     │  (Stage starts here)
           └────────┬────────┘
                    │
            ┌───────▼────────┐
            │  IN_PROGRESS   │  (Work is active)
            └───────┬────────┘
                    │
      ┌─────────────┼─────────────┐
      │             │             │
   ┌──▼──────┐   ┌──▼─────┐   ┌──▼────┐
   │APPROVED │   │REQUIRES │   │BLOCKED│
   │         │   │CHANGES  │   │       │
   │(Success)│   │(Revise) │   │(Error)│
   └────┬────┘   └────┬────┘   └───┬───┘
        │             │            │
        │ Next stage  │ Resubmit   │ Manual
        │ unlocked    │ same stage │ intervention
        └─────────────┴────────────┘
```

---

## Gate Decision Flow

```
┌─────────────┐
│ GATE CREATED│
│  (pending)  │
└──────┬──────┘
       │
       │ Human reviewer evaluates artifact
       │ against approval criteria
       │
   ┌───▼────────────────────────────┐
   │ DECISION OPTIONS               │
   └───────┬────────────────────────┘
           │
    ┌──────┴──────┬─────────────┬──────────────┐
    │             │             │              │
┌───▼────┐  ┌────▼────┐  ┌─────▼────┐  ┌─────▼────┐
│APPROVE │  │ REJECT  │  │ REQUEST  │  │  UNDECIDED
│        │  │         │  │ CHANGES  │  │  (waiting)
└───┬────┘  └────┬────┘  └─────┬────┘  └───────────┘
    │            │            │
    │ Stage:     │ Stage:     │ Stage:
    │ "approved" │ "blocked"  │ "requires_
    │            │            │  changes"
    │ ↓          │ ↓          │ ↓
    │ Next       │ Manual     │ Team
    │ stage      │ review     │ revises
    │ unlocked   │ needed     │ & resubmits
    │            │            │
    └────────────┴────────────┴──────→ (Cycle repeats)
```

---

## Artifact Versioning

```
Stage: DESIGN
Artifact Type: outline

artifact-001 v1
├─ Created: 2026-10-30 14:00
├─ Status: valid
├─ Content: outline-v1.md
├─ is_current: FALSE  (superseded)
└─ Gate 1: request_changes
    └─ Feedback: "Chapter 3 needs exercise"

artifact-002 v2
├─ Created: 2026-10-30 15:30
├─ Status: valid
├─ Content: outline-v2.md
├─ is_current: FALSE  (superseded)
└─ Gate 1b: request_changes
    └─ Feedback: "Close, but..."

artifact-003 v3 ← CURRENT
├─ Created: 2026-10-30 17:00
├─ Status: valid
├─ Content: outline-v3.md
├─ is_current: TRUE
└─ Gate 1c: APPROVED ✓
    └─ Feedback: "Excellent!"
```

---

## Validation & Error Handling

```
┌──────────────┐
│  ARTIFACT    │
│   CREATED    │
└──────┬───────┘
       │
       │ Validate required fields
       │ Check format, length, enum values
       │ Apply stage-specific rules
       │
   ┌───▼────────────────────────────────┐
   │ VALIDATION RESULTS                 │
   └───┬────────────────────────────────┘
       │
       ├─ Errors found (severity: error)
       │  └─ artifact.validation_status = "invalid"
       │  └─ Cannot advance stage
       │  └─ Team must fix before retry
       │
       ├─ Warnings found (severity: warning)
       │  └─ artifact.validation_status = "valid"
       │  └─ Can advance, but should address
       │
       └─ No issues
           └─ artifact.validation_status = "valid"
           └─ Ready to advance stage
```

---

## Audit Trail Example

```
Timeline of project-123: "IA útil en el trabajo"

2026-10-30 14:00:00 | user-sarah    | created   | project      | Brief submitted
2026-10-30 14:05:00 | agent-intake  | created   | artifact     | Brief artifact v1 created
2026-10-30 14:10:00 | agent-intake  | updated   | project      | Stage transitioned to approved
2026-10-30 14:15:00 | agent-research| updated   | project      | Stage transitioned to in_progress
2026-10-30 15:00:00 | agent-research| created   | artifact     | Source dossier v1 created
2026-10-30 15:05:00 | agent-research| updated   | project      | Stage transitioned to approved
2026-10-30 15:10:00 | agent-design  | updated   | project      | Stage transitioned to in_progress
2026-10-30 15:30:00 | agent-design  | created   | artifact     | Outline v1 created
2026-10-30 15:45:00 | agent-design  | created   | gate         | Gate 1 created for design review
2026-10-30 17:00:00 | editor-jane   | approved  | gate         | Gate 1: request_changes (feedback: needs exercise in chapter 3)
2026-10-30 17:01:00 | editor-jane   | updated   | project      | Stage transitioned to requires_changes
2026-10-30 17:30:00 | agent-design  | created   | artifact     | Outline v2 created (revised)
2026-10-30 17:45:00 | agent-design  | created   | gate         | Gate 1b created for revised design
2026-10-30 18:00:00 | editor-jane   | approved  | gate         | Gate 1b: APPROVE (feedback: excellent structure)
2026-10-30 18:01:00 | editor-jane   | updated   | project      | Stage transitioned to approved
2026-10-30 18:05:00 | agent-writer  | updated   | project      | Stage transitioned to in_progress (sample)
...
```

---

## Multi-Language Localization Example

```
Project: "IA útil en el trabajo"
├─ Language Variant 1: es-MX (Spanish - Mexico)
│  ├─ Manuscript (es-MX): manuscript-es-MX-v1.md
│  ├─ Edited (es-MX): edited-es-MX-v1.md  (localized, not just translated)
│  ├─ QA Review: qa-es-MX-report-v1.md
│  ├─ Production (EPUB): producto-es-MX-v1.epub
│  └─ Published: Available on Amazon KDP (es-MX market)
│
└─ Language Variant 2: en-US (English - USA)
   ├─ Manuscript (en-US): manuscript-en-US-v1.md
   ├─ Edited (en-US): edited-en-US-v1.md  (localized for US English)
   ├─ QA Review: qa-en-US-report-v1.md
   ├─ Production (EPUB): producto-en-US-v1.epub
   └─ Published: Available on Amazon KDP (en-US market)

Note: Each language variant has its own project_stage_status, gates, validations.
Results measured separately per market.
```

---

## Database Relationships

```
┌──────────────┐
│  projects    │◀─────────────────────────────────────┐
│  (book)      │                                       │
└──────┬───────┘                                       │
       │1                                              │
       │                                               │
       ▼N                                              │
┌──────────────────────────┐                           │
│ project_stage_status     │◀───────┐                  │
│ (current status)         │        │                  │
└──────┬──────────────────┬┘        │                  │
       │1              1│          │                  │
       │               │          │                  │
       ▼N              ▼N         │                  │
┌───────────┐      ┌────────┐    │                  │
│ artifacts │◀─────│ stages │    │                  │
│ (outputs) │      │        │    │                  │
└─────┬─────┘      └────────┘    │                  │
      │1                         │                  │
      │                          │                  │
      ▼N                         │                  │
┌────────────┐                   │                  │
│ validations│                   │                  │
│ (errors)   │                   │                  │
└────────────┘                   │                  │
                                 │                  │
      ┌──────────────────────────┘                  │
      │1                                            │
      │                                             │
      ▼N                                            │
┌────────────┐        ┌──────────────────────────┐  │
│   gates    │        │  stage_dependencies      │  │
│ (reviews)  │        │  (prerequisite order)    │  │
└────────────┘        └──────────────────────────┘  │
                                                     │
      ┌───────────────────────────────────────────┘
      │1
      │
      ▼N
┌──────────────┐
│  change_log  │
│ (audit trail)│
└──────────────┘
```

---

## Next: Integration Points

The orchestrator provides hooks for:

1. **Skills/Agents** - Reference stage IDs to execute work
2. **Approval Dashboard** - Query `v_pending_gates` to show reviewers what needs review
3. **Status Dashboard** - Query `v_project_status` to show project health
4. **Error Tracking** - Query `v_validation_errors` to see what's blocking progress
5. **Audit Reports** - Query `change_log` for compliance/tracking

