/**
 * SKILL 1: INTAKE
 *
 * Parses the raw brief editorial markdown file, normalizes it to JSON structure,
 * validates all required fields, and creates an artifact in the database.
 *
 * Input: BRIEF_EDITORIAL.md (markdown)
 * Output: Artifact (normalized JSON)
 * Status: Stage advances from "pending" → "in_progress" → "approved"
 *
 * Complexity: LOW
 * Time estimate: 4-6 hours implementation + testing
 */

import * as fs from 'fs';
import * as path from 'path';
import { Orchestrator } from '../orchestrator';

/**
 * Intake Skill for normalizing editorial briefs
 */
export class IntakeSkill {
  private orchestrator: Orchestrator;

  constructor(orchestrator: Orchestrator) {
    this.orchestrator = orchestrator;
  }

  /**
   * Process a brief editorial file and create normalized artifact
   */
  async process(briefPath: string, projectId: string): Promise<any> {
    // 1. Read the brief file
    const briefContent = await this.readBrief(briefPath);

    // 2. Extract JSON from brief (expects JSON block in markdown)
    const normalizedJson = await this.extractAndParseJson(briefContent);

    // 3. Validate all required fields
    const validationErrors = this.validateBrief(normalizedJson);
    if (validationErrors.length > 0) {
      throw new ValidationError('Brief validation failed', validationErrors);
    }

    // 4. Create artifact in database
    const artifact = await this.createArtifact(projectId, normalizedJson);

    // 5. Advance the intake stage
    await this.advanceStage(projectId, artifact.id);

    // 6. Return the artifact with metadata
    return {
      artifact,
      validated_fields: Object.keys(normalizedJson.book || {}),
      total_validation_passed: true,
      message: 'Brief intake completed successfully',
    };
  }

  /**
   * Read and parse the brief markdown file
   */
  private async readBrief(briefPath: string): Promise<string> {
    try {
      const content = fs.readFileSync(briefPath, 'utf-8');
      if (!content || content.length === 0) {
        throw new Error('Brief file is empty');
      }
      return content;
    } catch (error: any) {
      throw new Error(`Failed to read brief file: ${error.message}`);
    }
  }

