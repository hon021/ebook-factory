/**
 * Editorial Pipeline: Stage Definitions
 *
 * Defines the standard editorial stages for the Ebook Factory.
 * Each stage can be activated/customized per genre profile.
 */

export interface StageConfig {
  id: string;
  name: string;
  ordinal: number;
  description: string;
  requires_human_gate: boolean;
  skill_implementation: string;
}

/**
 * Core editorial pipeline stages
 * These apply to all books regardless of genre
 */
export const CORE_STAGES: StageConfig[] = [
  {
    id: 'intake',
    name: 'Intake & Normalization',
    ordinal: 1,
    description: 'Receive and normalize project brief. Validate required fields, identify gaps.',
    requires_human_gate: false,
    skill_implementation: 'intake-skill',
  },
  {
    id: 'research',
    name: 'Research (Genre-specific)',
    ordinal: 2,
    description:
      'Non-fiction: Compile source dossier. Fiction: Research setting/context if needed. Separate facts from interpretation.',
    requires_human_gate: false,
    skill_implementation: 'research-skill',
  },
  {
    id: 'design',
    name: 'Editorial Design',
    ordinal: 3,
    description:
      'Define structure, outline, learning objectives (ed), premise/characters (fiction). Gate 1: design approval.',
    requires_human_gate: true,
    skill_implementation: 'design-skill',
  },
  {
    id: 'sample',
    name: 'Sample Chapter/Scene',
    ordinal: 4,
    description:
      'Write one chapter/section to test design, tone, and genre QA. Includes checklist review.',
    requires_human_gate: false,
    skill_implementation: 'sample-skill',
  },
  {
    id: 'manuscript',
    name: 'Full Manuscript',
    ordinal: 5,
    description:
      'Complete manuscript production. Maintain consistency with design. Include source refs (non-fiction) and change tracking.',
    requires_human_gate: false,
    skill_implementation: 'manuscript-skill',
  },
  {
    id: 'editing',
    name: 'Editorial Review',
    ordinal: 6,
    description:
      'Substantive and line editing. Correct grammar, style, consistency. Localization per language variant. Track all changes.',
    requires_human_gate: false,
    skill_implementation: 'editing-skill',
  },
  {
    id: 'qa',
    name: 'QA & Final Review',
    ordinal: 7,
    description:
      'Genre-specific QA. Identify defects by severity. Propose fixes. Gate 2: final approval before production.',
    requires_human_gate: true,
    skill_implementation: 'qa-skill',
  },
  {
    id: 'production',
    name: 'Production',
    ordinal: 8,
    description: 'Format conversion (EPUB/PDF), metadata, cover integration. Deliver production package.',
    requires_human_gate: false,
    skill_implementation: 'production-skill',
  },
];

/**
 * Genre-specific QA profiles
 * Each profile defines specialized artifacts and validation rules
 */
export const GENRE_PROFILES = {
  educational: {
    name: 'Educational / Non-Fiction',
    qa_checklist: [
      'All factual claims are verifiable and traced to sources',
      'Learning objectives are clear and measurable',
      'Examples are concrete and replicable',
      'Exercises have solutions or success criteria',
      'Exercises match stated learning objectives',
      'Language is accessible to target audience',
      'No false or misleading claims',
      'Disclaimers present where needed',
      'Terminology is consistent',
      'Index/reference section is complete',
    ],
    specialized_artifacts: [
      'source_dossier', // Research sources with URLs and dates
      'learning_objectives', // Explicit outcomes
      'exercise_solutions', // Tested exercises
      'terminology_glossary', // Consistent terminology
    ],
  },

  mystery: {
    name: 'Mystery / Crime Fiction',
    qa_checklist: [
      'All clues are planted before revelation',
      'Clue list is comprehensive and tracked',
      'Suspect list is complete and motivated',
      'Timeline is consistent throughout',
      'Solution is logical and fair to reader',
      'No contradictory plot elements',
      'Character motivations are clear',
      'Pacing maintains suspense',
      'Red herrings are intentional and fair',
      'Ending is satisfying and prepared',
    ],
    specialized_artifacts: [
      'clue_register', // List of all clues with chapter/location
      'suspect_profiles', // Character motivations and timelines
      'timeline_map', // Chronology of events
      'solution_validation', // Solution must be logically sound
    ],
  },

  romance: {
    name: 'Romance',
    qa_checklist: [
      'Emotional arc is clear and consistent',
      'Character development is organic',
      'Relationship progression feels authentic',
      'Dialogue reflects character voice',
      'Conflict is meaningful and resolved',
      'Intimacy level matches subgenre expectations',
      'Consent and agency are clear throughout',
      'Supporting cast adds depth',
      'Ending delivers on emotional promise',
      'No unresolved subplots',
    ],
    specialized_artifacts: ['emotional_beats', 'relationship_arc', 'character_development_log'],
  },

  children: {
    name: 'Children\'s Stories',
    qa_checklist: [
      'Vocabulary is age-appropriate',
      'Concepts are understandable for target age',
      'Story structure matches attention span',
      'Themes are suitable and positive',
      'No unnecessarily frightening content',
      'Illustrations/descriptions support understanding',
      'Moral/lesson is not preachy',
      'Diverse representation is respectful',
      'Length is appropriate for target age',
      'Adult review confirms suitability',
    ],
    specialized_artifacts: ['age_appropriateness_review', 'vocabulary_analysis', 'sensitivity_review'],
  },

  adult_erotism: {
    name: 'Adult Eroticism',
    qa_checklist: [
      'Content is clearly for adults only',
      'All characters are adults (age verified)',
      'Consent is clear and consistent',
      'No non-consensual elements',
      'No illegal activities or minors',
      'Warning tags match content',
      'Plot/character development exists beyond explicit content',
      'Platform requirements are met',
      'Legal requirements verified',
      'Localization requirements met',
    ],
    specialized_artifacts: ['adult_verification', 'content_tags', 'legal_compliance_check', 'platform_requirements'],
  },
};

