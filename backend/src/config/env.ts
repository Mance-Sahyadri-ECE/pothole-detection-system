import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory or fallback to root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();


export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  corsOrigin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000',
  jwtSecret: process.env.JWT_SECRET || 'dev-pothole-secret-key-change-in-production',
  maxUploadSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  robotApiKey: process.env.ROBOT_API_KEY || '',
  isProduction: process.env.NODE_ENV === 'production',
};

