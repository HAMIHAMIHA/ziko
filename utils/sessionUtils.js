const { showLoading, navigateBack } = require("./common.js");

let app;

// Check user token
async function _checkUserToken() {
  const checkExpired = expire => {
    let current_session = expire ? new Date(expire) : new Date();
    if (current_session <= new Date()) {
      return true;
    }
    return false;
  }

  let user_info = app.db.get('userInfo');
  if (!user_info.token) {
    console.debug('User Not Logged in');
    return;
  }

  // Check if token session still valid
  if (checkExpired(user_info.expireAt)) {
    if (checkExpired(user_info.refreshExpireAt)) {
      // Clear user info
      app.db.set('userInfo', {
        customer: { openId: user_info.customer.openId },
        wxUser: user_info.wxUser,
      });
      return;
    } else {
      console.debug("Refresh User Session");
      return app.api.refreshToken({ refreshToken: user_info.refreshToken }).then( res => {
        app.db.set('userInfo', res);
        return;
      })
    }
  }
  console.debug('User Exist');
  return;
}

// Get open id
async function _getWxUserOpenId(session_res) {
  if (app.db.get('userInfo').customer && app.db.get('userInfo').customer.openId) return;
  app.api.wxOpenid({ code: session_res.code }).then(res => {
    let user = app.db.get('userInfo') ? app.db.get('userInfo') : {};
    user.customer ? user.customer.openId = res.openId : user.customer = res;
    app.db.set('userInfo', user);
    return;
  });
}

// Check wechat user session
const _checkUserSession = () => {
  return new Promise( resolve => {
    // Check wx.login session
    wx.checkSession({
      success: function() {
        console.debug('open id session exist');
        wx.login({
          success: resolve
        })
      },
      fail: function() {
        console.debug('openId session ended');
        // Login with wechat if session not valid
        wx.login({
          success: resolve
        })
      }
    })
  })
}

// Check user content on app load
export const appLoad = function(app_set) {
  app = app_set;
  _checkUserSession().then(res => {
    _getWxUserOpenId(res).then( () => {
      _checkUserToken().then( () => {
        app.checkForLotteryNotification();
        if (app.db.get('userInfo').token) {
          app.setAccountStatus();
        }
      })
    })
  })
}

// Check user session and set user to page data
export async function getUserInfo(page) {
  let user = app.db.get('userInfo');
  // Check if token session still valid
  let current_session = user.expireAt ? new Date(user.expireAt) : 0;
  if (!current_session || current_session <= new Date()) {
    console.debug('token session ended');
    if (user && user.customer) {
      user = {
        wxUser: user.wxUser,
        customer: { openId: user.customer.openId },
      }
    }
    app.db.set('userInfo', user);

    page.setData({
      user: user.customer,
      wxUser: user.wxUser
    })
  } else {
    refreshUserInfo(page, null);
  }
}

// General method to call api and login with wechat mobile number
export const mobileLogin = function(page, code, loginCallback) {
  const callback = res => {
    res.customer.openId = res.customer.openid;
    res.wxUser = app.db.get('userInfo').wxUser;
    app.db.set('userInfo', res);
    page.setData({ user: res.customer })
    loginCallback ? loginCallback() : null;

    app.checkForLotteryNotification();
    app.setAccountStatus();
  }

  const data = {
    code: code,
    name: app.db.get('userInfo').customer.name ? app.db.get('userInfo').customer.name : app.db.get('userInfo').wxUser.name,
    openId: app.db.get('userInfo').customer.openId
  }

  app.api.wxLogin(data).then(callback);
}

// Get user nickname and picture from wechat
export const getWxUserInfo = function(page) {
  wx.getUserProfile({
    desc: `${app.globalData.i18n.getting_user_profile}`, // Need to be quoted to trigger popup
    success: (res) => {
      let wx_user = res;
      let user = app.db.get('userInfo');
      user.wxUser = {
        avatar: wx_user.userInfo.avatarUrl,
        name: wx_user.userInfo.nickName
      }
      page.setData({
        wxUser: user.wxUser
      })
      app.db.set('userInfo', user);
    }
  })
}

// Get user info from database
export const refreshUserInfo = function(page, callback) {
  const getProfileCallback = res => {
    let user = app.db.get('userInfo');
    user.customer = res.user;
    app.db.set('userInfo', user);
    page ?
      page.setData({
        user: res.user,
        wxUser: user.wxUser
      })
      : null;
  
    if (callback) {
      callback(res.user)
    }
  }

  app.api.getProfile().then(getProfileCallback);
}

// General method to call api and update user profile
export const updateUserInfo = function(new_info, back_url, switch_tab = false) {
  const callback = res => {
    showLoading(false);
    let userInfo = app.db.get('userInfo');
    userInfo.customer = res;

    app.db.set('userInfo', userInfo);

    if (back_url) {
      navigateBack(back_url, switch_tab);
    }
  }

  app.api.updateProfile(new_info).then(callback);
}

