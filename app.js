var api = require('utils/api.js'); //接口文档
const i18n = require('utils/translate.js'); // 翻译功能
const db = require('utils/db.config.js'); // 本地存储
const { folders } = require('./utils/properties');

const getWxUserInfo = (res) => {
  wx.getUserInfo({
    success: function(res) {
      console.log(res);
      // TODO api to get openid and set to storage
    }
  })
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

    wx.checkSession({
      fail: function() {
        wx.login({
          success: function(res) {
            getWxUserInfo(res);
          }
        })
      }
    })
  },

  onShow() {
    // const self = this;
    // let userInfo = db.get('userInfo');
    // if (!userInfo || new Date(userInfo.expireAt) < new Date()) {
    // }
  },

  setTabbar: function() {
    // Get tabbar text when called
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
