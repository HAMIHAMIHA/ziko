const app = getApp();
const _routes = app.routes;

Page({
  data: {
    address: [
      {id: 1},
      {id: 2}
    ],
    _routes: _routes
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () { }
})