const { navigateBack, refreshUserInfo, updateUserInfo, showLoading } = require("../../../utils/common");

const app = getApp();

Page({
  onShow: function () {
    let self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.fapiao
    })

    refreshUserInfo(null, res =>{
      self.setData({
        fapiao: res.fapiaoInformation ? res.fapiaoInformation : '',
      })
    });

    // Set page translation
    self.setData({
      _t: {
        fapiao: i18n.fapiao,
        save: i18n.save,
      }
    })
  },

  // Save data
  saveInformation: function(e) {
    const self = this;

    showLoading(true);
    let data = {
      fapiaoInformation: self.data.fapiao
    }

    let prev = app.routes.account;
    let switch_tab = true;
    if (self.options.action == 'edit') {
      let pages = getCurrentPages();
      let cart_pg = pages[pages.length - 2];
      cart_pg.options.back = true;
      prev = app.routes.cart;
      switch_tab = false;
    }

    updateUserInfo(data, prev, switch_tab);
  }
})