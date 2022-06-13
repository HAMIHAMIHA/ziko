const api = require('./utils/api.js'); //接口文档
const common = require('./utils/common.js');
const db = require('./utils/db.config.js'); // 本地存储
const { folders, subscribe } = require('./utils/properties.js');
const { appLoad } = require('./utils/sessionUtils.js');
const i18n = require('./utils/internationalize/translate.js'); // 翻译功能

import SessionClass from "./utils/SessionClass.js";

App({
  api: api,
  common: common,
  db: db,
  folders: folders,
  subscribe,
  globalData: {
    token: null,
    i18n: require('./utils/internationalize/internationalize.js').zh, // Load a default language map first
    pause_lottery_check: false,
    index_type: '',
  },
  routes: require('utils/routes.js').routes,
  sessionUtils: null,

  async onLaunch() {
    const self = this;
    // Language setting
    i18n.check();
    self.globalData.i18n = i18n.translate();

    appLoad(self);

    self.sessionUtils = new SessionClass(self);
    await self.sessionUtils.getOpenId();
    await self.sessionUtils.refreshUserToken();
  },

  checkForLotteryNotification: function() {
    const self = this;
    if (!db.get('userInfo').token) return;

    const getLotteryNotif = () => {
      if (self.globalData.pause_lottery_check) return;
      api.getLotteryNotifications().then( res => {
        if (!res.length) return; // If there's no new notification
        let page = getCurrentPages()[getCurrentPages().length - 1];
        page.selectComponent('#lottery_modal').show(res);
        self.globalData.pause_lottery_check = true;
      })
    }
  
    getLotteryNotif();
    setInterval( () => {
      getLotteryNotif();
    }, 1000)
  },

  setAccountStatus: function() {
    if (!db.get('vouchers') >= 0) {
      api.getVouchers('', false).then( res => {
        db.set('vouchers', res.filter(r => { return r.status === 'validated' }).length)
      });
    }
    if (!db.get('orderDeliveries').length) {
      api.getOrders({ filter_str: `channel=miniprogram` }).then(res => {
        let order_deliveries = [];
        res.forEach( o => {
          order_deliveries.push(o.trackingStatus)
        })
        db.set('orderDeliveries', order_deliveries);
      })
    }
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
  }
})
