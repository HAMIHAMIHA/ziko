const animate = {
  tab: wx.createAnimation({
    duration: 100,
    timingFunction: 'linear'
  }).opacity(1).step().export(),
  highlight: wx.createAnimation({
    duration: 100,
    timingFunction: 'linear'
  }).translateY(0).step().export(),
}

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
      community: 'kitchen',
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
      }]
    }
  },

  onLoad: function() {
    const self = this;

    // Page unit showing
    if (self.data._offer.community) {
    }

    // Message counts
    let messageIndex = []


    self.setData({
      "_pageSet.units": "cl",
    })
  },

  swiperChange: function(e) {
    const self = this;
    self.setData({
      "_pageSet.swiperIndex": (e.detail.current) + 1,
    })
  },

  switchTab: function(e) {
    const self = this;
    self.setData({
      "_pageSet.currentTab": e.currentTarget.dataset.toTab
    })
  },

  onShareAppMessage: function (res) {}
})