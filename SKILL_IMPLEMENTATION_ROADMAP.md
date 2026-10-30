# 🎯 SKILL IMPLEMENTATION ROADMAP

**Current Status:** Orchestrator ✅ | Brief ✅ | Dev Setup → IN PROGRESS  
**After Setup:** Skill 1 (Intake) → Skill 2 (Research) → Skill 3 (Design)

---

## 📅 TIMELINE

| Week | Phase | Deliverable | Status |
|------|-------|-------------|--------|
| **Week 1** (Oct 30 - Nov 5) | Setup + S1 | Orchestrator + Brief approved | 🟢 IN PROGRESS |
| **Week 2** (Nov 6 - Nov 12) | S1 + S2 | Intake Skill complete + Research started | ⏳ NEXT |
| **Week 3** (Nov 13 - Nov 19) | S2 + S3 | Research complete + Design started | ⏳ UPCOMING |
| **Week 4** (Nov 20 - Nov 26) | S3 + Gate1 | Design complete + Gate 1 editorial review | ⏳ UPCOMING |
| **Week 5** (Nov 27 - Dec 3) | S4 | Sample Skill | ⏳ UPCOMING |
| **Week 6** (Dec 4 - Dec 10) | S5 | Manuscript Skill | ⏳ UPCOMING |
| **Week 7** (Dec 11 - Dec 17) | S6 + S7 | Editing + QA + Publish | ⏳ UPCOMING |

---

## 🔷 SKILL 1: INTAKE (Semana 2)

**Purpose:** Normalize raw brief into structured database artifact

**Input:**
- BRIEF_EDITORIAL_FINAL.md (24K)
- User edits/notes

**Output:**
- Artifact (JSON normalized)
- Validations (field-level checks)
- Status: ready-for-research

**Steps:**
1. Parse BRIEF_EDITORIAL_FINAL.md
2. Extract: title, genre, audience, chapters, word_count, etc.
3. Normalize to JSON schema
4. Validate all required fields
5. Create artifact with version 1.0
6. Advance intake stage
7. Return summary to user

**Validation Rules:**
```
title: required, 3-100 chars
genre: required, one-of [educational, mystery, romance, children, adult_erotism]
target_audience: required, 10+ chars
language: required, code
estimated_word_count: required, 5000-200000
chapter_count: required, 5-20
promise: required, 20+ chars
chapters[]: each must have title, objectives, content_outline
```

**Success Criteria:**
- ✅ All required fields validated
- ✅ No validation errors (only warnings allowed)
- ✅ Artifact created and stored
- ✅ Metadata indexed in database

**Time:** 4-6 hours  
**Complexity:** LOW

**Code Structure:**
```typescript
// src/orchestrator/skills/intake.ts
class IntakeSkill {
  async process(briefPath: string, projectId: string): Promise<Artifact> {
    const brief = await readBrief(briefPath);
    const normalized = this.normalize(brief);
    const validations = this.validate(normalized);
    
    if (!validations.isValid) {
      throw new ValidationError(validations.errors);
    }
    
    const artifact = await this.createArtifact(projectId, normalized);
    await this.advanceStage(projectId, 'intake', 'ready-for-research');
    
    return artifact;
  }
}
```

---

## 🔷 SKILL 2: RESEARCH (Semana 2-3)

**Purpose:** Compile authoritative sources for book content

**Input:**
- Artifact from Intake (normalized brief)
- Genre type (educational → academic sources)

**Output:**
- Source Dossier artifact (JSON array of sources)
- 10+ verified sources
- Annotations per chapter
- Status: research-complete

**Steps:**
1. Extract key topics from brief chapters
2. Search for sources:
   - Academic papers (IEEE, ArXiv, Scholar Google)
   - Industry reports (Gartner, Forrester)
   - News articles (trusted sources)
   - Books (Amazon, GoodReads)
   - Tutorials/documentation
