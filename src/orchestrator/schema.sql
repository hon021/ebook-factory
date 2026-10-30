-- ============================================================================
-- EBOOK FACTORY: Orchestrator Database Schema
-- ============================================================================
-- Core tables for managing editorial workflow, versions, approvals, and state
-- ============================================================================

-- ============================================================================
-- 1. PROJECTS: Core project/book information
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,                 -- 'educational', 'mystery', 'romance', 'children', 'adult_erotism'
    subgenre TEXT,
    theme TEXT NOT NULL,
    target_audience TEXT NOT NULL,       -- Description of intended readers
    target_age_min INTEGER,              -- NULL if not age-restricted
    target_age_max INTEGER,
    reading_level TEXT,                  -- 'simple', 'intermediate', 'advanced'
    content_classification TEXT,         -- 'general', 'mature', 'explicit', etc.
    language TEXT NOT NULL,              -- 'es-MX', 'en-US', etc.
    format TEXT NOT NULL,                -- 'epub', 'pdf'
    estimated_word_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,            -- User/agent who created
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- 2. STAGES: Editorial pipeline stages (immutable reference)
-- ============================================================================
CREATE TABLE IF NOT EXISTS stages (
    id TEXT PRIMARY KEY,                 -- e.g., 'intake', 'research', 'design', etc.
    name TEXT NOT NULL,
    ordinal INTEGER NOT NULL,            -- Execution order
    description TEXT,
    requires_human_gate BOOLEAN DEFAULT FALSE,
    skill_implementation TEXT,           -- Reference to skill/agent responsible
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. PROJECT_STAGE_STATUS: Current status of each stage per project
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_stage_status (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    stage_id TEXT NOT NULL,
    status TEXT NOT NULL,                -- 'pending', 'in_progress', 'requires_changes', 'approved', 'blocked'
    blocked_reason TEXT,                 -- Why stage is blocked, if applicable
    attempts_count INTEGER DEFAULT 0,    -- Number of attempts for this stage
    current_artifact_id TEXT,            -- Latest artifact for this stage
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (stage_id) REFERENCES stages(id),
    UNIQUE(project_id, stage_id)
);

-- ============================================================================
-- 4. ARTIFACTS: Versioned outputs from each stage
-- ============================================================================
CREATE TABLE IF NOT EXISTS artifacts (
    id TEXT PRIMARY KEY,                 -- UUID format
    project_id TEXT NOT NULL,
    stage_id TEXT NOT NULL,
    artifact_type TEXT NOT NULL,         -- 'brief', 'research_dossier', 'outline', 'sample', 'manuscript', etc.
    version INTEGER NOT NULL,            -- Sequential version within stage
    content_path TEXT NOT NULL,          -- Path to file in repository or storage
    content_hash TEXT,                   -- SHA256 of content for integrity
    metadata JSONB,                      -- Stage-specific metadata (e.g., word_count, language, etc.)
    validation_status TEXT DEFAULT 'pending', -- 'pending', 'invalid', 'valid'
    validation_errors TEXT,              -- JSON array of validation errors
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,     -- Marks the active version
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (stage_id) REFERENCES stages(id)
);

-- ============================================================================
-- 5. GATES: Human approval gates
-- ============================================================================
CREATE TABLE IF NOT EXISTS gates (
    id TEXT PRIMARY KEY,                 -- UUID
    project_id TEXT NOT NULL,
    stage_id TEXT NOT NULL,
    gate_number INTEGER NOT NULL,        -- Gate 1, Gate 2, etc.
    gate_name TEXT NOT NULL,             -- 'Design Approval', 'Sample Review', etc.
    artifact_id TEXT NOT NULL,           -- Artifact being reviewed
    status TEXT DEFAULT 'pending',       -- 'pending', 'approved', 'rejected', 'changes_requested'
    requested_by TEXT NOT NULL,          -- User/agent requesting review
    reviewed_by TEXT,                    -- Human reviewer
    decision TEXT,                       -- 'approve', 'reject', 'request_changes'
    feedback TEXT,                       -- Reviewer comments
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP,
    decision_deadline TIMESTAMP,         -- Optional SLA for decision
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (stage_id) REFERENCES stages(id),
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id)
);

-- ============================================================================
-- 6. VALIDATIONS: Field-level validation results
-- ============================================================================
CREATE TABLE IF NOT EXISTS validations (
    id TEXT PRIMARY KEY,
    artifact_id TEXT NOT NULL,
    field_name TEXT NOT NULL,            -- e.g., 'title', 'audience', 'promise'
    rule_name TEXT NOT NULL,             -- e.g., 'not_empty', 'max_length', 'format_valid'
    is_valid BOOLEAN NOT NULL,
    error_message TEXT,
    severity TEXT,                       -- 'error', 'warning', 'info'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id)
);

