export default {
  routes: [
    {
     method: 'GET',
     path: '/admin/dashboard',
     handler: 'admin-dashboard.dashboard',
     config: {
       auth: {}
     },
    },
    {
     method: 'GET',
     path: '/admin/dashboard/users',
     handler: 'admin-dashboard.users',
     config: {
       auth: {}
     }
    },
    {
     method: 'PUT',
     path: '/admin/dashboard/users/:id/role',
     handler: 'admin-dashboard.changeRole',
     config: {
       auth: {}
     }
    }
  ],
};
