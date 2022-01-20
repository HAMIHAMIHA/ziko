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
      console.log(res);
      self.setData({
        fapiao: res.fapiaoInformation,
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

    console.log(data);

    updateUserInfo(data, app.routes.account, true);
  }
})