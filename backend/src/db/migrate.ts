import fs from 'fs';
import path from 'path';
import { getDbPool } from '../config/database';
import { config } from '../config/env';

async function runMigration() {
  console.log('--- Starting Pothole Detection System DB Migration ---');
  if (!config.databaseUrl) {
    console.error('Error: DATABASE_URL is not defined in environment.');
    process.exit(1);
  }

  const pool = getDbPool();
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL successfully.');
    console.log('Executing schema.sql DDL statements...');
    await client.query(sql);
    client.release();
    console.log('✓ Migration completed successfully: all tables, indexes, and triggers created.');
    process.exit(0);
  } catch (error: any) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigration();
}

export default runMigration;
