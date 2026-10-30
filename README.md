# 📚 Ebook Factory

Fábrica editorial asistida por IA para producir ebooks de alta calidad en español e inglés. Orquesta un pipeline de 8 etapas con revisión humana en puntos clave.

**Estado:** ✅ Fase 2 COMPLETO | 3/3 Skills implementados | Listo para Gate 1  
**GitHub:** [hon021/ebook-factory](https://github.com/hon021/ebook-factory)  
**Timeline:** 7 semanas a lanzamiento (Dec 17, 2026) | Gate 1: Nov 23

---

## 🚀 Quick Start

```bash
git clone https://github.com/hon021/ebook-factory.git
cd ebook-factory
npm install
npm run init-db
npm test
```

Para más detalles: [Installation Guide](docs/03-setup/INSTALLATION.md)

---

## 📖 Documentación

### 🎯 Primer paso
- **[Executive Summary](docs/04-status/EXECUTIVE_SUMMARY.md)** — Resumen ejecutivo del proyecto completo
- **[Project Dashboard](docs/04-status/PROJECT_DASHBOARD.md)** — Estado actual de todos los componentes

### 📋 Brief Editorial
- **[Brief Editorial](docs/01-brief/BRIEF_EDITORIAL.md)** — Especificación completa del libro piloto
- **[Approval Checklist](docs/01-brief/APPROVAL_CHECKLIST.md)** — Validación del brief
- **[Operational Decisions](docs/01-brief/DECISIONS.md)** — Decisiones confirmadas (Amazon KDP, $3, etc.)

### 🗺️ Roadmap & Planning
- **[Immediate Next Steps](docs/02-roadmap/IMMEDIATE_NEXT_STEPS.md)** — Qué sigue (Skills 1-3)
- **[7-Week Master Plan](docs/02-roadmap/7WEEK_PLAN.md)** — Timeline completo a publicación
- **[Skills 1-3 Specification](docs/02-roadmap/SKILLS_1_3_SPEC.md)** — Detalles técnicos de Intake, Research, Design

### ⚙️ Setup & Build
- **[Installation Guide](docs/03-setup/INSTALLATION.md)** — Cómo instalar y configurar
- **[Verification Report](docs/03-setup/VERIFICATION.md)** — Confirmación que todo funciona

### 📊 Status & Reports
- **[Session Reports](docs/04-status/sessions/)** — Histórico de sesiones completadas
- **[Orchestrator Build Summary](docs/04-status/sessions/ORCHESTRATOR_BUILD_SUMMARY.md)** — Qué se construyó

### 📚 Technical Reference
- **[Orchestrator Architecture](docs/05-reference/ORCHESTRATOR_ARCHITECTURE.md)** — Diseño del sistema
- **[Implementation Details](docs/05-reference/ORCHESTRATOR_IMPLEMENTATION.md)** — Cómo funciona internamente
- **[Workflow Diagrams](docs/05-reference/WORKFLOW_DIAGRAMS.md)** — Visuales del pipeline
- **[Quick Reference](docs/05-reference/ORCHESTRATOR_QUICK_REFERENCE.md)** — Guía rápida de API

### 📖 Project Vision
- **[Editorial Vision](docs/vision/propuesta-editorial.md)** — Visión original del proyecto
- **[MVP Definition](docs/mvp/mvp-pipeline-editorial.md)** — Definición del MVP

---

## 🏗️ Architecture

```
src/
├── orchestrator/
│   ├── orchestrator.ts      (State machine - 30+ methods)
│   ├── stages.ts            (8-stage pipeline + 5 genre profiles)
│   ├── schema.sql           (Database: 8 tables + 3 views)
│   ├── init.ts              (Database initialization)
│   ├── examples.ts          (Working examples & tests)
│   └── README.md            (Orchestrator docs)
└── (Skills 1-8 coming)

docs/
├── 01-brief/                (Editorial brief & decisions)
├── 02-roadmap/              (Planning & timeline)
├── 03-setup/                (Installation & verification)
├── 04-status/               (Project status & reports)
├── 05-reference/            (Technical reference)
├── vision/                  (Original vision docs)
└── mvp/                     (MVP definition)
```

---

## 🎯 Current Phase

**Phase 1: Foundation** ✅ COMPLETE
- [x] Orchestrator system implemented (47K code)
- [x] Database schema designed (8 tables, 3 views)
- [x] Editorial brief created (24K, 8 chapters)
- [x] Operational decisions confirmed
- [x] Dev environment setup (Node.js, npm, tests passing)
- [x] Repository published

**Phase 2: Skills 1-3** ✅ COMPLETE (Nov 6-12, 2026)
- [x] Skill 1: Intake (parse brief → normalize JSON) ✅ 307d2ec
- [x] Skill 2: Research (find sources → create dossier) ✅ fab6986
- [x] Skill 3: Design (refine promise → create outline) ✅ 148a18c
- [ ] Gate 1: Editorial Review (human decision) ⏳ Nov 23

**Phase 3: Skills 4-8** (After Gate 1 approval)
- [ ] Skill 4: Sample Writing
- [ ] Skill 5: Full Manuscript
- [ ] Skill 6: Editing
- [ ] Skill 7: QA/Testing
- [ ] Gate 2: Final QA
- [ ] Skill 8: Publishing (Amazon KDP)

---

## 📊 By the Numbers

| Metric | Value |
|--------|-------|
| **Code** | 50K+ TypeScript (100% typed, 0 build errors) |
| **Database** | 8 tables + 3 views (SQLite) |
| **Orchestrator Methods** | 30+ functional methods |
| **Tests** | 8/8 passing |
| **Documentation** | 130K+ (15+ guides, 3 skill specs) |
| **GitHub Commits** | 17 (clean history, co-authored) |
| **Timeline** | 6-7 weeks to launch |
| **Target** | 200+ sales (Dec 24, 2026) |

---

## 🔧 Development

### Run tests
```bash
npm test
```

### Initialize database
```bash
npm run init-db
```

### Build TypeScript
```bash
npm run build
```

### Watch mode
```bash
npm run dev
```

---

## 📁 Project Structure

```
ebook-factory/
├── src/                     # Source code (TypeScript)
│   └── orchestrator/        # Core orchestration system
├── dist/                    # Compiled JavaScript (build output)
├── docs/                    # All documentation (organized)
├── scripts/                 # Build & setup scripts
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
├── ebook-factory.db         # SQLite database (auto-created)
└── README.md                # This file
```

---

## 💡 Key Principles

1. **Orchestration** — Central state machine manages all transitions and gates
2. **Audit Trail** — Every action logged (who, what, when, why)
3. **Versioning** — Full history of all artifacts and revisions
4. **Human Gates** — Two approval points (Design Review, Final QA)
5. **Genre Profiles** — Customizable validation rules per genre
6. **Extensibility** — Skills connect via database; orchestrator is genre-agnostic

---

## 🌐 Publication

**Channel:** Amazon KDP  
**Price:** $3 USD  
**Languages:** Spanish (es-MX) + English (en-US)  
**Target Launch:** December 17, 2026  
**Success Metric:** 200+ sales in first 6 weeks

---

## 📧 Questions?

Refer to [docs/04-status/EXECUTIVE_SUMMARY.md](docs/04-status/EXECUTIVE_SUMMARY.md) for a complete overview.

---

**Last Updated:** October 30, 2026  
**Repository:** https://github.com/hon021/ebook-factory  
**License:** MIT