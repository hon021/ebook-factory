/**
 * SKILL 3: DESIGN - Usage Examples
 * 
 * This file demonstrates how to use the Design skill to create
 * book outlines, learning objectives, and exercises.
 */

import { DesignSkill } from './design';

// ============================================================================
// EXAMPLE 1: Complete Design Workflow
// ============================================================================

async function example1_completeDesignWorkflow() {
  console.log('\n' + '='.repeat(80));
  console.log('SKILL 3: DESIGN - Complete Workflow Example');
  console.log('='.repeat(80) + '\n');

  // Mock research artifact (output from Skill 2)
  const researchArtifact = {
    book: {
      title: 'IA útil en el trabajo',
      genre: 'educational',
      promise: 'Master practical AI to transform your professional work',
      estimated_chapter_count: 8,
      target_audience: 'Working professionals, non-technical, ages 30-55'
    },
    research: {
      topics_researched: 15,
      total_sources: 16,
      research_complete: true
    },
    sources: [
      {
        id: 'source-001',
        title: 'Large Language Models as Tool-Makers',
        url: 'https://arxiv.org/abs/2305.16937',
        source_type: 'academic',
        credibility_score: 5
      },
      {
        id: 'source-002',
        title: 'The future of work with AI',
        url: 'https://www.mckinsey.com/...',
        source_type: 'industry_report',
        credibility_score: 5
      },
      {
        id: 'source-003',
        title: 'Prompt Engineering Best Practices',
        url: 'https://github.com/openai/...',
        source_type: 'documentation',
        credibility_score: 5
      }
    ]
  };

  // In production, this would come from orchestrator
  // For this example, we create a mock Design skill
  class MockOrchestrator {
    async createArtifact(projectId: string, type: string, stage: string, artifact: any, version: string) {
      return {
        id: 'art-design-001',
        project_id: projectId,
        stage,
        artifact_type: type,
        version: parseInt(version),
        status: 'approved',
        created_at: new Date().toISOString(),
        is_current: true
      };
    }

    async advanceStage(projectId: string, from: string, to: string, message: string) {
      console.log(`  ✓ Stage advanced: ${from} → ${to}`);
    }
  }

  const orchestrator = new MockOrchestrator() as any;
  const designSkill = new DesignSkill(orchestrator);

  try {
    const result = await designSkill.process('proj-123', researchArtifact);

    console.log('\n📊 DESIGN RESULTS:');
    console.log('━'.repeat(80));
    console.log(`✓ Outline created: ${result.outline_created}`);
    console.log(`✓ Chapters designed: ${result.chapters_designed}`);
    console.log(`✓ Total learning objectives: ${result.total_learning_objectives}`);
    console.log(`✓ Total exercises: ${result.total_exercises}`);
    console.log(`✓ Quality score: ${result.design_quality_score}/10`);
    console.log(`✓ Message: ${result.message}`);
  } catch (error) {
    console.error('❌ Design failed:', error);
  }
}

// ============================================================================
// EXAMPLE 2: Chapter Outline Structure
// ============================================================================

