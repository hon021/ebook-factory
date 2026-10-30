/**
 * Orchestrator Initialization
 *
 * Sets up the database and initializes the orchestrator system.
 */

import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import Orchestrator from './orchestrator';
import { initializeStages } from './stages';

/**
 * Initialize the orchestrator system
 */
export async function initializeOrchestrator(dbPath: string): Promise<Orchestrator> {
  const db = new sqlite3.Database(dbPath);

  // Promisify database methods
  const dbAsync = {
    run: (sql: string, params: any[] = []) =>
      new Promise<any>((resolve, reject) =>
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve(this);
        })
      ),
    get: (sql: string, params: any[] = []) =>
      new Promise<any>((resolve, reject) =>
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        })
      ),
    all: (sql: string, params: any[] = []) =>
      new Promise<any[]>((resolve, reject) =>
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        })
      ),
  };

  try {
    // Read and execute schema
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Execute schema (split by semicolon)
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await dbAsync.run(statement);
    }

    console.log('✓ Database schema initialized');

    // Initialize stages
    await initializeStages(dbAsync);
    console.log('✓ Stages initialized');

    // Create orchestrator instance
    const orchestrator = new Orchestrator(dbAsync);
    console.log('✓ Orchestrator ready');

    return orchestrator;
  } catch (error) {
    console.error('Failed to initialize orchestrator:', error);
    throw error;
  }
}

/**
 * Health check: verify all core tables exist
 */
export async function healthCheck(db: any): Promise<boolean> {
  const requiredTables = [
    'projects',
    'stages',
    'project_stage_status',
    'artifacts',
    'gates',
    'validations',
    'change_log',
    'stage_dependencies',
  ];

  for (const table of requiredTables) {
    const result = await db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      [table]
    );
    if (!result) {
      console.error(`✗ Missing table: ${table}`);
      return false;
    }
  }

  console.log('✓ All required tables present');
  return true;
}

export default initializeOrchestrator;
