const app = getApp();
const routes = app.routes;

Page({
  data: {
    address: [
      {id: 1},
      {id: 2}
    ],
    _routes: {
      address_detail: routes.address_detail
    }
  },

  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.addresses
    })

    // Set page translation
    self.setData({
      _t: {
        address: i18n.address,
        add_new_address: i18n.add_new_address,
        select: i18n.select
      }
    })

    // Get user info
    let user = app.db.get('userInfo');
    if (!user) { return; }

    // Set page Data
    self.setData({
      user: user
    })
  },
})