-- ============================================================================
-- 7. CHANGE_LOG: Audit trail of all changes
-- ============================================================================
CREATE TABLE IF NOT EXISTS change_log (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    artifact_id TEXT,                    -- NULL for project-level changes
    stage_id TEXT,
    action TEXT NOT NULL,                -- 'created', 'updated', 'approved', 'rejected', 'blocked'
    entity_type TEXT NOT NULL,           -- 'project', 'artifact', 'gate', 'validation'
    entity_id TEXT,
    changes JSONB,                       -- Before/after diff for updates
    user_id TEXT NOT NULL,
    reason TEXT,                         -- Why the change was made
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id),
    FOREIGN KEY (stage_id) REFERENCES stages(id)
);

-- ============================================================================
-- 8. DEPENDENCIES: Track stage prerequisites
-- ============================================================================
CREATE TABLE IF NOT EXISTS stage_dependencies (
    id TEXT PRIMARY KEY,
    stage_id TEXT NOT NULL,
    depends_on_stage_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stage_id) REFERENCES stages(id),
    FOREIGN KEY (depends_on_stage_id) REFERENCES stages(id),
    UNIQUE(stage_id, depends_on_stage_id)
);

-- ============================================================================
-- INDEXES: Performance optimization
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_genre ON projects(genre);
CREATE INDEX IF NOT EXISTS idx_projects_language ON projects(language);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

CREATE INDEX IF NOT EXISTS idx_stage_status_project ON project_stage_status(project_id);
CREATE INDEX IF NOT EXISTS idx_stage_status_stage ON project_stage_status(stage_id);
CREATE INDEX IF NOT EXISTS idx_stage_status_status ON project_stage_status(status);

CREATE INDEX IF NOT EXISTS idx_artifacts_project ON artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_stage ON artifacts(stage_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(artifact_type);
CREATE INDEX IF NOT EXISTS idx_artifacts_current ON artifacts(is_current);

CREATE INDEX IF NOT EXISTS idx_gates_project ON gates(project_id);
CREATE INDEX IF NOT EXISTS idx_gates_status ON gates(status);
CREATE INDEX IF NOT EXISTS idx_gates_reviewed_by ON gates(reviewed_by);

CREATE INDEX IF NOT EXISTS idx_validations_artifact ON validations(artifact_id);
CREATE INDEX IF NOT EXISTS idx_validations_severity ON validations(severity);

CREATE INDEX IF NOT EXISTS idx_changelog_project ON change_log(project_id);
CREATE INDEX IF NOT EXISTS idx_changelog_timestamp ON change_log(timestamp);

-- ============================================================================
-- VIEWS: Common queries
-- ============================================================================

-- Current project status snapshot
CREATE VIEW IF NOT EXISTS v_project_status AS
SELECT 
    p.id,
    p.title,
    p.genre,
    p.language,
    s.id as stage_id,
    s.name as stage_name,
    s.ordinal,
    pss.status,
    pss.blocked_reason,
    pss.current_artifact_id,
    a.version as artifact_version,
    a.content_path,
    pss.updated_at
FROM projects p
LEFT JOIN stages s ON TRUE
LEFT JOIN project_stage_status pss ON p.id = pss.project_id AND s.id = pss.stage_id
LEFT JOIN artifacts a ON pss.current_artifact_id = a.id
ORDER BY p.id, s.ordinal;

-- Pending gates by project
CREATE VIEW IF NOT EXISTS v_pending_gates AS
SELECT 
    g.id,
    g.project_id,
    p.title as project_title,
    g.stage_id,
    s.name as stage_name,
    g.gate_name,
    g.requested_by,
    g.decision_deadline,
    CASE 
        WHEN g.decision_deadline < CURRENT_TIMESTAMP THEN 'OVERDUE'
        ELSE 'PENDING'
    END as urgency
FROM gates g
JOIN projects p ON g.project_id = p.id
JOIN stages s ON g.stage_id = s.id
WHERE g.status = 'pending'
ORDER BY g.decision_deadline;

-- Project validation errors
CREATE VIEW IF NOT EXISTS v_validation_errors AS
SELECT 
    a.project_id,
    p.title as project_title,
    a.stage_id,
    s.name as stage_name,
    a.artifact_type,
    a.version,
    v.field_name,
    v.rule_name,
    v.error_message,
    v.severity
FROM validations v
JOIN artifacts a ON v.artifact_id = a.id
JOIN projects p ON a.project_id = p.id
JOIN stages s ON a.stage_id = s.id
WHERE v.is_valid = FALSE
ORDER BY a.project_id, v.severity DESC, a.stage_id;
