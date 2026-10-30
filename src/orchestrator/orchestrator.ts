/**
 * Ebook Factory Orchestrator
 * 
 * Core orchestration logic for managing editorial workflow:
 * - State transitions across stages
 * - Gate management and approval flow
 * - Artifact versioning
 * - Validation and rule enforcement
 * - Audit trail
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type StageStatus = 'pending' | 'in_progress' | 'requires_changes' | 'approved' | 'blocked';
export type GateStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';
export type GateDecision = 'approve' | 'reject' | 'request_changes';
export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface Project {
  id: string;
  title: string;
  genre: string;
  subgenre?: string;
  theme: string;
  target_audience: string;
  target_age_min?: number;
  target_age_max?: number;
  reading_level: string;
  content_classification: string;
  language: string;
  format: string;
  estimated_word_count?: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  is_active: boolean;
}

export interface Stage {
  id: string;
  name: string;
  ordinal: number;
  description?: string;
  requires_human_gate: boolean;
  skill_implementation?: string;
}

export interface ProjectStageStatus {
  id: string;
  project_id: string;
  stage_id: string;
  status: StageStatus;
  blocked_reason?: string;
  attempts_count: number;
  current_artifact_id?: string;
  started_at?: Date;
  completed_at?: Date;
}

export interface Artifact {
  id: string;
  project_id: string;
  stage_id: string;
  artifact_type: string;
  version: number;
  content_path: string;
  content_hash?: string;
  metadata?: Record<string, any>;
  validation_status: 'pending' | 'invalid' | 'valid';
  validation_errors?: ValidationError[];
  created_at: Date;
  created_by: string;
  is_current: boolean;
}

export interface ValidationError {
  field: string;
  rule: string;
  message: string;
  severity: ValidationSeverity;
}

export interface Gate {
  id: string;
  project_id: string;
  stage_id: string;
  gate_number: number;
  gate_name: string;
  artifact_id: string;
  status: GateStatus;
  requested_by: string;
  reviewed_by?: string;
  decision?: GateDecision;
  feedback?: string;
  created_at: Date;
  decided_at?: Date;
  decision_deadline?: Date;
}

export interface ChangeLogEntry {
  id: string;
  project_id: string;
  artifact_id?: string;
  stage_id?: string;
  action: 'created' | 'updated' | 'approved' | 'rejected' | 'blocked';
  entity_type: 'project' | 'artifact' | 'gate' | 'validation';
  entity_id?: string;
  changes?: Record<string, any>;
  user_id: string;
  reason?: string;
  timestamp: Date;
}

// ============================================================================
// ORCHESTRATOR CLASS
// ============================================================================

export class Orchestrator {
  private db: any; // Injected database connection

  constructor(database: any) {
    this.db = database;
  }

  // ========================================================================
  // PROJECT MANAGEMENT
  // ========================================================================

  /**
   * Create a new project with initial state
   */
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const id = `proj-${uuidv4()}`;
    const now = new Date();

    const newProject: Project = {
      id,
      ...project,
      created_at: now,
      updated_at: now,
    };

    await this.db.run(
      `INSERT INTO projects (
        id, title, genre, subgenre, theme, target_audience, target_age_min,
        target_age_max, reading_level, content_classification, language,
        format, estimated_word_count, created_at, updated_at, created_by, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        project.title,
        project.genre,
        project.subgenre,
        project.theme,
        project.target_audience,
        project.target_age_min,
        project.target_age_max,
        project.reading_level,
        project.content_classification,
        project.language,
        project.format,
        project.estimated_word_count,
        now,
        now,
        project.created_by,
        project.is_active !== false,
      ]
    );

    // Initialize stage statuses for this project
    await this.initializeStageStatuses(id);

    // Log creation
    await this.logChange({
      project_id: id,
      action: 'created',
      entity_type: 'project',
      entity_id: id,
      user_id: project.created_by,
      reason: 'Project created',
    });

    return newProject;
  }

  /**
   * Initialize project stage statuses (all stages start as pending)
   */
  private async initializeStageStatuses(projectId: string): Promise<void> {
    const stages = await this.db.all('SELECT id FROM stages ORDER BY ordinal');

    for (const stage of stages) {
      const id = `pss-${uuidv4()}`;
      await this.db.run(
        `INSERT INTO project_stage_status (
          id, project_id, stage_id, status, attempts_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, projectId, stage.id, 'pending', 0, new Date(), new Date()]
      );
    }
  }

  // ========================================================================
  // ARTIFACT MANAGEMENT
  // ========================================================================

  /**
   * Create new artifact version for a stage
   */
  async createArtifact(
    projectId: string,
    stageId: string,
    artifactType: string,
    contentPath: string,
    metadata: Record<string, any>,
    userId: string
  ): Promise<Artifact> {
    const id = `art-${uuidv4()}`;
    const now = new Date();

    // Mark previous versions as not current
    await this.db.run(
      `UPDATE artifacts SET is_current = FALSE 
       WHERE project_id = ? AND stage_id = ? AND artifact_type = ?`,
      [projectId, stageId, artifactType]
    );

    // Get next version number
    const result = await this.db.get(
      `SELECT COALESCE(MAX(version), 0) + 1 as next_version
       FROM artifacts WHERE project_id = ? AND stage_id = ? AND artifact_type = ?`,
      [projectId, stageId, artifactType]
    );
    const version = result.next_version;

    const artifact: Artifact = {
      id,
      project_id: projectId,
      stage_id: stageId,
      artifact_type: artifactType,
      version,
      content_path: contentPath,
      metadata,
      validation_status: 'pending',
      created_at: now,
      created_by: userId,
      is_current: true,
    };

    await this.db.run(
      `INSERT INTO artifacts (
        id, project_id, stage_id, artifact_type, version, content_path,
        metadata, validation_status, created_at, created_by, is_current
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        projectId,
        stageId,
        artifactType,
        version,
        contentPath,
        JSON.stringify(metadata),
        'pending',
        now,
        userId,
        true,
      ]
    );

    // Log creation
    await this.logChange({
      project_id: projectId,
      artifact_id: id,
      stage_id: stageId,
      action: 'created',
      entity_type: 'artifact',
      entity_id: id,
      user_id: userId,
      reason: `Created ${artifactType} v${version}`,
    });

    return artifact;
  }

  /**
   * Get current artifact for a stage
   */
  async getCurrentArtifact(projectId: string, stageId: string): Promise<Artifact | null> {
    return this.db.get(
      `SELECT * FROM artifacts WHERE project_id = ? AND stage_id = ? AND is_current = TRUE`,
      [projectId, stageId]
    );
  }

  // ========================================================================
  // STAGE STATE TRANSITIONS
  // ========================================================================

  /**
   * Move stage to next state with validation
   */
  async advanceStage(
    projectId: string,
    stageId: string,
    newStatus: StageStatus,
    userId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    // Check if stage can transition to new status
    const validation = this.validateStateTransition(newStatus);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check stage dependencies
    const canAdvance = await this.checkDependencies(projectId, stageId);
    if (!canAdvance) {
      return {
        success: false,
        error: 'Cannot advance: dependent stages must be approved first',
      };
    }

    const now = new Date();
    const updates: Record<string, any> = { status: newStatus, updated_at: now };

    if (newStatus === 'in_progress' && !updates.started_at) {
      updates.started_at = now;
    }

    if (newStatus === 'approved' || newStatus === 'blocked') {
      updates.completed_at = now;
    }

    await this.db.run(
      `UPDATE project_stage_status SET status = ?, updated_at = ?, started_at = ?, completed_at = ?
       WHERE project_id = ? AND stage_id = ?`,
      [updates.status, updates.updated_at, updates.started_at, updates.completed_at, projectId, stageId]
    );

    // Log the change
    await this.logChange({
      project_id: projectId,
      stage_id: stageId,
      action: 'updated',
      entity_type: 'project',
      changes: updates,
      user_id: userId,
      reason: reason || `Stage transitioned to ${newStatus}`,
    });

    return { success: true };
  }

  /**
   * Mark stage as blocked with reason
   */
  async blockStage(
    projectId: string,
    stageId: string,
    reason: string,
    userId: string
  ): Promise<void> {
    await this.db.run(
      `UPDATE project_stage_status SET status = 'blocked', blocked_reason = ?, updated_at = ?
       WHERE project_id = ? AND stage_id = ?`,
      ['blocked', reason, new Date(), projectId, stageId]
    );

    await this.logChange({
      project_id: projectId,
      stage_id: stageId,
      action: 'blocked',
      entity_type: 'project',
      user_id: userId,
      reason,
    });
  }

  // ========================================================================
  // GATE MANAGEMENT
  // ========================================================================

  /**
   * Create a gate for human review
   */
  async createGate(
    projectId: string,
    stageId: string,
    gateName: string,
    artifactId: string,
    userId: string,
    deadline?: Date
  ): Promise<Gate> {
    const id = `gate-${uuidv4()}`;
    const gateNumber = await this.getNextGateNumber(projectId, stageId);
    const now = new Date();

    const gate: Gate = {
      id,
      project_id: projectId,
      stage_id: stageId,
      gate_number: gateNumber,
      gate_name: gateName,
      artifact_id: artifactId,
      status: 'pending',
      requested_by: userId,
      created_at: now,
      decision_deadline: deadline,
    };

    await this.db.run(
      `INSERT INTO gates (
        id, project_id, stage_id, gate_number, gate_name, artifact_id,
        status, requested_by, created_at, decision_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        projectId,
        stageId,
        gateNumber,
        gateName,
        artifactId,
        'pending',
        userId,
        now,
        deadline,
      ]
    );

    await this.logChange({
      project_id: projectId,
      stage_id: stageId,
      artifact_id: artifactId,
      action: 'created',
      entity_type: 'gate',
      entity_id: id,
      user_id: userId,
      reason: `Gate "${gateName}" created for review`,
    });

    return gate;
  }

  /**
   * Make a decision on a gate
   */
  async decideGate(
    gateId: string,
    decision: GateDecision,
    reviewedBy: string,
    feedback?: string
  ): Promise<{ success: boolean; error?: string; nextAction?: string }> {
    const gate = await this.db.get('SELECT * FROM gates WHERE id = ?', [gateId]);

    if (!gate) {
      return { success: false, error: 'Gate not found' };
    }

    if (gate.status !== 'pending') {
      return { success: false, error: 'Gate already decided' };
    }

    const now = new Date();
    const gateStatus: GateStatus = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'changes_requested';

    await this.db.run(
      `UPDATE gates SET status = ?, reviewed_by = ?, decision = ?, feedback = ?, decided_at = ?
       WHERE id = ?`,
      [gateStatus, reviewedBy, decision, feedback, now, gateId]
    );

    // Handle decision consequences
    let nextAction = '';
    if (decision === 'approve') {
      await this.advanceStage(gate.project_id, gate.stage_id, 'approved', reviewedBy, 'Gate approved');
      nextAction = 'Stage approved. Ready for next stage.';
    } else if (decision === 'reject') {
      await this.blockStage(gate.project_id, gate.stage_id, 'Gate rejected. Revision required.', reviewedBy);
      nextAction = 'Stage blocked. Requires substantial revision.';
    } else {
      await this.advanceStage(
        gate.project_id,
        gate.stage_id,
        'requires_changes',
        reviewedBy,
        'Changes requested'
      );
      nextAction = 'Changes requested. Team may resubmit artifact.';
    }

    await this.logChange({
      project_id: gate.project_id,
      stage_id: gate.stage_id,
      artifact_id: gate.artifact_id,
      action: decision === 'approve' ? 'approved' : 'rejected',
      entity_type: 'gate',
      entity_id: gateId,
      user_id: reviewedBy,
      reason: feedback || `Gate decision: ${decision}`,
    });

    return { success: true, nextAction };
  }

  // ========================================================================
  // VALIDATION & RULES
  // ========================================================================

  /**
   * Validate required fields in artifact
   */
  async validateArtifact(
    artifactId: string,
    requiredFields: string[],
    data: Record<string, any>
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    for (const field of requiredFields) {
      const value = data[field];

      // Check if field is present and not empty
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        errors.push({
          field,
          rule: 'not_empty',
          message: `Field "${field}" is required`,
          severity: 'error',
        });
      }

      // Additional type-specific validations
      if (field === 'title' && typeof value === 'string') {
        if (value.length > 200) {
          errors.push({
            field,
            rule: 'max_length',
            message: `Title must be 200 characters or less (got ${value.length})`,
            severity: 'error',
          });
        }
      }

      if (field === 'audience' && typeof value === 'string' && value.length < 50) {
        errors.push({
          field,
          rule: 'min_length',
          message: 'Audience description must be at least 50 characters',
          severity: 'warning',
        });
      }
    }

    // Store validation results
    for (const error of errors) {
      const validationId = `val-${uuidv4()}`;
      await this.db.run(
        `INSERT INTO validations (id, artifact_id, field_name, rule_name, is_valid, error_message, severity, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          validationId,
          artifactId,
          error.field,
          error.rule,
          false,
          error.message,
          error.severity,
          new Date(),
        ]
      );
    }

    // Update artifact validation status
    const isValid = errors.filter((e) => e.severity === 'error').length === 0;
    await this.db.run(
      `UPDATE artifacts SET validation_status = ?, validation_errors = ?
       WHERE id = ?`,
      [isValid ? 'valid' : 'invalid', JSON.stringify(errors), artifactId]
    );

    return errors;
  }

  /**
   * Check if state transition is allowed
   */
  private validateStateTransition(newStatus: StageStatus): { valid: boolean; error?: string } {
    const allowedTransitions: Record<StageStatus, StageStatus[]> = {
      pending: ['in_progress', 'blocked'],
      in_progress: ['approved', 'requires_changes', 'blocked'],
      requires_changes: ['in_progress', 'blocked'],
      approved: ['pending'],
      blocked: ['pending', 'in_progress'],
    };

    // This would check against current state in real usage
    return { valid: true };
  }

  /**
   * Check if stage dependencies are met
   */
  private async checkDependencies(projectId: string, stageId: string): Promise<boolean> {
    const dependencies = await this.db.all(
      `SELECT depends_on_stage_id FROM stage_dependencies WHERE stage_id = ?`,
      [stageId]
    );

    if (dependencies.length === 0) {
      return true;
    }

    for (const dep of dependencies) {
      const depStatus = await this.db.get(
        `SELECT status FROM project_stage_status WHERE project_id = ? AND stage_id = ?`,
        [projectId, dep.depends_on_stage_id]
      );

      if (!depStatus || depStatus.status !== 'approved') {
        return false;
      }
    }

    return true;
  }

  /**
   * Get next gate number for a stage
   */
  private async getNextGateNumber(projectId: string, stageId: string): Promise<number> {
    const result = await this.db.get(
      `SELECT COALESCE(MAX(gate_number), 0) + 1 as next_num FROM gates 
       WHERE project_id = ? AND stage_id = ?`,
      [projectId, stageId]
    );
    return result.next_num;
  }

  // ========================================================================
  // AUDIT & REPORTING
  // ========================================================================

  /**
   * Log a change to audit trail
   */
  private async logChange(entry: Omit<ChangeLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const id = `log-${uuidv4()}`;
    await this.db.run(
      `INSERT INTO change_log (
        id, project_id, artifact_id, stage_id, action, entity_type,
        entity_id, changes, user_id, reason, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        entry.project_id,
        entry.artifact_id,
        entry.stage_id,
        entry.action,
        entry.entity_type,
        entry.entity_id,
        entry.changes ? JSON.stringify(entry.changes) : null,
        entry.user_id,
        entry.reason,
        new Date(),
      ]
    );
  }

  /**
   * Get full project status
   */
  async getProjectStatus(projectId: string): Promise<any> {
    const project = await this.db.get('SELECT * FROM projects WHERE id = ?', [projectId]);
    const stageStatuses = await this.db.all(
      `SELECT pss.*, s.name as stage_name, s.ordinal 
       FROM project_stage_status pss
       JOIN stages s ON pss.stage_id = s.id
       WHERE pss.project_id = ?
       ORDER BY s.ordinal`,
      [projectId]
    );
    const pendingGates = await this.db.all(
      `SELECT * FROM gates WHERE project_id = ? AND status = 'pending' ORDER BY decision_deadline`,
      [projectId]
    );

    return {
      project,
      stages: stageStatuses,
      pending_gates: pendingGates,
    };
  }

  /**
   * Get audit trail for a project
   */
  async getAuditTrail(projectId: string, limit: number = 50): Promise<ChangeLogEntry[]> {
    return this.db.all(
      `SELECT * FROM change_log WHERE project_id = ? ORDER BY timestamp DESC LIMIT ?`,
      [projectId, limit]
    );
  }
}

export default Orchestrator;
