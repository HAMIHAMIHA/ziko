// app.js
var api = require('utils/api.js'); //接口文档
const i18n = require('utils/translate.js'); // 翻译功能
const db = require('utils/db.config.js'); // 本地存储

App({
  api: api,
  routes: require('utils/routes.js').routes,
  globalData: {
    // token: null
  },

  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // Language setting
    // i18n.check();
    // self.globalData._t = i18n.translate();

  }
})
