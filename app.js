const api = require('./utils/api.js'); //接口文档
const common = require('./utils/common.js');
const db = require('./utils/db.config.js'); // 本地存储
const { loadFonts } = require("./utils/fontPreloader.js");
const { folders, subscribe, tabbars } = require('./utils/properties.js');
const { routes } = require('utils/routes.js');
const i18n = require('./utils/internationalize/translate.js'); // 翻译功能

import SessionClass from "./utils/SessionClass.js";

App({
  api,
  common,
  db,
  folders,
  subscribe,
  globalData: {
    token: null,
    i18n: require('./utils/internationalize/internationalize.js').zh, // Load a default language map first
    pause_lottery_check: false,
    index_type: '',
  },
  routes,
  sessionUtils: null,

  async onLaunch() {
    const self = this;
    // Language setting
    i18n.check();
    self.globalData.i18n = i18n.translate();

    self.sessionUtils = new SessionClass(self);
    await self.sessionUtils.getOpenId();
    await self.sessionUtils.refreshUserToken();

    // Get lottery and save info for account page usage  
    if (db.get('userInfo').token) {
      self.checkForLotteryNotification();
      self.setAccountStatus();
    }

    await loadFonts();
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

  // Get translated tabbar text when called
  setTabbars: function() {
    tabbars.forEach( (tab, i) => common.setTabbar(i, this.globalData.i18n[tab]));
  }
})
