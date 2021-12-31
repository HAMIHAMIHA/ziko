const checkout = require('../../../templates/checkout/checkout.js');
const animate = require('../../../templates/offer/animation.js').tabbar;
const offers = require('../../../templates/offer/offers.js');

let countdown_timer = [];

const getOffer = function(page, offer_id) {
  // callback -> for each item in product and pack list -> add quantity based on storage cart[order_id]
    // if item in cart offer -> check quantity and availibity -> reduce to min or remove or keep
    // update page data
  // get product by offer id
}

Page({
  data: {
    pageSet: {
      swiperIndex: 1,
      nextOffer: 'test',
      currentTab: "product",
      units: "g",
      animate: animate
    },
    _offer: {
      endTime: '2021-12-20 19:00',
      community: 'pet',
      banner: [
        { key: 1, img: "/assets/images/offerDetailBanner.jpg" },
        { key: 2, img: "/assets/images/offerDetailBanner.jpg" },
        { key: 3, img: "/assets/images/offerDetailBanner.jpg" }
      ],
      packs: [{
        id: 1,
        available: 31,
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
        price: 500
      }, {
        id: 2,
        available: 190,
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
        price: 500
      }, {
        id: 3,
        available: 0,
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
        price: 500
      }],
      singles: [{
        id: 1,
        available: 31,
        quantity: 2,
        weight: 200,
        price: 500,
        newPrice: 200
      }, {
        id: 2,
        available: 190,
        quantity: 2,
        weight: 200,
        price: 500
      }, {
        id: 3,
        available: 0,
        quantity: 2,
        weight: 200,
        price: 500
      }, {
        id: 4,
        available: 0,
        quantity: 2,
        weight: 200,
        price: 500
      }],
      specials: [{
        type: "first",
        amount: 20,
        get: "addon",
        addon: {
          id: 2,
          available: 190,
          quantity: 2,
          weight: 200,
          price: 500
        }
      }, {
        type: "totalAbove",
        amount: 20,
        get: "reduction",
        rate: "10"
      }, {
        type: "orderAbove",
        amount: 20,
        get: "reduction",
        rate: "10"
      }, {
        type: "totalSold",
        amount: 20,
        get: "reduction",
        rate: "10"
      }, {
        type: "cart",
        item: "pack a",
        get: "reduction",
        rate: "10"
      }],
      lotteries: [{
        type: "first",
        amount: 20,
        get: "addon",
        addon: {
          id: 2,
          available: 190,
          quantity: 2,
          weight: 200,
          price: 500
        }
      }]
    }
  },

  onShow: function() {
    const self = this;

    // TEMP
    let community = self.options.community;
    self.setData({
      "pageSet.units": community == "cellar" ? 'cl' : 'g',
      "_offer.community": community
    })

    // Start countdown
    let timer = self.selectComponent('#countdown');
    countdown_timer.push(timer.setTimer([], true));

    // Set language

    // Get products
    getOffer(self, self.options.id)

    // Message counts
    let messageIndex = []
  },

  onHide: function() {
    countdown_timer = offers._clearCountdown(this, countdown_timer);
  },

  onUnload: function() {
    countdown_timer = offers._clearCountdown(this, countdown_timer);
  },

  swiperChange: function(e) {
    const self = this;
    self.setData({
      "pageSet.swiperIndex": (e.detail.current) + 1,
    })
  },

  switchTab: function(e) {
    const self = this;
    // TODO change to show and hide css on switch
    self.setData({
      "pageSet.currentTab": e.currentTarget.dataset.toTab
    })
  },
  
  onReachBottom: function() {
    // TODO If current tab is on receipe
    offers.updateReceipes(this);
  },

  checkout: function() {
    checkout.checkoutItems(this, false);
  },

  onShareAppMessage: function (res) {}
})