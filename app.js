var api = require('utils/api.js'); //接口文档
const common = require('./utils/common');
const db = require('utils/db.config.js'); // 本地存储
const i18n = require('utils/internationalize/translate.js'); // 翻译功能

const { folders } = require('./utils/properties');

const getWxUserOpenId = (res) => {
  const callback = {
    success: res => {
      let user = db.get('userInfo') ? db.get('userInfo') : {};
      user.customer ? user.customer.openId = res.openId : user.customer = res;

      if (user.customer) {
      // Get user info from wechat (name, profile picture)
        wx.getUserInfo({
          success: function(wx_user) {
            user.wxUser = {
              avatar: wx_user.userInfo.avatarUrl,
              name: wx_user.userInfo.nickName
            }
            db.set('userInfo', user);
          }
        })
      } else {
        db.set('userInfo', user);
      }
    }
  }

  api.wxOpenid({ code: res.code }, callback);
}

App({
  api: api,
  common: common,
  db: db,
  folders: folders,
  globalData: {
    token: null
  },
  routes: require('utils/routes.js').routes,

  onLaunch() {
    const self = this;
    // Language setting
    i18n.check();
    self.globalData.i18n = i18n.translate();

    // Check wx.login session
    wx.checkSession({
      success: function() {
        if (db.get('userInfo').customer && db.get('userInfo').customer.openId) return;

        console.debug('openid not found');
        wx.login({
          success: function(res) {
            getWxUserOpenId(res);
          }
        })
      },
      fail: function() {
        console.debug('openid session ended');
        // Login with wechat if session not valid
        wx.login({
          success: function(res) {
            getWxUserOpenId(res);
          }
        })
      }
    })
  },

  setTabbar: function() {
    // Get translated tabbar text when called
    const self = this;
    wx.setTabBarItem({
      index: 0,
      "text": self.globalData.i18n.home
    })

    wx.setTabBarItem({
      index: 1,
      "text": self.globalData.i18n.orders
    })

    wx.setTabBarItem({
      index: 2,
      "text": self.globalData.i18n.account
    })
  }
})
