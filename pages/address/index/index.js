const app = getApp();
const routes = app.routes;

Page({
  data: {
    address: [
      {id: 1},
      {id: 2}
    ],
    routes: routes
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () { }
})