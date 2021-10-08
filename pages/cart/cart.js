Page({
  data: {
    cart: {
      products: [{
        name: "product A",
        type: "product",
        available: 1,
        quantity: 2,
        weight: 200,
        price: 500
      }, {
        id: 1,
        available: 31,
        type: "pack",
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
        name: "product B",
        type: "product",
        available: 110,
        quantity: 2,
        weight: 200,
        price: 500
      }, {
        name: "product C",
        type: "product",
        available: 10,
        quantity: 2,
        weight: 200,
        price: 500
      }, {
        id: 2,
        available: 190,
        type: "pack",
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
      }]
    }
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  onShareAppMessage: function () {

  }
})