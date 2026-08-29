export default {
  routes: [
    {
     method: 'GET',
     path: '/auth-user',
     handler: 'auth-user.me',
     config: {
       auth:{}
     },
    },
  ],
};