async function example2_chapterOutlineStructure() {
  console.log('\n' + '='.repeat(80));
  console.log('SKILL 3: DESIGN - Chapter Outline Example');
  console.log('='.repeat(80) + '\n');

  const chapter1Example = {
    chapter_number: 1,
    title: 'AI Fundamentals for Professionals',
    subtitle: 'From ChatGPT to Enterprise AI',
    estimated_word_count: 4500,
    key_topics: [
      'AI history and evolution',
      'Machine learning basics',
      'Large language model architecture',
      'AI capabilities and limitations'
    ],
    learning_objectives: [
      {
        id: 'obj-1-1',
        objective: 'Explain the key differences between AI, machine learning, and large language models',
        bloom_level: 'understand',
        measurable: true,
        timeframe: 'By end of chapter'
      },
      {
        id: 'obj-1-2',
        objective: 'Identify current limitations and ethical considerations of AI systems',
        bloom_level: 'analyze',
        measurable: true,
        timeframe: 'By end of chapter'
      }
    ],
    exercises: [
      {
        id: 'ex-1-1',
        title: 'AI Capability Mapping',
        description: 'Identify a professional task and map current AI capabilities that could assist with it',
        difficulty: 'beginner',
        estimated_time: 30,
        learning_objectives: ['obj-1-1', 'obj-1-2'],
        resources: ['ChatGPT', 'Claude', 'Google AI'],
        acceptance_criteria: [
          'Task clearly defined with current workflow',
          'At least 3 AI capabilities identified',
          'Practical implementation considerations noted'
        ]
      },
      {
        id: 'ex-1-2',
        title: 'Limitations Case Study',
        description: 'Research a real-world AI failure or limitation and present analysis',
        difficulty: 'intermediate',
        estimated_time: 60,
        learning_objectives: ['obj-1-2'],
        resources: ['News archives', 'AI incident database'],
        acceptance_criteria: [
          'Case study clearly documented',
          'Root causes identified',
          'Mitigation strategies proposed'
        ]
      }
    ],
    sources: ['source-001', 'source-002', 'source-003'],
    narrative_flow: [
      'Hook: Real business problem solved by AI',
      'What is AI? Definition beyond hype',
      'Machine learning: How computers learn',
      'Large language models: The core technology',
      'Capabilities vs. limitations',
      'Practical implications for work'
    ],
    assessment_strategy: 'Quiz on AI definitions, discussion on limitations',
    revision_notes: 'Ensure accessibility for non-technical readers'
  };

  console.log('📖 CHAPTER 1 OUTLINE:');
  console.log('━'.repeat(80));
  console.log(`Title: ${chapter1Example.title}`);
  console.log(`Subtitle: ${chapter1Example.subtitle}`);
  console.log(`Word count: ${chapter1Example.estimated_word_count} words`);
  console.log(`\nKey Topics:`);
  chapter1Example.key_topics.forEach(topic => console.log(`  • ${topic}`));
  
  console.log(`\nLearning Objectives (${chapter1Example.learning_objectives.length}):`);
  chapter1Example.learning_objectives.forEach(obj => {
    console.log(`  • [${obj.bloom_level.toUpperCase()}] ${obj.objective}`);
  });

  console.log(`\nExercises (${chapter1Example.exercises.length}):`);
  chapter1Example.exercises.forEach(ex => {
    console.log(`  • ${ex.title} (${ex.difficulty}, ${ex.estimated_time} min)`);
  });

  console.log(`\nNarrative Flow:`);
  chapter1Example.narrative_flow.forEach((flow, i) => {
    console.log(`  ${i + 1}. ${flow}`);
  });
}

// ============================================================================
// EXAMPLE 3: Learning Objectives (Bloom's Taxonomy)
// ============================================================================

async function example3_learningObjectives() {
  console.log('\n' + '='.repeat(80));
  console.log('SKILL 3: DESIGN - Learning Objectives Progression');
  console.log('='.repeat(80) + '\n');

  const bloomProgression = [
    {
      chapter: 1,
      bloom_level: 'understand',
      objectives: [
        'Explain the key differences between AI, machine learning, and large language models',
        'Identify current limitations and ethical considerations of AI systems'
      ]
    },
    {
      chapter: 3,
      bloom_level: 'apply',
      objectives: [
        'Apply prompt engineering techniques to generate higher quality AI outputs',
        'Analyze the effectiveness of different prompt structures for specific use cases'
      ]
    },
    {
      chapter: 5,
      bloom_level: 'evaluate',
      objectives: [
        'Evaluate AI tools and solutions for specific business problems',
        'Create an AI-integrated workflow for your own work'
      ]
    },
    {
      chapter: 8,
      bloom_level: 'create',
      objectives: [
        'Design an ethical AI governance framework for an organization',
        'Develop a comprehensive AI strategy and 90-day learning plan for yourself'
      ]
    }
  ];

  console.log('📚 BLOOM\'S TAXONOMY PROGRESSION:');
  console.log('━'.repeat(80));
  console.log('\nLearning progresses from basic to complex:');
  console.log('  Remember → Understand → Apply → Analyze → Evaluate → Create\n');

  bloomProgression.forEach(item => {
    console.log(`Chapter ${item.chapter} - ${item.bloom_level.toUpperCase()}:`);
    item.objectives.forEach(obj => console.log(`  ✓ ${obj}`));
    console.log();
  });

  console.log('This progression ensures students build knowledge progressively,');
  console.log('moving from foundational understanding to strategic creation.');
}

