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
}