/**
 * Validation rules by stage
 */
export const STAGE_VALIDATION_RULES = {
  intake: {
    required_fields: ['title', 'genre', 'theme', 'target_audience', 'reading_level'],
    validations: [
      { field: 'title', rule: 'not_empty', message: 'Project title required' },
      { field: 'title', rule: 'max_length:200', message: 'Title must be ≤ 200 chars' },
      { field: 'genre', rule: 'enum', values: ['educational', 'mystery', 'romance', 'children', 'adult_erotism'] },
      { field: 'target_audience', rule: 'min_length:50', message: 'Describe audience (≥50 chars)' },
      { field: 'language', rule: 'enum', values: ['es-MX', 'en-US', 'fr-FR'] },
    ],
  },

  design: {
    required_fields: ['title', 'promise', 'outline', 'objectives'],
    validations: [
      { field: 'promise', rule: 'not_empty', message: 'Reader promise required' },
      { field: 'promise', rule: 'min_length:50', message: 'Promise must be ≥50 chars' },
      { field: 'outline', rule: 'min_chapters:5', message: 'Outline should have ≥5 chapters' },
      { field: 'outline', rule: 'max_chapters:20', message: 'Outline should have ≤20 chapters' },
    ],
  },

  sample: {
    required_fields: ['chapter_content', 'genre_checklist', 'word_count'],
    validations: [
      { field: 'word_count', rule: 'min_words:1000', message: 'Sample should be ≥1000 words' },
      { field: 'genre_checklist', rule: 'all_reviewed', message: 'Genre QA checklist incomplete' },
    ],
  },

  manuscript: {
    required_fields: ['full_text', 'source_references', 'change_log'],
    validations: [
      { field: 'word_count', rule: 'in_range:40000:80000', message: 'Book should be 40K-80K words' },
    ],
  },

  editing: {
    required_fields: ['edited_text', 'change_tracking', 'language_variant'],
    validations: [
      { field: 'language_variant', rule: 'enum', values: ['es-MX', 'en-US'] },
    ],
  },

  qa: {
    required_fields: ['qa_report', 'defect_list', 'corrections'],
    validations: [
      {
        field: 'qa_report',
        rule: 'no_critical_defects',
        message: 'No critical defects allowed for approval',
      },
    ],
  },

  production: {
    required_fields: ['formatted_file', 'metadata', 'cover_image'],
    validations: [
      { field: 'formatted_file', rule: 'valid_epub_or_pdf', message: 'Valid EPUB or PDF required' },
    ],
  },
};

/**
 * Gate definitions and approval criteria
 */
export const GATES = {
  design_gate: {
    number: 1,
    stage: 'design',
    name: 'Editorial Design Approval',
    description: 'Review and approve book structure, outline, and editorial approach',
    required_artifacts: ['outline', 'promise', 'objectives'],
    approval_criteria: [
      'Title and promise are clear and specific',
      'Outline is complete and logical',
      'Approach matches genre profile',
      'Audience fit is validated',
      'Scope is realistic and bounded',
    ],
  },

  qa_gate: {
    number: 2,
    stage: 'qa',
    name: 'QA & Final Approval',
    description: 'Verify quality, resolve defects, approve for production',
    required_artifacts: ['qa_report', 'corrected_manuscript', 'defect_summary'],
    approval_criteria: [
      'No critical defects remain',
      'All high-severity issues resolved',
      'Genre QA checklist passed',
      'Language/localization verified',
      'Ready for production',
    ],
  },
};

/**
 * Initialize stages in database
 */
export async function initializeStages(db: any): Promise<void> {
  for (const stage of CORE_STAGES) {
    await db.run(
      `INSERT OR IGNORE INTO stages (id, name, ordinal, description, requires_human_gate, skill_implementation)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [stage.id, stage.name, stage.ordinal, stage.description, stage.requires_human_gate ? 1 : 0, stage.skill_implementation]
    );
  }

  // Set up stage dependencies
  const dependencies = [
    ['research', 'intake'],
    ['design', 'research'],
    ['sample', 'design'],
    ['manuscript', 'design'],
    ['editing', 'manuscript'],
    ['qa', 'editing'],
    ['production', 'qa'],
  ];

  for (const [stageId, dependsOn] of dependencies) {
    await db.run(
      `INSERT OR IGNORE INTO stage_dependencies (id, stage_id, depends_on_stage_id)
       VALUES (?, ?, ?)`,
      [`dep-${stageId}-${dependsOn}`, stageId, dependsOn]
    );
  }
}

export default {
  CORE_STAGES,
  GENRE_PROFILES,
  STAGE_VALIDATION_RULES,
  GATES,
  initializeStages,
};
