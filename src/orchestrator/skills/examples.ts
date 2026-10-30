/**
 * Example: Using Skill 1 (Intake)
 *
 * This example demonstrates how to:
 * 1. Initialize the orchestrator
 * 2. Create a project
 * 3. Run the Intake skill to process the brief editorial
 * 4. Verify the artifact was created
 */

import { initializeOrchestrator } from '../init';
import { IntakeSkill } from './intake';
import * as path from 'path';

async function runIntakeExample() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     SKILL 1: INTAKE - Example Usage                    ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Step 1: Initialize orchestrator
  console.log('1️⃣  Initializing orchestrator...');
  const orchestrator = await initializeOrchestrator('./ebook-factory.db');
  console.log('   ✅ Orchestrator initialized\n');

  // Step 2: Create a project
  console.log('2️⃣  Creating project...');
  const project = await orchestrator.createProject({
    title: 'IA útil en el trabajo',
    genre: 'educational',
    theme: 'Practical AI for office workers',
    target_audience: 'Professionals new to AI',
    reading_level: 'simple',
    content_classification: 'general',
    language: 'es-MX',
    format: 'epub',
    estimated_word_count: 48000,
    created_by: 'skill-intake-demo',
    is_active: true,
  });
  console.log(`   ✅ Project created: ${project.id}\n`);

  // Step 3: Initialize IntakeSkill
  console.log('3️⃣  Initializing Intake Skill...');
  const intakeSkill = new IntakeSkill(orchestrator);
  console.log('   ✅ Intake Skill ready\n');

  // Step 4: Process the brief
  console.log('4️⃣  Processing brief editorial...');
  const briefPath = path.join(process.cwd(), 'docs/01-brief/BRIEF_EDITORIAL.md');

  try {
    const result = await intakeSkill.process(briefPath, project.id);

    console.log('   ✅ Brief processed successfully!\n');

    // Step 5: Display results
    console.log('📊 INTAKE RESULTS:');
    console.log(`   Project ID:             ${project.id}`);
    console.log(`   Artifact ID:            ${result.artifact.id}`);
    console.log(`   Artifact Type:          ${result.artifact.artifact_type}`);
    console.log(`   Version:                ${result.artifact.version}`);
    console.log(`   Stage:                  ${result.artifact.stage}`);
    console.log(`   Status:                 ${result.artifact.status}`);
    console.log(`   Fields Validated:       ${result.validated_fields.length} fields`);
    console.log(`   Validation Passed:      ${result.total_validation_passed ? '✅ YES' : '❌ NO'}\n`);

    // Step 6: Verify the project status
    console.log('5️⃣  Verifying project status...');
    const status = await orchestrator.getProjectStatus(project.id);
    console.log(`   ✅ Project Status:      ${status.current_stage}`);
    console.log(`   Stage Status:           ${status.stage_status}`);
    console.log(`   Total Artifacts:        ${status.artifacts.length}\n`);

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║ ✅ SKILL 1 (INTAKE) COMPLETED SUCCESSFULLY            ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log('║ Next Steps:                                            ║');
    console.log('║ • Run Skill 2 (Research) to find sources              ║');
    console.log('║ • Create source dossier with 10+ verified sources     ║');
    console.log('║ • Advance to Design stage                             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
  } catch (error: any) {
    console.error('❌ Error processing brief:');
    console.error(`   ${error.message}`);

    if (error.errors) {
      console.error('\n   Validation Errors:');
      error.errors.forEach((err: any) => {
        console.error(`   - [${err.severity.toUpperCase()}] ${err.field}: ${err.message}`);
      });
    }
  }
}

// Run the example
runIntakeExample().catch(console.error);
