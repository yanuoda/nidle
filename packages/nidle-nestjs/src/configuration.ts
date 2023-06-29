import { registerAs } from '@nestjs/config';

/**
 * DB_HOST|DB_PORT|DB_USER|DB_PASS|DB_BASE
 */
export const dbConfig = registerAs('dbConfig', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  database: process.env.DB_BASE,
}));

export default [dbConfig];
