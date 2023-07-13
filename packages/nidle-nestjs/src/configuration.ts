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

export const redisConfig = registerAs('redisConfig', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  pass: process.env.REDIS_PASSWORD,
  dbIndex: process.env.REDIS_DB_INDEX,
}));

export const nidleConfig = registerAs('nidleConfig', () => ({
  output: {
    backup: {
      path: process.env.NIDLE_DIR + '/nidle-output/backup/',
    },
    path: process.env.NIDLE_DIR + '/nidle-output/output/',
  },
  source: process.env.NIDLE_DIR + '/nidle-output/source/',
  log: {
    path: process.env.NIDLE_DIR + '/nidle-output/logs/',
  },
  config: {
    path: process.env.NIDLE_DIR + '/nidle-output/config/',
  },
  afterManagerWaitSecs: process.env.AFTER_MANAGER_WAIT_SECS,
}));

export default [dbConfig, redisConfig, nidleConfig];
