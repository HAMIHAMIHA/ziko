var api = require('utils/api.js'); //接口文档
const common = require('./utils/common');
const db = require('utils/db.config.js'); // 本地存储
const i18n = require('utils/internationalize/translate.js'); // 翻译功能

const { folders } = require('./utils/properties');

const getWxUserOpenId = (res) => {
  api.wxOpenid({ code: res.code }).then(res => {
    let user = db.get('userInfo') ? db.get('userInfo') : {};
    user.customer ? user.customer.openId = res.openId : user.customer = res;

    db.set('userInfo', user);
  });
}

App({
  api: api,
  common: common,
  db: db,
  folders: folders,
  globalData: {
    token: null,
    i18n: require('./utils/internationalize/internationalize.js').zh // Load a default language map first
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

        console.debug('customer not found');
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
      "text": self.globalData.i18n.explore
    })

    wx.setTabBarItem({
      index: 3,
      "text": self.globalData.i18n.lottery
    })

    wx.setTabBarItem({
      index: 4,
      "text": self.globalData.i18n.account
    })
  },

  checkForLottery: function() {
    // Start checking for lottery

    // TODO need api with lottery draw + orders with tickets > 0
    let t = setInterval(() => {
      // if (db.get('userInfo').customer) {
      //   api.getLotteries().then( res => {

      //   })
      // }
    }, 1000)
  }
})