// ============================================================================
// EXAMPLE 4: Exercise Types & Difficulty Progression
// ============================================================================

async function example4_exerciseProgression() {
  console.log('\n' + '='.repeat(80));
  console.log('SKILL 3: DESIGN - Exercise Progression');
  console.log('='.repeat(80) + '\n');

  const exercises = [
    {
      chapter: 1,
      difficulty: 'beginner',
      title: 'AI Capability Mapping',
      time: 30,
      description: 'Identify a professional task and map AI capabilities that could assist'
    },
    {
      chapter: 3,
      difficulty: 'intermediate',
      title: 'Prompt Iteration Exercise',
      time: 45,
      description: 'Improve a poorly-written prompt through 5 iterative rounds'
    },
    {
      chapter: 5,
      difficulty: 'intermediate',
      title: 'AI-Assisted Analysis Project',
      time: 120,
      description: 'Use AI to analyze real data and generate insights'
    },
    {
      chapter: 8,
      difficulty: 'advanced',
      title: '90-Day AI Mastery Plan',
      time: 120,
      description: 'Create a comprehensive personal AI learning and implementation strategy'
    }
  ];

  console.log('🎯 EXERCISE PROGRESSION BY DIFFICULTY:');
  console.log('━'.repeat(80));
  console.log('\nExercises scale in complexity as students progress:\n');

  const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
  difficultyLevels.forEach(level => {
    const levelExercises = exercises.filter(e => e.difficulty === level);
    console.log(`${level.toUpperCase()} (${levelExercises.length} exercises):`);
    levelExercises.forEach(ex => {
      console.log(`  • Chapter ${ex.chapter}: ${ex.title} (${ex.time} min)`);
      console.log(`    └─ ${ex.description}`);
    });
    console.log();
  });

  console.log('Total exercises: ' + exercises.length);
  console.log('Total time: ' + exercises.reduce((acc, e) => acc + e.time, 0) + ' minutes');
}

// ============================================================================
// EXAMPLE 5: Gate 1 Readiness Assessment
// ============================================================================

async function example5_gate1Readiness() {
  console.log('\n' + '='.repeat(80));
  console.log('SKILL 3: DESIGN - Gate 1 Readiness Assessment');
  console.log('='.repeat(80) + '\n');

  const gate1Assessment = {
    promise_clear: true,
    outline_complete: true,
    learning_objectives_viable: true,
    exercises_aligned: true,
    audience_fit: true,
    timeline_feasible: true,
    overall_ready: true,
    coherence_score: 9.2,
    notes: 'Design is comprehensive and ready for editorial review. 8 chapters with 16 learning objectives and 14 exercises.',
    gate1_scheduled: '2026-11-23',
    estimated_review_time: '4-6 hours',
    criteria: {
      '✓ Promise clarity': 'Refined promise is specific, measurable, and action-oriented',
      '✓ Outline completeness': '8 comprehensive chapters with clear structure',
      '✓ Learning viability': '16 SMART learning objectives distributed across chapters',
      '✓ Exercise alignment': '14 practical exercises aligned with learning objectives',
      '✓ Audience fit': 'Content tailored for working professionals 30-55, non-technical',
      '✓ Timeline feasibility': 'Estimated 40,000 words over 8 chapters, achievable timeline'
    }
  };

  console.log('✅ GATE 1 READINESS ASSESSMENT:');
  console.log('━'.repeat(80));
  console.log(`\nOVERALL STATUS: ${gate1Assessment.overall_ready ? '✅ READY' : '⚠️ NEEDS WORK'}`);
  console.log(`Coherence Score: ${gate1Assessment.coherence_score}/10`);
  console.log(`Gate 1 Scheduled: ${gate1Assessment.gate1_scheduled}`);
  console.log(`Estimated Review: ${gate1Assessment.estimated_review_time}\n`);

  console.log('GATE 1 CRITERIA:');
  Object.entries(gate1Assessment.criteria).forEach(([criterion, detail]) => {
    console.log(`${criterion}`);
    console.log(`  └─ ${detail}`);
  });

  console.log(`\nNOTES:\n${gate1Assessment.notes}`);
  console.log(`\nNext Steps if Approved:`);
  console.log(`  → Begin Skill 4 (Sample Content) in Fase 3`);
  console.log(`  → Create chapter samples for quality assessment`);
  console.log(`  → Refine based on editorial feedback`);
}

