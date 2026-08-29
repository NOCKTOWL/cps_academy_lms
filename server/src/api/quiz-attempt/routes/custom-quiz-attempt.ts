export default {
  routes: [
    {
      method: "GET",
      path: "/quiz-attempts/my-results",
      handler: "quiz-attempt.myResults",
      config: {
        auth: {},
      },
    },

    {
      method: "POST",
      path: "/quiz-attempts/submit",
      handler: "quiz-attempt.submit",
      config: {
        auth: {},
      },
    },
  ],
};