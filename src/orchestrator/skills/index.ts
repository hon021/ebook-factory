/**
 * Skills Package
 *
 * Exports all editorial skills for the Ebook Factory orchestrator.
 * Each skill handles a specific stage in the editorial pipeline.
 *
 * Skills:
 * - Intake: Normalize brief → JSON artifact
 * - Research: Find and compile sources
 * - Design: Create outline + learning objectives
 * - Sample: Generate writing sample
 * - Manuscript: Write full manuscript
 * - Editing: Professional editing pass
 * - QA: Quality assurance and testing
 * - Production: Prepare for publishing
 */

export { IntakeSkill, ValidationError, ValidationIssue, ValidationResult } from './intake';
export { ResearchSkill, ResearchError, Source, ResearchResult } from './research';
// export { DesignSkill } from './design';     // Coming in Phase 2 Week 4
