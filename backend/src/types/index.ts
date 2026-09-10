export * from './database.types';

export interface HealthResponse {
  status: string;
  service: string;
  database?: {
    connected: boolean;
    message: string;
  };
}
