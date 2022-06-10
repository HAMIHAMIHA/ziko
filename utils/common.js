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

// Image previewer wrapper
export const previewImage = function(urls, show_menu) {
  wx.previewImage({
    urls: urls,
    current: 'current',
    showmenu: show_menu,
    complete: (res) => {},
  })
}

// Set tabbar wraper
export const setTabbar = function(index, tab_text) {
  wx.setTabBarItem({
    index,
    text: tab_text
  })
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