  /**
   * Extract JSON object from markdown file
   * Looks for ```json ... ``` block and parses it
   */
  private async extractAndParseJson(content: string): Promise<any> {
    // Find JSON block in markdown
    const jsonBlockRegex = /```json\s*([\s\S]*?)```/;
    const match = content.match(jsonBlockRegex);

    if (!match || !match[1]) {
      throw new Error('No JSON block found in brief (expected ```json ... ```)');
    }

    try {
      const jsonStr = match[1].trim();
      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (error: any) {
      throw new Error(`Invalid JSON in brief file: ${error.message}`);
    }
  }

  /**
   * Validate that all required fields are present and valid
   */
  private validateBrief(briefJson: any): ValidationIssue[] {
    const errors: ValidationIssue[] = [];

    // Check top-level structure
    if (!briefJson.book) {
      errors.push({
        field: 'book',
        rule: 'required',
        message: 'Missing required "book" section',
        severity: 'error',
      });
      return errors; // Return early if book is missing
    }

    const book = briefJson.book;

    // Required string fields
    const requiredStringFields = [
      { field: 'title', minLength: 3, maxLength: 200 },
      { field: 'genre', minLength: 3, maxLength: 50 },
      { field: 'theme', minLength: 5, maxLength: 500 },
      { field: 'promise', minLength: 20, maxLength: 1000 },
      { field: 'language', minLength: 2, maxLength: 10 },
      { field: 'format', minLength: 2, maxLength: 20 },
      { field: 'reading_level', minLength: 2, maxLength: 50 },
      { field: 'content_classification', minLength: 2, maxLength: 50 },
    ];

    requiredStringFields.forEach((fieldSpec: any) => {
      const value = book[fieldSpec.field];
      if (!value) {
        errors.push({
          field: fieldSpec.field,
          rule: 'required',
          message: `Field '${fieldSpec.field}' is required`,
          severity: 'error',
        });
      } else if (typeof value !== 'string') {
        errors.push({
          field: fieldSpec.field,
          rule: 'type_string',
          message: `Field '${fieldSpec.field}' must be a string`,
          severity: 'error',
        });
      } else if (value.length < fieldSpec.minLength) {
        errors.push({
          field: fieldSpec.field,
          rule: 'min_length',
          message: `Field '${fieldSpec.field}' must be at least ${fieldSpec.minLength} characters`,
          severity: 'error',
        });
      } else if (value.length > fieldSpec.maxLength) {
        errors.push({
          field: fieldSpec.field,
          rule: 'max_length',
          message: `Field '${fieldSpec.field}' cannot exceed ${fieldSpec.maxLength} characters`,
          severity: 'error',
        });
      }
    });

    // Required numeric fields
    const requiredNumericFields = [
      { field: 'estimated_word_count', min: 5000, max: 200000 },
      { field: 'estimated_chapter_count', min: 1, max: 50 },
    ];

    requiredNumericFields.forEach((fieldSpec: any) => {
      const value = book[fieldSpec.field];
      if (value === undefined || value === null) {
        errors.push({
          field: fieldSpec.field,
          rule: 'required',
          message: `Field '${fieldSpec.field}' is required`,
          severity: 'error',
        });
      } else if (typeof value !== 'number') {
        errors.push({
          field: fieldSpec.field,
          rule: 'type_number',
          message: `Field '${fieldSpec.field}' must be a number`,
          severity: 'error',
        });
      } else if (value < fieldSpec.min) {
        errors.push({
          field: fieldSpec.field,
          rule: 'min_value',
          message: `Field '${fieldSpec.field}' must be at least ${fieldSpec.min}`,
          severity: 'error',
        });
      } else if (value > fieldSpec.max) {
        errors.push({
          field: fieldSpec.field,
          rule: 'max_value',
          message: `Field '${fieldSpec.field}' cannot exceed ${fieldSpec.max}`,
          severity: 'error',
        });
      }
    });

    // Validate target_audience structure
    if (!book.target_audience) {
      errors.push({
        field: 'target_audience',
        rule: 'required',
        message: 'Missing required "target_audience" section',
        severity: 'error',
      });
    } else {
      if (!book.target_audience.primary_description) {
        errors.push({
          field: 'target_audience.primary_description',
          rule: 'required',
          message: 'Primary audience description is required',
          severity: 'error',
        });
      } else if (book.target_audience.primary_description.length < 10) {
        errors.push({
          field: 'target_audience.primary_description',
          rule: 'min_length',
          message: 'Primary audience description must be at least 10 characters',
          severity: 'error',
        });
      }
    }

    // Validate genre against allowed values
    const allowedGenres = [
      'educational',
      'mystery',
      'romance',
      'children',
      'adult_erotism',
    ];
    if (book.genre && !allowedGenres.includes(book.genre)) {
      errors.push({
        field: 'genre',
        rule: 'enum',
        message: `Genre must be one of: ${allowedGenres.join(', ')}`,
        severity: 'error',
      });
    }

    return errors;
  }

  /**
   * Create artifact in the database
   */
  private async createArtifact(projectId: string, normalizedJson: any): Promise<any> {
    const artifact = await this.orchestrator.createArtifact(
      projectId,
      'intake',
      'normalized-brief',
      JSON.stringify(normalizedJson),
      {
        source: 'brief-editorial-md',
        normalized: true,
        fields_validated: Object.keys(normalizedJson.book || {}),
      },
      'skill-intake'
    );

    return artifact;
  }

  /**
   * Advance the intake stage after successful validation
   */
  private async advanceStage(projectId: string, artifactId: string): Promise<void> {
    await this.orchestrator.advanceStage(
      projectId,
      'intake',
      'approved',
      'skill-intake',
      `Intake skill processed brief and created artifact ${artifactId}`
    );
  }
}

/**
 * Custom error for validation failures
 */
export class ValidationError extends Error {
  public errors: ValidationIssue[];

  constructor(message: string, errors: ValidationIssue[]) {
    super(message);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

/**
 * Validation issue representation
 */
export interface ValidationIssue {
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Validation result summary
 */
export interface ValidationResult {
  is_valid: boolean;
  total_checks: number;
  passed: number;
  failed: number;
  warnings: number;
  errors: ValidationIssue[];
  warnings_list: ValidationIssue[];
}
