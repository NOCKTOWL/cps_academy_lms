export default {
  routes: [
    {
      method: 'GET',
      path: '/courses/my-courses',
      handler: 'course.myCourses',
      config: {
        auth: {},
      },
    },
    {
      method: 'GET',
      path: '/courses/student-courses',
      handler: 'course.studentCourses',
      config: {
        auth: {},
      },
    },
    {
      method: 'GET',
      path: '/courses/:documentId/progress',
      handler: 'course.progress',
      config: {
        auth: {},
      },
    }
  ],
};