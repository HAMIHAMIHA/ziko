const animate = require('../../../utils/animation.js').tabbar;

Page({
  data: {
    _pageSet: {
      swiperIndex: 1,
      nextOffer: 'test',
      currentTab: "product",
      units: "g",
      animate: animate
    },
    _offer: {
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

  onLoad: function(options) {
    const self = this;

    // TEMP
    let community = options.community;
    self.setData({
      "_pageSet.units": community == "cellar" ? 'cl' : 'g',
      "_offer.community": community
    })

    // Message counts
    let messageIndex = []

  },

  swiperChange: function(e) {
    const self = this;
    self.setData({
      "_pageSet.swiperIndex": (e.detail.current) + 1,
    })
  },

  switchTab: function(e) {
    const self = this;
    // TODO change to show and hide css on switch
    self.setData({
      "_pageSet.currentTab": e.currentTarget.dataset.toTab
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