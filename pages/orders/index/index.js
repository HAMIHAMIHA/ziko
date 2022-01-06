const { mobileLogin } = require("../../../utils/common");

const app = getApp();

const pickers = {
  order_status: ['all', 'delivered', 'on_the_way', 'prepared', 'delayed', 'refund'],
  community: ['all_communities', 'baby', 'cellar', 'garden', 'kitchen', 'pet']
}

Page({
  data: {
    _routes: {
      order: app.routes.order
    },
  },
  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    app.setTabbar();

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.my_orders
    })

    // Format picker values based on langauge
    let communities = [];
    for (var community in pickers.community) {
      let community_variable = pickers.community[community];
      communities.push(i18n.community[community_variable]);
    }

    // Set page translation
    self.setData({
      _t: {
        community: i18n.community,
        item_unit: i18n.item_unit,
        items_unit: i18n.items_unit,
        login: i18n.login,
        lottery_gift: i18n.lottery_gift,
        need_login: i18n.need_login,
        order_status: i18n.order_status,
      },
      _pickers: {
        communities: communities,
        order_status: pickers.order_status,
      }
    })

    // Get user info
    let user = app.db.get('userInfo');
    self.setData({
      user: app.db.get('userInfo')
    })
  },

  // Mobile login
  getPhoneNumber: function(e) {
    mobileLogin(this, e.detail.code);
    // TODO api to get user phone -> user name + code + openid
  },

  onTabItemTap: function(e) {
    // TODO get user profile
  }
})