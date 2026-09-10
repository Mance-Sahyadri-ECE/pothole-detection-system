import { checkDatabaseConnection, getDbPool } from '../config/database';
import { config } from '../config/env';

async function testConnection() {
  console.log('--- Database Configuration Verification ---');
  
  const hasDbUrl = Boolean(config.databaseUrl && config.databaseUrl.trim().length > 0);
  console.log(`DATABASE_URL loaded: ${hasDbUrl ? 'YES (non-empty)' : 'NO (missing or empty)'}`);

  if (!hasDbUrl) {
    console.log('Error: DATABASE_URL is not set or could not be loaded from backend/.env');
    process.exit(1);
  }

  // Parse URL safely without logging credentials
  try {
    const parsed = new URL(config.databaseUrl);
    console.log(`Protocol: ${parsed.protocol}`);
    console.log(`Host: ${parsed.hostname}`);
    console.log(`Port: ${parsed.port || '5432 (default)'}`);
    console.log(`Database: ${parsed.pathname.replace('/', '')}`);
    console.log(`Username: ${parsed.username ? parsed.username : 'not provided'}`);
    console.log(`Password: ${parsed.password ? '****** (provided)' : 'not provided'}`);
  } catch (err: any) {
    console.log('Note: DATABASE_URL is not a standard URI or could not be parsed by URL parser.');
  }

  console.log('\n--- Testing PostgreSQL / Supabase Connection ---');
  const result = await checkDatabaseConnection();

  if (result.connected) {
    console.log('Connection Status: SUCCESS');
    console.log(`Details: ${result.message}`);
    
    // Fetch database server version
    try {
      const pool = getDbPool();
      const versionRes = await pool.query('SELECT version()');
      console.log(`Server Version: ${versionRes.rows[0].version}`);
    } catch (e: any) {
      console.log(`Version check error: ${e.message}`);
    }

    process.exit(0);
  } else {
    console.log('Connection Status: FAILED');
    console.log(`Exact Error: ${result.message}`);
    process.exit(1);
  }
}

testConnection();
