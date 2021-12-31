const app = getApp();

Page({
  onShow: function () {
    const self = this;
    app.setTabbar();
    let user = app.db.get('userInfo');
    if (!user) {
      self.setData({
        need_login: true
      })
      return;
    }

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