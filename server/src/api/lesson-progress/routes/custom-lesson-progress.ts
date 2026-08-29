export default {
  routes: [
    {
      method: "POST",
      path: "/lesson-progresses/:lessonDocumentId/complete",
      handler: "lesson-progress.complete",
      config: {
        auth: {},
      },
    },
  ],
};