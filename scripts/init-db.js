#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'ebook-factory.db');
const schemaPath = path.join(__dirname, '..', 'src', 'orchestrator', 'schema.sql');

console.log('🔧 Initializing Ebook Factory database...\n');

// Read schema
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  }
  console.log(`✅ Connected to database: ${dbPath}`);
});

// Execute schema
db.exec(schema, function(err) {
  if (err) {
    console.error('❌ Error executing schema:', err);
    process.exit(1);
  }
  console.log('✅ Schema executed successfully');

  // Verify tables
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
    (err, tables) => {
      if (err) {
        console.error('❌ Error verifying tables:', err);
        process.exit(1);
      }
      console.log('\n📋 Database tables created:');
      tables.forEach(t => console.log(`   - ${t.name}`));

      // Close connection
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err);
          process.exit(1);
        }
        console.log('\n✅ Database initialization complete!');
        process.exit(0);
      });
    }
  );
});
