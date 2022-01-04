const checkout = require('../../templates/checkout/checkout.js');
const offers = require('../../templates/offer/offers.js');

const app = getApp();
const routes = app.routes;

Page({
  data: {
    routes: routes,
    pageSet: {
      community: 'garden',
      swiperIndex: 1,
      units: 'g'
    },
    product: {
      id: 1,
      banner: [
        { key: 1, img: "/assets/images/offerDetailBanner.jpg" },
        { key: 2, img: "/assets/images/offerDetailBanner.jpg" },
        { key: 3, img: "/assets/images/offerDetailBanner.jpg" }
      ],
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo augue eget nisl pulvinar cursus. Mauris, ligula magna natoque ipsum, fringilla adipiscing. Ac vivamus rhoncus urna sagittis venenatis. Convallis et consectetur urna a ipsum enim, donec. Neque, eros, fermentum in pulvinar at sit mauris suscipit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n\n Commodo augue eget nisl pulvinar cursus. Mauris, ligula magna natoque ipsum, fringilla adipiscing. Ac vivamus rhoncus urna sagittis venenatis. Convallis et consectetur urna a ipsum enim, donec.   Neque, eros, fermentum in pulvinar at sit mauris suscipit.",
      available: 31,
      quantity: 2,
      weight: 200,
      price: 500,
      newPrice: 200,
      products: [{
        name: "product A",
        quantity: 2,
        weight: 200
      }, {
        name: "product B",
        quantity: 1,
        weight: 400
      }, {
        name: "product C",
        quantity: 2,
        weight: 200
      }],
    }
  },

  onLoad: function(options) {
    const self = this;

    self.setData({
      // "pageSet.type": 'product',
      // "pageSet.type": 'packProduct',
      // "pageSet.type": 'pack',
      "pageSet.type": options.type,
    })
  },

  onShow: function() {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change offer page nav title
    wx.setNavigationBarTitle({
      title: i18n.product_detail
    })
  
    // Set page content translation

    // TODO
    let community = self.data.pageSet.community;

    self.setData({
      _t: {
        available: i18n.available,
        discover: i18n.discover,
        minimum: i18n.minimum,
        only_left: i18n.only_left,
        pay: i18n.pay,
        price_rules: i18n.price_rules,
        products_available: i18n.products_available,
        products_left: i18n.products_left,
        related_receipes: i18n.related_receipes,
        units: i18n.units[community],
      }
    })
  },

  swiperChange: function(e) {
    const self = this;
    self.setData({
      "pageSet.swiperIndex": (e.detail.current) + 1,
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