/**
 * Example: Using Skill 2 (Research)
 *
 * This example demonstrates how to:
 * 1. Initialize the orchestrator and get an intake artifact
 * 2. Run the Research skill to compile sources
 * 3. Verify the dossier was created with 10+ sources
 * 4. Inspect source credibility scores and chapters
 */

import { initializeOrchestrator } from '../init';
import { IntakeSkill } from './intake';
import { ResearchSkill } from './research';
import * as path from 'path';

async function runResearchExample() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     SKILL 2: RESEARCH - Example Usage                  ║');
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
    created_by: 'skill-research-demo',
    is_active: true,
  });
  console.log(`   ✅ Project created: ${project.id}\n`);

  // Step 3: Run Skill 1 (Intake) to get the artifact
  console.log('3️⃣  Running Skill 1 (Intake) to prepare input...');
  const intakeSkill = new IntakeSkill(orchestrator);
  const briefPath = path.join(process.cwd(), 'docs/01-brief/BRIEF_EDITORIAL.md');

  let intakeResult: any;
  try {
    intakeResult = await intakeSkill.process(briefPath, project.id);
    console.log(`   ✅ Intake completed, artifact: ${intakeResult.artifact.id}\n`);
  } catch (error: any) {
    console.error('   ❌ Intake failed:', error.message);
    return;
  }

  // Step 4: Initialize Research Skill
  console.log('4️⃣  Initializing Research Skill...');
  const researchSkill = new ResearchSkill(orchestrator);
  console.log('   ✅ Research Skill ready\n');

  // Step 5: Run research
  console.log('5️⃣  Compiling research sources...');
  try {
    const result = await researchSkill.process(project.id, intakeResult.artifact);

    console.log('   ✅ Research completed successfully!\n');

    // Step 6: Display results
    console.log('📊 RESEARCH RESULTS:');
    console.log(`   Project ID:               ${project.id}`);
    console.log(`   Artifact ID:              ${result.artifact.id}`);
    console.log(`   Artifact Type:            ${result.artifact.artifact_type}`);
    console.log(`   Sources Found:            ${result.sources_found}`);
    console.log(`   Topics Researched:        ${result.topics_researched}`);
    console.log(`   Total Annotations:        ${result.total_annotations}\n`);

    // Step 7: Get artifact content to show sources
    console.log('📚 SOURCE BREAKDOWN:');
    const artifactContent = JSON.parse(result.artifact.content);

    console.log(`   Total Sources: ${artifactContent.research.total_sources}`);
    console.log(`   Average Credibility: ${artifactContent.research.credibility_distribution.average}/5.0`);
    console.log(`   Sources by Credibility:`);
    console.log(`     • 5-star sources: ${artifactContent.research.credibility_distribution.distribution['5_stars']}`);
    console.log(`     • 4-star sources: ${artifactContent.research.credibility_distribution.distribution['4_stars']}`);
    console.log(`     • 3-star sources: ${artifactContent.research.credibility_distribution.distribution['3_stars']}\n`);

    console.log('   Sources by Type:');
    Object.entries(artifactContent.research.sources_by_type).forEach(
      ([type, ids]: any) => {
        console.log(`     • ${type}: ${ids.length}`);
      }
    );

    console.log('\n   Sample Sources:');
    artifactContent.sources.slice(0, 3).forEach((source: any) => {
      console.log(`     • "${source.title}"`);
      console.log(`       Author: ${source.author}`);
      console.log(`       Credibility: ${source.credibility_score}/5`);
      console.log(`       Chapters: ${source.relevant_chapters.join(', ')}`);
      console.log(
        `       Annotation: ${source.annotation.substring(0, 60)}...\n`
      );
    });

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║ ✅ SKILL 2 (RESEARCH) COMPLETED SUCCESSFULLY           ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log('║ Next Steps:                                            ║');
    console.log('║ • Run Skill 3 (Design) to create outline              ║');
    console.log('║ • Generate learning objectives per chapter            ║');
    console.log('║ • Create exercises and practical examples             ║');
    console.log('║ • Prepare for Gate 1 (Editorial Review)              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
  } catch (error: any) {
    console.error('❌ Error during research:');
    console.error(`   ${error.message}`);

    if (error.sources) {
      console.error(`\n   Found ${error.sources.length} sources before error`);
    }
  }
}

// Run the example
runResearchExample().catch(console.error);
