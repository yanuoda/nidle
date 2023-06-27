import { registerAs } from '@nestjs/config';

/**
 * DB_HOST|DB_PORT|DB_USER|DB_PASS
 */
export const database = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
}));

export default [database];
