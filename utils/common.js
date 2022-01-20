const db = require('./db.config.js'); // 本地存储
const i18n = require('./internationalize/translate.js'); // 翻译功能

// Move to cursor to next input
export const changeFocus = function(page, e) {
  page.setData({
    _focus: e.currentTarget.dataset.next_item
  })
}

// Check user session and set user to page data
export const getUserInfo = function(page) {
  let user = db.get('userInfo');
  // Check if token session still valid
  let current_session = user.expireAt ? new Date(user.expireAt) : 0;
  if (!current_session || current_session <= new Date()) {
    console.debug('token session ended');
    user.customer = { openId: user.customer.openId };
    db.set('userInfo', user);

    page.setData({
      user: user.customer
    })
  } else {
    refreshUserInfo(page, null);
  }
}

// General method to call api and login with wechat mobile number
export const mobileLogin = function(page, code, loginCallback) {
  const callback = {
    success: function(res) {
      db.set('userInfo', res);
      page.setData({ user: res.customer })
      loginCallback ? loginCallback() : '';
    }
  }

  const data = {
    code: code,
    name: db.get('userInfo').customer.name ? db.get('userInfo').customer.name : db.get('userInfo').wxUser.name,
    openId: db.get('userInfo').customer.openId
  }

  getApp().api.wxLogin(data, callback);
}

// Get user info from database
export const refreshUserInfo = function(page, callback) {
  const getProfileCallback = {
    success: function(res) {
      let user = db.get('userInfo');
      user.customer = res.user;
      db.set('userInfo', user);
      page ?
        page.setData({
          user: res.user
        })
        : null;
    
      callback ? 
        callback(res.user)
        : null;
    }
  }

  getApp().api.getProfile(getProfileCallback);
}

// General method to call api and update user profile
export const updateUserInfo = function(new_info, back_url, switch_tab = false) {
  const callback = {
    success: res => {
      showLoading(false);
      let userInfo = db.get('userInfo');
      userInfo.customer = res;

      db.set('userInfo', userInfo);

      if (back_url) {
        navigateBack(back_url, switch_tab);
      }
    }
  }

  getApp().api.updateProfile(new_info, callback);
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