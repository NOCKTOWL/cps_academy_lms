export default {
  routes: [
    {
     method: 'GET',
     path: '/instructor/dashboard',
     handler: 'instructor-dashboard.dashboard',
     config: {
       auth: {}
     },
    },
  ],
};
