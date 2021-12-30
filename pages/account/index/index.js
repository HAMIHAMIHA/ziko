const app = getApp();

Page({
  onShow: function () {
    const self = this;

    app.setTabbar();

    self.setData({
      _routes: {
        account_info: app.routes.account_info,
        fapiao: app.routes.fapiao,
        address: app.routes.address,
        orders: app.routes.orders
      }
    })
  }
})