3. Evaluate source credibility:
   - Author background
   - Publication date (< 3 years for AI)
   - Citation count
   - Peer review
4. Annotate per chapter
5. Create artifact
6. Advance stage

**Validation Rules:**
```
sources[]: must have
  - url: valid HTTP(S)
  - title: required
  - author: required
  - published_date: recent
  - credibility_score: 0-100
  - chapters_cited: at least 1

min_sources: 10
sources_per_chapter: avg 2+
credibility_avg: 70+
```

**Success Criteria:**
- ✅ 10+ sources identified
- ✅ Average credibility 70+
- ✅ Each chapter has citations
- ✅ All URLs verified
- ✅ No dead links

**Time:** 6-8 hours  
**Complexity:** MEDIUM (requires web scraping / API calls)

**Dependencies:**
- Intake artifact complete
- Access to research APIs (Scholar API, NewsAPI)

**Code Structure:**
```typescript
// src/orchestrator/skills/research.ts
class ResearchSkill {
  async process(artifactId: string, projectId: string): Promise<Artifact> {
    const brief = await getBriefArtifact(artifactId);
    const topics = this.extractTopics(brief);
    
    const sources = [];
    for (const chapter of brief.chapters) {
      const chapterSources = await this.searchSources(chapter, topics);
      sources.push(...chapterSources);
    }
    
    const credible = this.evaluateCredibility(sources);
    const artifact = await this.createSourceDossier(projectId, credible);
    
    return artifact;
  }
}
```

---

## 🔷 SKILL 3: DESIGN (Semana 3)

**Purpose:** Create book structure before writing

**Input:**
- Normalized brief artifact
- Source dossier artifact
- Genre profile rules

**Output:**
- Design artifact (promise + outline + objectives)
- Gate 1 created (editorial review)
- Status: awaiting-editorial-review

**Steps:**
1. Extract promise from brief
2. Validate promise is:
   - Specific (not generic)
   - Measurable (how will reader validate?)
   - Achievable (chapters support it?)
3. Refine chapter outline based on sources
4. Map each chapter to learning objectives
5. Create suggested structure:
   - Intro (hook reader + set expectations)
   - 8 chapters (content)
   - Conclusion (summarize + next steps)
   - Appendix (resources)
6. Create Design artifact
7. Trigger Gate 1 (editorial review)

**Validation Rules:**
```
promise: specific, 20-100 chars, answerable by chapters
outline: 8 chapters, each has 2-3 sections
objectives[]: each chapter has 3-5 learning objectives
chapters[]: mapped to sources, validation checks included
```

**Success Criteria:**
- ✅ Promise is specific and verifiable
- ✅ Outline covers all chapters
- ✅ Each chapter has learning objectives
- ✅ Gate 1 automatically created
- ✅ Review deadline set (7 days)

**Time:** 8-12 hours  
**Complexity:** MEDIUM-HIGH (requires editorial judgment)

**Gate 1 Specification:**
```typescript
Gate {
  projectId: string,
  stageId: 'design',
  gateType: 'editorial_review',
  title: 'Design Review Gate',
  description: 'Editorial review of book structure, promise, and outline',
  reviewer: 'editorial-team', // TBD: user assigns
  deadline: Date (7 days from now),
  
  decision: 'pending' | 'approve' | 'reject' | 'request_changes',
  feedback: string,
  
  consequences: {
    approve: 'Unlock Sample Skill',
    reject: 'Block project, return to Design',
    request_changes: 'Design stage → requires_changes'
  }
}
```

