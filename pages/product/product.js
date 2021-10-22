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
    self.receipecomp = self.selectComponent("#receipes-component");

    self.setData({
      // "pageSet.type": 'product',
      // "pageSet.type": 'packProduct',
      // "pageSet.type": 'pack',
      "pageSet.type": options.type,
    })
  },

  swiperChange: function(e) {
    const self = this;
    self.setData({
      "pageSet.swiperIndex": (e.detail.current) + 1,
    })
  },
  
  onReachBottom: function() {
    let self = this;
    self.receipecomp.onReachBottom();
  },

  onShareAppMessage: function () {}
})