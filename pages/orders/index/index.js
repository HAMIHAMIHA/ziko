const api = require("../../../utils/api");
const { mobileLogin } = require("../../../utils/common");

const app = getApp();
const pickers = {
  community: ['all', 'baby', 'cellar', 'garden', 'kitchen', 'pet'],
  order_status: ['all', 'delivered', 'on_the_way', 'prepared', 'delayed', 'refund'],
}

let current = { community: '', order_status: '' };

// Change selected filters
const _defaultFilters = (page, key, index_val) => {
  let value = '';
  if (index_val != 0) {
    value = pickers[key][index_val];
  }

  current[key] = value;

  // Change picker select
  let page_selected = page.data._picker_selected;
  page_selected[key] = `${index_val}`;

  page.setData({
    _picker_selected: page_selected
  })
}

const getOrders = (page) => {
  const callback = {
    success: res => {
    }
  }

  let suffix = `?community=${ current.community }&order_status=${ current.order_status }&sort=["createdAt","DESC"]`;
  // TODO
  // app.api.getOrders(suffix, callback);
  // TEMP
  callback.success('');
}

Page({
  data: {
    _routes: { order: app.routes.order },
    _picker_selected: { community: '', order_status: '' }
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
  
    // Set page filter and get order
    _defaultFilters(self, 'community', 0);
    _defaultFilters(self, 'order_status', 0);
    getOrders(self);
  },

  // Mobile login
  getPhoneNumber: function(e) {
    mobileLogin(this, e.detail.code);
    // TODO api to get user phone -> user name + code + openid
  },

  // change filter content
  changeFilter: function(e) {
    const self = this;

    let filter_type = e.currentTarget.dataset.filter_type;
    let value = filter_type == 'community' ? e.detail.value : e.currentTarget.dataset.value;

    _defaultFilters(self, filter_type, value);
    getOrders(self);
  },

  onTabItemTap: function(e) {
    // TODO get user profile
  }
})