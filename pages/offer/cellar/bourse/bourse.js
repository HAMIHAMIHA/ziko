const animate = require('../../../../templates/offer/animation.js').tabbar;

let countdown_timer = [];

const _clearCountdown = (page) => {
  let timer = page.selectComponent('#countdown');
  timer.setTimer(countdown_timer, false);
  countdown_timer = []
}

Page({
  data: {
    _setting: {
      swiperIndex: 1,
      nextOffer: 'test',
      currentTab: "product",
      units: "cl",
      animate: animate
    },
    total: 600,
    currentSold: 160,
    _offer: {
      community: 'cellar',
      priceRule: 'bourse',
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

  onShow: function () {

    // Start countdown
    let timer = self.selectComponent('#countdown');
    countdown_timer.push(timer.setTimer([], true));
  },

  onHide: function() {
    _clearCountdown(this);
  },

  onUnload: function() {
    _clearCountdown(this);
  },

  swiperChange: function(e) {
    const self = this;
    self.setData({
      "_setting.swiperIndex": (e.detail.current) + 1,
    })
  },

  switchTab: function(e) {
    const self = this;

    // TODO change to show and hide css on switch
    self.setData({
      "_setting.currentTab": e.currentTarget.dataset.toTab
    })
  },
  
  onReachBottom: function() {
    let self = this;
    var receipecomp = self.selectComponent("#receipes-component");
    // TODO
    if (data) {
      receipecomp.onReachBottom();
    }
  },

  onShareAppMessage: function (res) {}
})