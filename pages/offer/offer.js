Page({
  data: {
    _pageSet: {
      swiperIndex: 1,
      nextOffer: 'test',
      currentTab: "product"
    },
    _offer: {
      community: 'cellar',
      priceRule: 'regular',
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
      singles: [
        {
          id: 1,
          available: 31,
          quantity: 2,
          weight: 200,
          price: 500,
          newPrice: 200
        },
        {
          id: 2,
          available: 190,
          quantity: 2,
          weight: 200,
          price: 500
        },
        {
          id: 3,
          available: 0,
          quantity: 2,
          weight: 200,
          price: 500
        },
        {
          id: 3,
          available: 0,
          quantity: 2,
          weight: 200,
          price: 500
        }
      ]
    },
    messages: [
      "message1",
      "message2",
      "message1 message2",
      "message mesag asg asgkljsd agl message2",
      "mesag asg asgkljsd aessage2",
      "message2",
      "message1 message2",
      "message mesag asg asgkljsd agl message2",
      "mesag asg asgkljsd aessage2"
    ]
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

  onShareAppMessage: function () {

  }
})