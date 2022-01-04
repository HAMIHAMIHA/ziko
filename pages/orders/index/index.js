const app = getApp();

Page({
  data: {
    _routes: {
      order: app.routes.order
    },
  },
  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    app.setTabbar();

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.my_orders
    })

    // Set page translation
    self.setData({
      _t: {
        cny: i18n.cny,
        community: i18n.community,
        item_label: i18n.item_label,
        items_label: i18n.items_label,
        login: i18n.login,
        lottery_gift: i18n.lottery_gift,
        need_login: i18n.need_login,
        order_status: i18n.order_status,
      }
    })

    // Get user info
    let user = app.db.get('userInfo');
    if (!user) {
      self.setData({
        need_login: true
      })
      return;
    }
  },

  onTabItemTap: function(e) {
    // TODO get user profile
  }
})