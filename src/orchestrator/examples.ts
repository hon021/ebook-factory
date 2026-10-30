/**
 * Orchestrator Usage Examples
 *
 * Complete workflows demonstrating the orchestrator in action.
 */

import { initializeOrchestrator } from './init';

// ============================================================================
// EXAMPLE 1: Complete Project Flow - Educational Book
// ============================================================================

export async function exampleEducationalBookFlow() {
  const orchestrator = await initializeOrchestrator('./ebook-factory.db');

  console.log('\n📚 EXAMPLE: Educational Book Workflow\n');

  // Step 1: Create project
  console.log('Step 1: Create project');
  const project = await orchestrator.createProject({
    title: 'IA útil en el trabajo',
    genre: 'educational',
    subgenre: 'practical-guide',
    theme: 'AI applications for office workers',
    target_audience: 'Professionals with basic digital skills, new to AI generative',
    target_age_min: 18,
    reading_level: 'simple',
    content_classification: 'general',
    language: 'es-MX',
    format: 'epub',
    estimated_word_count: 45000,
    created_by: 'user-sarah',
    is_active: true,
  });
  console.log(`✓ Project created: ${project.id}`);

  // Step 2: Intake stage - receive brief
  console.log('\nStep 2: Intake stage');
  const brief = await orchestrator.createArtifact(
    project.id,
    'intake',
    'brief',
    'artifacts/proj-123/brief-v1.md',
    {
      submitted_by: 'user-sarah',
      submitted_at: new Date(),
      brief_sections: ['title', 'audience', 'promise', 'outline'],
    },
    'user-sarah'
  );
  console.log(`✓ Brief artifact created: ${brief.id}`);

  // Validate brief
  const intakeValidationErrors = await orchestrator.validateArtifact(
    brief.id,
    ['title', 'genre', 'target_audience', 'promise'],
    {
      title: 'IA útil en el trabajo',
      genre: 'educational',
      target_audience: 'Profesionales que usan herramientas digitales pero nunca usaron IA',
      promise: 'Aprenderás a usar IA para redactar, resumir, organizar y revisar trabajo',
    }
  );

  if (intakeValidationErrors.length === 0) {
    await orchestrator.advanceStage(
      project.id,
      'intake',
      'approved',
      'agent-intake',
      'Brief normalized and validated'
    );
    console.log('✓ Intake approved, proceeding to research');
  }

  // Step 3: Research stage
  console.log('\nStep 3: Research stage');
  await orchestrator.advanceStage(project.id, 'research', 'in_progress', 'agent-research', 'Starting research');

  const sourceDossier = await orchestrator.createArtifact(
    project.id,
    'research',
    'source_dossier',
    'artifacts/proj-123/sources-v1.md',
    {
      sources_count: 12,
      date_compiled: new Date(),
      domains: ['openai.com', 'anthropic.com', 'github.com'],
    },
    'agent-research'
  );
  console.log(`✓ Source dossier created: ${sourceDossier.id}`);

  await orchestrator.advanceStage(project.id, 'research', 'approved', 'agent-research', 'Research complete');
  console.log('✓ Research approved');

  // Step 4: Design stage - editorial outline
  console.log('\nStep 4: Design stage (Editorial Design Approval Gate)');
  await orchestrator.advanceStage(project.id, 'design', 'in_progress', 'agent-design', 'Starting design');

  const outline = await orchestrator.createArtifact(
    project.id,
    'design',
    'outline',
    'artifacts/proj-123/outline-v1.md',
    {
      chapters: 8,
      word_count_per_chapter: [5000, 5000, 6000, 5500, 5000, 5500, 6000, 5000],
      total_estimated_words: 45000,
    },
    'agent-design'
  );

  const objectives = await orchestrator.createArtifact(
    project.id,
    'design',
    'learning_objectives',
    'artifacts/proj-123/objectives-v1.md',
    {
      chapters: 8,
      objectives_per_chapter: 2,
    },
    'agent-design'
  );

  console.log(`✓ Outline created (v${outline.version})`);
  console.log(`✓ Learning objectives created (v${objectives.version})`);

  // Create GATE 1: Design Approval
  const gate1 = await orchestrator.createGate(
    project.id,
    'design',
    'Editorial Design Approval',
    outline.id,
    'agent-design',
    new Date(Date.now() + 48 * 3600000) // 48-hour deadline
  );

  console.log(`✓ GATE 1 created: "${gate1.gate_name}" (${gate1.id})`);
  console.log('  ⏳ Awaiting human reviewer...\n');

  // Simulate human review after 2 "hours"
  console.log('  [2 hours pass...human reviewer opens gate]');
  const gate1Decision = await orchestrator.decideGate(
    gate1.id,
    'request_changes',
    'editor-jane',
    'Outline looks good overall. Suggestions: (1) Chapter 3 could include a short exercise. (2) Consider swapping chapters 5-6 order for better narrative flow.'
  );

  console.log(`✓ Gate 1 decided: ${gate1Decision.nextAction}`);
  console.log('  Action: Team revises and resubmits outline\n');

  // Team creates new version
  const outlineV2 = await orchestrator.createArtifact(
    project.id,
    'design',
    'outline',
    'artifacts/proj-123/outline-v2.md',
    {
      chapters: 8,
      revised_with_feedback: 'Added exercise to chapter 3, reordered chapters 5-6',
    },
    'agent-design'
  );

  console.log(`✓ Outline revised: v${outlineV2.version}`);

  // Create new gate for revised outline
  const gate1b = await orchestrator.createGate(
    project.id,
    'design',
    'Editorial Design Approval (Revised)',
    outlineV2.id,
    'agent-design'
  );

  // This time human approves
  const gate1bDecision = await orchestrator.decideGate(
    gate1b.id,
    'approve',
    'editor-jane',
    'Excellent revisions. Structure is clear and well-paced.'
  );

  console.log(`✓ Gate 1 APPROVED: ${gate1bDecision.nextAction}\n`);

  // Step 5: Sample chapter
  console.log('Step 5: Sample chapter');
  await orchestrator.advanceStage(project.id, 'sample', 'in_progress', 'agent-writer', 'Writing sample');

  const sample = await orchestrator.createArtifact(
    project.id,
    'sample',
    'sample_chapter',
    'artifacts/proj-123/sample-chapter-v1.md',
    {
      chapter_number: 1,
      word_count: 5200,
      includes_exercise: true,
      includes_checklist: true,
    },
    'agent-writer'
  );

  console.log(`✓ Sample chapter created: ${sample.word_count} words`);
  await orchestrator.advanceStage(project.id, 'sample', 'approved', 'agent-qa', 'Sample QA passed');

  // Step 6: Full manuscript
  console.log('\nStep 6: Full manuscript');
  await orchestrator.advanceStage(project.id, 'manuscript', 'in_progress', 'agent-writer', 'Writing manuscript');

  const manuscript = await orchestrator.createArtifact(
    project.id,
    'manuscript',
    'manuscript',
    'artifacts/proj-123/manuscript-v1.md',
    {
      word_count: 45300,
      chapters: 8,
      exercises: 8,
      includes_references: true,
    },
    'agent-writer'
  );

  console.log(`✓ Manuscript completed: ${manuscript.metadata.word_count} words, ${manuscript.metadata.chapters} chapters`);
  await orchestrator.advanceStage(
    project.id,
    'manuscript',
    'approved',
    'agent-writer',
    'Manuscript ready for editing'
  );

  // Step 7: Editorial review
  console.log('\nStep 7: Editorial review (Spanish - es-MX)');
  await orchestrator.advanceStage(project.id, 'editing', 'in_progress', 'agent-editor', 'Starting editorial review');

  const edited = await orchestrator.createArtifact(
    project.id,
    'editing',
    'edited_manuscript',
    'artifacts/proj-123/edited-es-MX-v1.md',
    {
      language_variant: 'es-MX',
      changes_made: 127,
      style_corrections: 45,
      clarity_improvements: 82,
    },
    'agent-editor'
  );

  console.log(`✓ Manuscript edited: ${edited.metadata.changes_made} changes, localized for es-MX`);
  await orchestrator.advanceStage(project.id, 'editing', 'approved', 'agent-editor', 'Editing complete');

  // Step 8: QA
  console.log('\nStep 8: QA & Final Review (GATE 2)');
  await orchestrator.advanceStage(project.id, 'qa', 'in_progress', 'agent-qa', 'Starting QA');

  const qaReport = await orchestrator.createArtifact(
    project.id,
    'qa',
    'qa_report',
    'artifacts/proj-123/qa-report-v1.md',
    {
      total_issues: 3,
      critical: 0,
      high: 0,
      medium: 2,
      low: 1,
      genre_checklist_passed: true,
      source_verification_passed: true,
      exercise_validation_passed: true,
    },
    'agent-qa'
  );

  console.log(`✓ QA Report: ${qaReport.metadata.total_issues} issues (0 critical, 2 medium, 1 low)`);

  // Create GATE 2: QA Approval
  const gate2 = await orchestrator.createGate(
    project.id,
    'qa',
    'QA & Final Approval',
    qaReport.id,
    'agent-qa'
  );

  console.log(`✓ GATE 2 created: "${gate2.gate_name}"`);
  console.log('  ⏳ Awaiting QA review...\n');

  // Human QA reviewer decides
  const gate2Decision = await orchestrator.decideGate(
    gate2.id,
    'approve',
    'qa-manager-john',
    'All issues resolved. Manuscript is ready for production.'
  );

  console.log(`✓ Gate 2 APPROVED: ${gate2Decision.nextAction}\n`);

  // Step 9: Production
  console.log('Step 9: Production');
  await orchestrator.advanceStage(project.id, 'production', 'in_progress', 'agent-production', 'Starting production');

  const productionPackage = await orchestrator.createArtifact(
    project.id,
    'production',
    'production_package',
    'artifacts/proj-123/production-package-v1.epub',
    {
      format: 'epub',
      file_size_mb: 2.1,
      metadata_complete: true,
      cover_included: true,
      validated: true,
    },
    'agent-production'
  );

  console.log(`✓ Production complete: ${productionPackage.metadata.format} file (${productionPackage.metadata.file_size_mb}MB)`);
  await orchestrator.advanceStage(project.id, 'production', 'approved', 'agent-production', 'Production complete');

  // Final status
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL PROJECT STATUS');
  console.log('='.repeat(60));

  const finalStatus = await orchestrator.getProjectStatus(project.id);
  for (const stage of finalStatus.stages) {
    const statusIcon = {
      approved: '✓',
      in_progress: '◐',
      pending: '○',
      requires_changes: '⚠',
      blocked: '✗',
    }[stage.status];

    console.log(`${statusIcon} ${stage.stage_name.padEnd(25)} ${stage.status.padEnd(18)} v${stage.artifact_version || '-'}`);
  }

  console.log('\n✅ Project ready for publishing!\n');

  // Audit trail
  console.log('📋 Recent audit trail:');
  const auditTrail = await orchestrator.getAuditTrail(project.id, 5);
  for (const entry of auditTrail) {
    console.log(`  ${entry.timestamp.toISOString()} | ${entry.user_id} | ${entry.action} | ${entry.reason}`);
  }
}

