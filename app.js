var api = require('utils/api.js'); //接口文档
const common = require('./utils/common');
const db = require('utils/db.config.js'); // 本地存储
const i18n = require('utils/internationalize/translate.js'); // 翻译功能

const { folders } = require('./utils/properties');

const getWxUserInfo = (res) => {
  const callback = {
    success: res => {
      // if (res.userInfo) {
      //   // Get user info from wechat (name, profile picture)
      //   wx.getUserInfo({
      //     success: function(wx_user) {
      //       res.wxUser = {
      //         avatar: wx_user.userInfo.avatarUrl,
      //         name: wx_user.userInfo.nickName
      //       }
      //     }
      //   })

      //   // Update program language map if user exist
      //   if (res.userInfo.language != db.get('language')) {
      //   // Change language map if user langauge different from system
      //     i18n.change(res.userInfo.language);
      //   } else if (!res.userInfo.langauge) {
      //   // Update profile language if user exists but language not saved
      //     common.updateUserInfo({ langauge: db.get('langauge') }, null);
      //   }
      // }

      // TEMP !!!!! remove for production!!!!!
      api.authLogin();

      db.set('userInfo', res);
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
        // TEMP !!!!! remove for production!!!!!
        api.authLogin();
      },
      fail: function() {
        // Login with wechat if session not valid
        wx.login({
          success: function(res) {
            // TODO wait for api
            console.log(res);
            getWxUserInfo(res);
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