// ============================================================================
// EXAMPLE 6: Coherence Analysis
// ============================================================================

async function example6_coherenceAnalysis() {
  console.log('\n' + '='.repeat(80));
  console.log('SKILL 3: DESIGN - Coherence Analysis');
  console.log('='.repeat(80) + '\n');

  const coherenceAnalysis = {
    topic_coverage: [
      '✓ AI fundamentals (Chapter 1)',
      '✓ Tool evaluation (Chapter 2)',
      '✓ Practical skills (Chapters 3-6)',
      '✓ Ethical considerations (Chapter 7)',
      '✓ Future preparation (Chapter 8)'
    ],
    knowledge_progression: 'Progressive: Conceptual → Applied → Strategic',
    skill_development_arc: 'Progressive mastery arc: Ch1: Level 2 (Understand) → Ch2: Level 3 (Apply) → Ch3: Level 4 (Analyze) → Ch4: Level 4 → Ch5: Level 5 (Evaluate) → Ch6: Level 5 → Ch7: Level 5 → Ch8: Level 6 (Create)',
    identified_gaps: [],
    coherence_score: 9.2,
    narrative_flow_quality: 'Strong - Each chapter builds on previous knowledge',
    alignment_with_promise: 'Perfect - All chapters directly serve the refined promise',
    recommendations: [
      'Consider cross-chapter project connecting multiple topics',
      'Add glossary for technical terms (distributed throughout)',
      'Include real-world examples from different industries'
    ]
  };

  console.log('🔍 COHERENCE ANALYSIS:');
  console.log('━'.repeat(80));
  console.log(`\nCoherence Score: ${coherenceAnalysis.coherence_score}/10`);
  console.log(`Knowledge Progression: ${coherenceAnalysis.knowledge_progression}`);
  console.log(`Narrative Flow Quality: ${coherenceAnalysis.narrative_flow_quality}`);
  console.log(`Alignment with Promise: ${coherenceAnalysis.alignment_with_promise}\n`);

  console.log('TOPIC COVERAGE:');
  coherenceAnalysis.topic_coverage.forEach(topic => console.log(`  ${topic}`));

  console.log('\nSKILL DEVELOPMENT ARC:');
  console.log(`  ${coherenceAnalysis.skill_development_arc}\n`);

  console.log('RECOMMENDATIONS:');
  coherenceAnalysis.recommendations.forEach(rec => console.log(`  • ${rec}`));

  console.log('\nIDENTIFIED GAPS:');
  if (coherenceAnalysis.identified_gaps.length === 0) {
    console.log('  ✓ No significant gaps identified');
  } else {
    coherenceAnalysis.identified_gaps.forEach(gap => console.log(`  ⚠️  ${gap}`));
  }
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
  try {
    await example1_completeDesignWorkflow();
    await example2_chapterOutlineStructure();
    await example3_learningObjectives();
    await example4_exerciseProgression();
    await example5_gate1Readiness();
    await example6_coherenceAnalysis();

    console.log('\n' + '='.repeat(80));
    console.log('✅ All Skill 3 examples completed successfully');
    console.log('='.repeat(80) + '\n');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export for testing
export {
  example1_completeDesignWorkflow,
  example2_chapterOutlineStructure,
  example3_learningObjectives,
  example4_exerciseProgression,
  example5_gate1Readiness,
  example6_coherenceAnalysis,
  runAllExamples
};

// Run if this is the main module
if (require.main === module) {
  runAllExamples();
}