// ============================================================================
// EXAMPLE 2: Project Blocked Due to Gate Rejection
// ============================================================================

export async function exampleGateRejection() {
  const orchestrator = await initializeOrchestrator('./ebook-factory.db');

  console.log('\n🚫 EXAMPLE: Gate Rejection Flow\n');

  const project = await orchestrator.createProject({
    title: 'Relato de Misterio',
    genre: 'mystery',
    theme: 'Detective story',
    target_audience: 'Readers aged 16+',
    reading_level: 'intermediate',
    content_classification: 'general',
    language: 'es-MX',
    format: 'epub',
    created_by: 'user-bob',
  });

  console.log(`Project: ${project.title} (${project.id})`);

  // Proceed to design
  await orchestrator.advanceStage(project.id, 'intake', 'approved', 'agent-intake', '');
  await orchestrator.advanceStage(project.id, 'research', 'approved', 'agent-research', '');
  await orchestrator.advanceStage(project.id, 'design', 'in_progress', 'agent-design', '');

  const outline = await orchestrator.createArtifact(
    project.id,
    'design',
    'outline',
    'artifacts/mystery-outline-v1.md',
    { chapters: 8, solution_reveals_chapter: 6 },
    'agent-design'
  );

  // Gate 1 review
  const gate = await orchestrator.createGate(
    project.id,
    'design',
    'Editorial Design Approval',
    outline.id,
    'agent-design'
  );

  console.log('\nGate 1 submitted for review...');

  // Human reviewer REJECTS
  const decision = await orchestrator.decideGate(
    gate.id,
    'reject',
    'editor-jane',
    'The mystery structure has a critical flaw: clues are not properly planted before the revelation. The solution appears in chapter 6 but key clues are only mentioned in chapters 7-8. This violates the mystery format and betrays reader trust. Requires substantial restructuring.'
  );

  console.log(`\n${decision.nextAction}`);

  // Check project status
  const status = await orchestrator.getProjectStatus(project.id);
  const designStatus = status.stages.find((s: any) => s.stage_id === 'design');
  console.log(`\nDesign stage: ${designStatus.status}`);
  console.log(`Blocked reason: ${designStatus.blocked_reason}`);
}

// Run examples
if (require.main === module) {
  (async () => {
    try {
      await exampleEducationalBookFlow();
      // await exampleGateRejection();
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })();
}
