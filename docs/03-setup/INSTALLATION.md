# 🚀 SETUP - Ebook Factory Dev Environment

**Status:** Ready to install  
**Time required:** 15-20 minutes  
**Prerequisites:** Node.js 18+, npm 9+

---

## 📋 SETUP STEPS

### Step 1: Verify Node.js Installation
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

If not installed:
- Download from https://nodejs.org/ (LTS version)
- Or use: `winget install OpenJS.NodeJS`

---

### Step 2: Install Dependencies
```bash
cd C:\Source\ebooks
npm install
```

**What it installs:**
- `sqlite3` - Database engine
- `uuid` - ID generation
- `typescript` - Language compiler
- `ts-node` - Direct TypeScript execution
- Build tools

**Time:** ~2 minutes (depending on internet)

---

### Step 3: Initialize Database
```bash
npm run init-db
```

**What it does:**
- Creates `ebook-factory.db` file
- Executes schema from `src/orchestrator/schema.sql`
- Creates 8 tables + 3 views
- Adds indexes for performance

**Expected output:**
```
✅ Connected to database: C:\Source\ebooks\ebook-factory.db
✅ Schema executed successfully

📋 Database tables created:
   - artifacts
   - change_log
   - gates
   - project_stage_status
   - projects
   - stage_dependencies
   - stages
   - validations

✅ Database initialization complete!
```

---

### Step 4: Verify Installation
```bash
npm test
```

**What it does:**
- Runs `src/orchestrator/examples.ts`
- Creates test project "Test Ebook"
- Advances through stages
- Tests gates and validations
- Shows full workflow

**Expected output:**
```
✅ Project created: Test Ebook
✅ Stage advanced: intake
✅ Gate created: Design Review
✅ Gate decided: approved
✅ Project complete!

PROJECT STATUS:
  ID: <uuid>
  Status: archived
  Genre: educational
  Stages completed: 8/8
```

---

## 📁 Project Structure After Setup

```
ebook-factory/
├─ node_modules/          [Installed dependencies]
├─ dist/                  [Compiled TypeScript]
├─ src/
│  └─ orchestrator/
│     ├─ schema.sql       [Database schema]
│     ├─ orchestrator.ts  [Core logic]
│     ├─ stages.ts        [Pipeline config]
│     ├─ init.ts          [DB setup]
│     └─ examples.ts      [Test workflow]
├─ scripts/
│  └─ init-db.js          [DB initialization]
├─ ebook-factory.db       [SQLite database] ✅ Created
├─ package.json           [Dependencies]
├─ tsconfig.json          [TypeScript config]
└─ README.md              [Documentation]
```

---

## 🧪 Using the Orchestrator

### Create a Project
```typescript
const orchestrator = new Orchestrator(dbPath);

const projectId = orchestrator.createProject({
  title: 'IA útil en el trabajo',
  genre: 'educational',
  description: '...',
  targetAudience: 'Mexican professionals',
  language: 'es-MX'
});
```

### Advance a Stage
```typescript
orchestrator.advanceStage(projectId, 'intake', 'ready-to-proceed', {
  userId: 'user-123',
  notes: 'Brief validated and ready'
});
```

### Create a Gate
```typescript
const gateId = orchestrator.createGate({
  projectId,
  stageId: 'design',
  gateType: 'editorial_review',
  reviewer: 'editor-123',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
});
```

### Decide on Gate
```typescript
orchestrator.decideGate(gateId, 'approve', {
  userId: 'editor-123',
  feedback: 'Looking good! Ready to proceed.',
  deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
});
```

**More examples:** See `src/orchestrator/examples.ts`

---

## 🐛 Troubleshooting

### Issue: `npm: command not found`
**Solution:** Node.js not in PATH
- Reinstall Node.js
- Or add to PATH manually
- Verify: `node --version`

### Issue: `sqlite3 module not found`
**Solution:** Dependencies not installed
```bash
rm -rf node_modules
npm install
```

### Issue: Database file locked
**Solution:** Another process is using the database
- Close other terminals/apps using it
- Delete `ebook-factory.db` and reinitialize
- Or use: `npm run init-db`

### Issue: Permission denied
**Solution:** File permissions issue
```bash
# Windows: Run PowerShell as Administrator
# Or: Use full path to database
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `node --version` returns v18+
- [ ] `npm --version` returns v9+
- [ ] `npm install` completed without errors
- [ ] `npm run init-db` shows all 8 tables
- [ ] `npm test` runs without errors
- [ ] `ebook-factory.db` file exists
- [ ] Can read file content (VS Code or browser)

---

## 🎯 Next: Create Pilot Project

Once setup is complete, create the pilot project:

```bash
npm run dev  # Opens interactive shell (TODO: implement)
```

Or manually:
```typescript
// Create project "IA útil en el trabajo"
orchestrator.createProject({
  title: 'IA útil en el trabajo',
  genre: 'educational',
  description: 'Practical AI guide for office workers',
  targetAudience: 'Profesionales mexicanos',
  language: 'es-MX'
});
```

---

## 📞 Help

**Need help?** Check:
- [Orchestrator Architecture](src/orchestrator/ARCHITECTURE.md)
- [Orchestrator README](src/orchestrator/README.md)
- [Examples](src/orchestrator/examples.ts)

---

**Ready? Run:** `npm install && npm run init-db && npm test`

