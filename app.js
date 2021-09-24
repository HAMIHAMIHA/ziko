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
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // Language setting
    // i18n.check();
    // self.globalData._t = i18n.translate();

  },
  globalData: {
    userInfo: null
  }
})
