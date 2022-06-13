var api = require('utils/api.js'); //接口文档
const common = require('./utils/common');
const db = require('utils/db.config.js'); // 本地存储
const i18n = require('utils/internationalize/translate.js'); // 翻译功能

const { folders, subscribe } = require('./utils/properties');

export async function _checkUserToken() {
  // Check user token
  const checkExpired = expire => {
    let current_session = expire ? new Date(expire) : new Date();
    if (current_session <= new Date()) {
      return true;
    }
    return false;
  }

  let user_info = db.get('userInfo');
  if (!user_info.token) {
    console.debug('User Not Logged in');
    return;
  }

  // Check if token session still valid
  if (checkExpired(user_info.expireAt)) {
    if (checkExpired(user_info.refreshExpireAt)) {
      // Clear user info
      db.set('userInfo', {
        customer: { openId: user_info.customer.openId },
        wxUser: user_info.wxUser,
      });
      return;
    } else {
      console.debug("Refresh User Session");
      return api.refreshToken({ refreshToken: user_info.refreshToken }).then( res => {
        db.set('userInfo', res);
        return;
      })
    }
  }
  console.debug('User Exist');
  return;
}

async function _getWxUserOpenId(session_res) {
  if (db.get('userInfo').customer && db.get('userInfo').customer.openId) return;
  api.wxOpenid({ code: session_res.code }).then(res => {
    let user = db.get('userInfo') ? db.get('userInfo') : {};
    user.customer ? user.customer.openId = res.openId : user.customer = res;
    db.set('userInfo', user);
    return;
  });
}

// async function _checkUserSession() {
const _checkUserSession = () => {
  return new Promise( resolve => {
    // Check wx.login session
    wx.checkSession({
      success: function() {
        console.debug('open id session exist');
        wx.login({
          success: resolve
        })
      },
      fail: function() {
        console.debug('openId session ended');
        // Login with wechat if session not valid
        wx.login({
          success: resolve
        })
      }
    })
  })
}

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

  async onLaunch() {
    const self = this;
    // Language setting
    i18n.check();
    self.globalData.i18n = i18n.translate();

    _checkUserSession().then(res => {
      _getWxUserOpenId(res).then( () => {
        _checkUserToken().then( () => {
          self.checkForLotteryNotification();
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
        })
      })
    })
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
