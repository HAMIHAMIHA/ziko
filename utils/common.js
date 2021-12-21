const app = getApp();

module.exports = {
  showLoading: (show) => {
    if (show) {
      wx.showLoading({
        title: app.globalData.i18n.loading,
      })
    } else {
      wx.hideLoading({});
    }
  }
}