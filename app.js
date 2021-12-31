var api = require('utils/api.js'); //接口文档
const i18n = require('utils/translate.js'); // 翻译功能
const db = require('utils/db.config.js'); // 本地存储
const { folders } = require('./utils/properties');
const common = require('./utils/common');

const getWxUserInfo = (res) => {
  const callback = {
    success: res => {
      // Get user info from wechat if no userInfo in result
      if (!res.userInfo) {
        wx.getUserInfo({
          success: function(wx_user) {
            res.wxUser({
              avatar: wx_user.userInfo.avatarUrl,
              name: wx_user.userInfo.nickName
            })
          }
        })
      } else {
        if (res.userInfo.language != db.get('language')) {
        // Chagne language map if user langauge different from system
          i18n.changeLanguage(res.userInfo.language);
        } else if (!res.userInfo.langauge) {
        // Update profile language if user exists but language not saved
          common.updateUserInfo({ langauge: db.get('langauge')}, null);
        }
      }

      db.set('user', res);
    }
  }

  api.wxLogin({ code: res.code }, callback);
}

App({
  api: api,
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
      fail: function() {
        // Login with wechat if session not valid
        wx.login({
          success: function(res) {
            // TODO wait for api
            // getWxUserInfo(res);
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
