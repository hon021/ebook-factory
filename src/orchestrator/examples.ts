/**
 * Orchestrator Usage Examples
 *
 * Complete workflows demonstrating the orchestrator in action.
 */

import { initializeOrchestrator } from './init';

// ============================================================================
// EXAMPLE: Complete Project Flow - Educational Book
// ============================================================================

export async function exampleFlow() {
  const orchestrator = await initializeOrchestrator('./ebook-factory.db');

  console.log('\n📚 ORCHESTRATOR WORKFLOW EXAMPLE\n');

  try {
    // Step 1: Create project
    console.log('Step 1: Create project');
    const project = await orchestrator.createProject({
      title: 'IA útil en el trabajo',
      genre: 'educational',
      theme: 'AI applications for office workers',
      target_audience: 'Profesionales mexicanos 25-55 años',
      reading_level: 'intermediate',
      content_classification: 'general',
      language: 'es-MX',
      format: 'epub',
      created_by: 'user-main',
      is_active: true,
    });
    console.log(`✓ Project created: ${project.id}`);
    console.log(`  Genre: ${project.genre}`);

    // Step 2: Create intake artifact (brief)
    console.log('\nStep 2: Create intake artifact');
    const brief = await orchestrator.createArtifact(
      project.id,
      'intake',
      'brief',
      'artifacts/brief-v1.json',
      {
        chapters: 8,
        words_estimated: 48000,
        status: 'approved',
      },
      'user-main'
    );
    console.log(`✓ Brief artifact created: ${brief.id} (v${brief.version})`);

    // Step 3: Advance intake stage
    console.log('\nStep 3: Advance intake stage');
    await orchestrator.advanceStage(
      project.id,
      'intake',
      'approved',
      'system',
      'Brief validated and ready'
    );
    console.log(`✓ Intake stage approved`);

    // Step 4: Create research artifact
    console.log('\nStep 4: Create research artifact');
    const sources = await orchestrator.createArtifact(
      project.id,
      'research',
      'source_dossier',
      'artifacts/sources-v1.json',
      {
        sources_count: 12,
        credibility_average: 78,
      },
      'user-main'
    );
    console.log(`✓ Source dossier created: ${sources.id}`);

    // Step 5: Advance research stage
    console.log('\nStep 5: Advance research stage');
    await orchestrator.advanceStage(
      project.id,
      'research',
      'approved',
      'system',
      'Sources compiled and verified'
    );
    console.log(`✓ Research stage approved`);

    // Step 6: Create design artifact
    console.log('\nStep 6: Create design artifact');
    const design = await orchestrator.createArtifact(
      project.id,
      'design',
      'outline',
      'artifacts/outline-v1.json',
      {
        chapters: 8,
        promises: 1,
        learning_objectives: 24,
      },
      'user-main'
    );
    console.log(`✓ Design outline created: ${design.id}`);

    // Step 7: Create Gate 1 (Editorial Review)
    console.log('\nStep 7: Create Gate 1 (Editorial Review)');
    const gate1 = await orchestrator.createGate(
      project.id,
      'design',
      'editorial_review',
      design.id,
      'user-main',
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    );
    console.log(`✓ Gate 1 created: ${gate1.id}`);
    console.log(`  Gate name: ${gate1.gate_name}`);
    console.log(`  Status: ${gate1.status}`);

    // Step 8: Approve Gate 1
    console.log('\nStep 8: Approve Gate 1');
    const gateDecision = await orchestrator.decideGate(
      gate1.id,
      'approve',
      'editor-main',
      'Excellent design and outline. Ready to proceed with sample writing.'
    );
    console.log(`✓ Gate 1 approved`);
    console.log(`  Result: ${gateDecision.nextAction}`);

    // Step 9: Get project status
    console.log('\nStep 9: Get project status');
    const status = await orchestrator.getProjectStatus(project.id);
    console.log(`✓ Project Status:`);
    console.log(`  ID: ${status.id}`);
    console.log(`  Title: ${status.title}`);
    console.log(`  Genre: ${status.genre}`);
    console.log(`  Current stage: design`);

    console.log('\n✅ WORKFLOW COMPLETE\n');
    console.log('Next steps:');
    console.log('  1. Implement Skill 4: Sample writing (1 chapter)');
    console.log('  2. Implement Skill 5: Manuscript generation (7 chapters)');
    console.log('  3. Implement Skill 6: Editing & QA');
    console.log('  4. Publish to Amazon KDP\n');

  } catch (error) {
    console.error('❌ Error in workflow:', error);
    throw error;
  }
}

// Run example
if (require.main === module) {
  exampleFlow().catch(console.error);
}
