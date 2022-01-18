const api = require('./api.js'); // 本地存储
const db = require('./db.config.js'); // 本地存储
const i18n = require('./internationalize/translate.js'); // 翻译功能

// Move to cursor to next input
const changeFocus = function(page, e) {
  page.setData({
    _focus: e.currentTarget.dataset.next_item
  })
}

// General method to call api and login with wechat mobile number
const mobileLogin = function(page, code) {
  page.setData({
    user: db.get('userInfo')
  })

  const callback = {
    success: function(res) {
      if (!res.language) {
      // Save program language to sbf if user language info not found
        updateUserInfo({ langauge: db.get('langauge') }, null);
      } else if (res.language != db.get('language')) {
      // Update program language if user language is different from current
        getApp().globalData.i18n = i18n.change(res.language);
        page.updatePageLanguage();
      }
    }
  }

  const data = {
    code: code,
    name: db.get('userInfo').wxUser ? db.get('userInfo').wxUser.name : ''
  }

  // api.mobileLogin(data, callback);
  callback.success({});
}

// Go back to previous page or what should be previous page
const navigateBack = function(back_route, switchTab = false) {
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
const showLoading = function(show) {
  if (show) {
    wx.showLoading({
      title: getApp().globalData.i18n.loading,
    })
  } else {
    wx.hideLoading({});
  }
}

// General method to call api and update user profile
const updateUserInfo = function(new_info, back_url) {
  const callback = {
    success: res => {
      let userInfo = db.get('userInfo');
      userInfo.user = res;
      db.set('userInfo', userInfo);

      if (back_url) {
        navigateBack(back_url);
      }
    }
  }

  // api.updateProfile(new_info, callback);
}

const updateStoredUserInfo = (new_info) => {
  // let userInfo = getApp().db.get('userInfo');
  // userInfo.user = new_info;
  // getApp().db.set('userInfo', userInfo);
}

module.exports = {
  changeFocus,
  mobileLogin,
  navigateBack,
  showLoading,
  updateUserInfo
}