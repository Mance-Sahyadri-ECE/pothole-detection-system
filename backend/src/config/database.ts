import { Pool, QueryResult, QueryResultRow } from 'pg';
import { config } from './env';

let pool: Pool | null = null;

export const getDbPool = (): Pool => {
  if (!pool) {
    if (!config.databaseUrl) {
      console.warn('[Database] DATABASE_URL is not set. Database queries will not execute.');
    }
    const isRemoteDb = config.databaseUrl.includes('supabase.com') || config.databaseUrl.includes('pooler.supabase.com') || !config.databaseUrl.includes('localhost');
    const useSsl = config.isProduction || isRemoteDb;

    pool = new Pool({
      connectionString: config.databaseUrl || undefined,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('[Database Pool Error]:', err.message);
    });
  }
  return pool;
};

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const currentPool = getDbPool();
  return currentPool.query<T>(text, params);
};

export const checkDatabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  if (!config.databaseUrl) {
    return { connected: false, message: 'DATABASE_URL not configured' };
  }
  try {
    const currentPool = getDbPool();
    const res = await currentPool.query('SELECT NOW()');
    return { connected: true, message: `Connected at ${res.rows[0].now}` };
  } catch (error: any) {
    return { connected: false, message: error.message };
  }
};