**Code Structure:**
```typescript
// src/orchestrator/skills/design.ts
class DesignSkill {
  async process(briefId: string, researchId: string, projectId: string) {
    const brief = await getArtifact(briefId);
    const research = await getArtifact(researchId);
    
    const promise = this.refinePromise(brief);
    const outline = this.createOutline(brief, research);
    const objectives = this.generateObjectives(outline);
    
    const design = { promise, outline, objectives, research_citations: research };
    const artifact = await this.createArtifact(projectId, design);
    
    // Create Gate 1
    const gate = await this.createGate({
      projectId,
      stageId: 'design',
      gateType: 'editorial_review',
      artifact,
      deadline: Date.now() + 7 * 24 * 60 * 60 * 1000
    });
    
    return { artifact, gate };
  }
}
```

---

## 🎯 GATE 1: EDITORIAL REVIEW

**When:** After Design Skill completes (end of Week 3, ~Nov 19)

**What gets reviewed:**
1. **Promise** - Is it clear? Specific? Verifiable?
2. **Outline** - Do 8 chapters logically flow?
3. **Objectives** - Can reader validate learning?
4. **Sources** - Are they credible and cited?
5. **Feasibility** - Is this doable in 48K words?

**Reviewer Decision:**
```
✅ APPROVE → Unlock Sample Skill, proceed to writing
⚠️  REQUEST_CHANGES → Design reverts to requires_changes, regenerate
❌ REJECT → Project blocked, back to brief phase
```

**Expected Timeline:**
- Gate created: Nov 19
- Deadline: Nov 26
- Decision: Nov 26
- Status: approved (assuming ✅)

---

## 📊 EFFORT ESTIMATE

| Skill | Implementation | Testing | Documentation | Total |
|-------|-----------------|---------|---------------|----|
| Intake | 4 hrs | 1 hr | 1 hr | **6 hrs** |
| Research | 6 hrs | 2 hrs | 1 hr | **9 hrs** |
| Design | 10 hrs | 2 hrs | 2 hrs | **14 hrs** |
| **TOTAL** | **20 hrs** | **5 hrs** | **4 hrs** | **29 hrs** |

**Team capacity:** 1 developer working ~4 hrs/day  
**Timeline:** 7-10 days (realistic, accounting for debugging)

---

## 🔄 AFTER GATE 1 APPROVAL

If Gate 1 = APPROVE:

**Skill 4: Sample (Week 5)**
- Write 1 full chapter as proof-of-concept
- Validate quality against checklist
- Gate 2 (sample approval)

**Skill 5: Manuscript (Weeks 5-6)**
- Generate remaining 7 chapters
- Iterative refinement

**Skill 6: Editing (Week 6)**
- Grammar, structure, clarity
- Technical accuracy check

**Skill 7: QA (Week 7)**
- Final checklist validation
- Format for Amazon KDP
- Deploy to production

**Skill 8: Production (Week 7)**
- Create Amazon KDP listing
- Upload files
- Publish
- Setup analytics

---

## 💡 KEY DECISIONS

1. **Who writes Intake/Research/Design skills?**
   - Option A: You (learning the codebase)
   - Option B: Me (Claude, using TypeScript)
   - **RECOMMENDATION:** Option B for speed + consistency

2. **How are skills invoked?**
   - API endpoint? → User triggers manually
   - Scheduled? → Cron job on timer
   - Chained? → Automatically after previous completes
   - **RECOMMENDATION:** API endpoint (user controls flow)

3. **Where are artifacts stored?**
   - Database only (JSON in SQLite) ← Current
   - Filesystem (JSON files) + database references
   - S3 cloud storage + database references
   - **RECOMMENDATION:** Database only for MVP (can migrate later)

4. **Success metrics per skill?**
   - Intake: 100% validation pass
   - Research: 10+ sources, 70+ credibility
   - Design: Promise + outline + 24 objectives
   - **RECOMMENDATION:** Above targets for production quality

---

## ✅ READY TO START?

**Prerequisites:**
- [ ] Dev environment set up (npm install, init-db)
- [ ] Brief approved ✅
- [ ] Operational decisions confirmed ✅
- [ ] Orchestrator tested

**When ready:** Start Skill 1 (Intake) in Week 2

