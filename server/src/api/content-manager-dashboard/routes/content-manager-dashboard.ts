export default {
  routes: [
    {
      method: "GET",
      path: "/content-manager/dashboard",
      handler: "content-manager-dashboard.dashboard",
      config: {
        auth: {},
      },
    },
  ],
};