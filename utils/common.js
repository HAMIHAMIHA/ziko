// Move to cursor to next input
export const changeFocus = function(page, e) {
  page.setData({
    _focus: e.currentTarget.dataset.next_item
  })
}

// Go back to previous page or what should be previous page
export const navigateBack = function(back_route, switchTab = false) {
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
}

// Loading module wrapper
export const showLoading = function(show) {
  if (show) {
    wx.showLoading({
      title: getApp().globalData.i18n.loading,
    })
  } else {
    wx.hideLoading({});
  }
}

// Toast module wrapper
export const showToast = function(message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 3000,
  })
}