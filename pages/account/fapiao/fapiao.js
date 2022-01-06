const { navigateBack } = require("../../../utils/common");

const app = getApp();

Page({
  onShow: function () {
    let self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.fapiao
    })

    // TODO get user info
    let user = app.db.get('userInfo').user; // TEMP

    // Set page translation
    self.setData({
      _t: {
        fapiao: i18n.fapiao,
        save: i18n.save,
      },
      fapiao: user.fapiao
    })
  },

  // Save data
  saveInformation: function(e) {
    const self = this;
    let data = {
      fapiao: self.data.fapiao
    }

    const callback = {
      success: res => {
        // TEMP
        let user = app.db.get('userInfo').user;
        user.fapiao = data.fapiao;

        app.db.set('userInfo', {user: user})

        // TODO update storage
        navigateBack(app.routes.account, true);
      }
    }

    callback.success('');
    // TODO api
  }
})