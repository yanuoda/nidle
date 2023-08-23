export default {
  defaultPageSize: 10,
  environments: [
    {
      value: 'development',
      label: '测试',
    },
    {
      value: 'pre',
      label: '预发布',
    },
    {
      value: 'production',
      label: '生产',
    },
  ],
  queueConcurrency: Number(process.env.QUEUE_CHANGELOG_MAX),
};
