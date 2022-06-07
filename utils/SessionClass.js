/**
 * Class for Wechat login methods
 */

let app = null;

// Async Wechat function
function awx(fn, setting = {}) {
  const promise = new Promise( (resolve, reject) => {
    wx[fn]({
      ...setting,
      success: resolve,
      fail: reject
    })
  })

  return promise;
}

// Check wechat login session
async function _getOpenIdSession() {
  try {
    let session = await awx("checkSession");
    return session;
  } catch (e) {
    console.log(e);
    return;
  }
}

// Check wx.login session
async function _wxOpenId() {
  try {
    let open_code = await awx("login");
    return open_code;
  } catch (e) {
    console.log(e);
    return;
  }
}

// Check if user token has expired
function _checkExpired(expire) {
  if (new Date(expire) <= new Date()) {
    return true;
  }
  return false;
}

class SessionClass {
  constructor(app_info) {
    app = app_info;
  }

  // Get open id for user
  async getOpenId() {
    let session = await _getOpenIdSession();
    if (!session || app.db.get('userInfo')?.customer?.openid) return;

    let open_code = await _wxOpenId();
    app.api.wxOpenid({ code: open_code.code }).then(res => {
      let user = app.db.get('userInfo') ? app.db.get('userInfo') : {};
      user.customer ? user.customer.openId = res.openId : user.customer = res;
      app.db.set('userInfo', user);
      return;
    });
  }

  // Refresh user login token
  async refreshUserToken() {
    let user_info = app.db.get('userInfo');
    if (!user_info.token) {
      console.debug('User Not Logged in');
      return;
    }

    // Check if token session still valid
    if (!_checkExpired(user_info.expireAt)) {
      console.debug('User Exist');
      return;
    }

    // Try refresh token if user expired
    if (!_checkExpired(user_info.refreshExpireAt)) {
      console.debug("Refresh User Session");
      return app.api.refreshToken({ refreshToken: user_info.refreshToken }).then( res => {
        app.db.set('userInfo', res);
        return;
      })
    }

    // Logout user if cannot refresh
    this.logout();
    return;
  }

  // Logout user
  async logout() {
    console.debug("User Logged out");
    let user_info = app.db.get('userInfo').customer;
    // Clear user info
    app.db.set('userInfo', {
      customer: { openId: user_info.openId },
      wxUser: user_info.wxUser,
    });
    return;
  }

  /**
   * App based methods for user login and user data storage
   */
  // Get Wechat User info
  async getWxUserInfo(page) {
    try {
      const desc = `${app.globalData.i18n.getting_user_profile}`; // Need to be quoted to trigger popup)
      let wx_user = await awx("getUserProfile", { desc });
      let user = app.db.get('userInfo');
        user.wxUser = {
          avatar: wx_user.userInfo.avatarUrl,
          name: wx_user.userInfo.nickName
        }
        page.setData({
          wxUser: user.wxUser
        })
        app.db.set('userInfo', user);
    } catch(e) {
      console.log(e);
    }
  }
  
  // Login with wechat mobile number
  mobileLogin(page, code) {
    const promise = new Promise ( resolve => {
      const callback = res => {
        res.customer.openId = res.customer.openid;
        res.wxUser = app.db.get('userInfo').wxUser;
        app.db.set('userInfo', res);
        page.setData({ user: res.customer })

        // Get lottery and save info for account page usage  
        app.checkForLotteryNotification();
        app.setAccountStatus();

        resolve();
      }
  
      const data = {
        code: code,
        name: app.db.get('userInfo').customer.name ? app.db.get('userInfo').customer.name : app.db.get('userInfo').wxUser.name,
        openId: app.db.get('userInfo').customer.openId
      }
  
      app.api.wxLogin(data).then(callback);
    })

    return promise;
  }

}

export default SessionClass;