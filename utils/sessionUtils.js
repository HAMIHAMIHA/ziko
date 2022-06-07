/** User session and data page */
const { showLoading, navigateBack } = require ('./common.js');

let app = null;

// Check user content on app load
export async function appLoad(app_set) {
  app = app_set;
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