const app = getApp();

Page({
  onShow: function () {
    const self = this;
    app.setTabbar();
    self.setData({
      _routes: {
        order: app.routes.order
      }
    })
  },

  onTabItemTap: function(e) {
    // TODO get user profile
  }
})