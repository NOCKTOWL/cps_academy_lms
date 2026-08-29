export default {
  routes: [
    {
     method: 'GET',
     path: '/student/dashboard',
     handler: 'student-dashboard.dashboard',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
