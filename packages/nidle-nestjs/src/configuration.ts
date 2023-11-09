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

export const oauthConfig = registerAs('oauthConfig', () => ({
  gitlab: {
    baseUrl: process.env.OAUTH_GITLAB_BASEURL,
    redirectUri: process.env.OAUTH_GITLAB_REDIRECT_URI,
    clientId: process.env.OAUTH_GITLAB_CLIENT_ID,
    clientSecret: process.env.OAUTH_GITLAB_CLIENT_SECRET,
    scope: process.env.OAUTH_GITLAB_SCOPE,
    privateToken: process.env.GITLAB_PRIVATE_TOKEN,
  },
  redirectBack: {
    success: process.env.FE_SUCCESS_CALLBACK,
    failed: process.env.FE_FAILED_CALLBACK,
  },
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

export const queueConfig = registerAs('queueConfig', () => ({
  changelog: {
    max: process.env.QUEUE_CHANGELOG_MAX,
    duration: process.env.QUEUE_CHANGELOG_DURATION,
    lockDuration: process.env.QUEUE_CHANGELOG_LOCK_DURATION,
    stalledInterval: process.env.QUEUE_CHANGELOG_STALLED_INTERVAL,
    concurrency: process.env.QUEUE_CHANGELOG_CONCURRENCY,
  },
}));

export default [dbConfig, redisConfig, oauthConfig, nidleConfig, queueConfig];
