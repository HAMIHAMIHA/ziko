const app = getApp();

module.exports = {
  changeFocus: (page, e) => {
    page.setData({
      _focus: e.currentTarget.dataset.nextItem
    })
  },

  navigateBack: (back_route, switchTab = false) => {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      if (switchTab) {
        wx.switchTab({
          url: back_route
        })
      } else {
        wx.redirectTo({
          url: back_route
        })
      }
    }
  },

  showLoading: (show) => {
    if (show) {
      wx.showLoading({
        title: app.globalData.i18n.loading,
      })
    } else {
      wx.hideLoading({});
    }
  },

  updateUserInfo: (new_info, back_url) => {
    const self = this;

    const callback = {
      success: res => {
        let userInfo = app.db.get('userInfo');
        userInfo.user = res;
        app.db.set('userInfo', userInfo);

        if (back_url) {
          self.navigateBack(back_url);
        }
      }
    }

    app.api.updateProfile(new_info, callback);
  }
}