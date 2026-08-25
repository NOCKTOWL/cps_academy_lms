export default {
  routes: [
    {
      method: 'GET',
      path: '/courses/:documentId/progress',
      handler: 'course.progress',
      config: {
        auth: {},
      },
    },
  ],
};