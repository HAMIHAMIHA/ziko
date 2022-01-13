const checkout = require('../../templates/checkout/checkout.js');
const offers = require('../../templates/offer/offers.js');

const app = getApp();
const routes = app.routes;

Page({
  data: {
    routes: routes,
    _setting: {
      community: 'garden',
      swiperIndex: 1,
      units: 'g'
    },
  },

  onLoad: function(options) {
    const self = this;

    self.setData({
      // "_setting.type": 'product',
      // "_setting.type": 'packProduct',
      // "_setting.type": 'pack',
      "_setting.type": options.type,
    })
  },

  onShow: function() {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page navbar title
    wx.setNavigationBarTitle({
      title: i18n.product_detail
    })
  
    // Set page content translation

    // TODO
    let community = self.data._setting.community;

    self.setData({
      _t: {
        available: i18n.available,
        contains_items: i18n.contains_items,
        discover: i18n.discover,
        minimum: i18n.minimum,
        only_left: i18n.only_left,
        pay: i18n.pay,
        price_rules: i18n.price_rules,
        products_left: i18n.products_left,
        related_receipes: i18n.related_receipes,
        units: i18n.units[community],
      }
    })
  },

  swiperChange: function(e) {
    const self = this;
    self.setData({
      "_setting.swiperIndex": (e.detail.current) + 1,
    })
  },

  checkout: function() {
    checkout.checkoutItems(this, true);
  },
  
  onReachBottom: function() {
    offers.updateReceipes(this);
  },

  onShareAppMessage: function () {}
})