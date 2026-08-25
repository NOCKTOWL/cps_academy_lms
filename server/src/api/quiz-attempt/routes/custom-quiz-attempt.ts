export default {
  routes: [
    {
      method: 'GET',
      path: '/quiz-attempts/my-results',
      handler: 'quiz-attempt.myResults',
      config: {
        auth: {},
      },
    },
  ],
};