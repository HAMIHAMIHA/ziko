const app = getApp();

Page({
  onShow: function () {
    let self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.addresses
    })

    // Set page translation
    self.setData({
      _t: {
        fapiao: i18n.fapiao,
        save: i18n.save,
      }
    })
  }
})