const checkout = require('../../../templates/checkout/checkout.js');
const animate = require('../../../templates/offer/animation.js').tabbar;
const offers = require('../../../templates/offer/offers.js');

let countdown_timer = [];
Page({
  data: {
    _setting: {
      swiperIndex: 1,
      currentTab: "product",
      units: "g", // TODO use translated version
      animate: animate
    }
  },

  onShow: function() {
    const self = this;
    // Get products
    offers.getOffer(self, self.options.id);

    // Message counts
    let messageIndex = []
  },

  onHide: function() {
    countdown_timer = offers._clearCountdown(this, countdown_timer);
  },

  onUnload: function() {
    countdown_timer = offers._clearCountdown(this, countdown_timer);
  },

  // Hide for v1
  onReachBottom: function() {
    // TODO If current tab is on receipe
    offers.updateReceipes(this);
  },

  startCountdown: function() {
    // Start countdown
    let timer = this.selectComponent('#countdown');
    countdown_timer.push(timer.setTimer([], true));
  },

  // Product images swiper change
  swiperChange: function(e) {
    const self = this;
    self.setData({
      "_setting.swiperIndex": (e.detail.current) + 1,
    })
  },

  // Switch between reciepe and products
  switchTab: function(e) {
    const self = this;
    // TODO change to show and hide css on switch
    self.setData({
      "_setting.currentTab": e.currentTarget.dataset.toTab
    })
  },

  checkout: function() {
    checkout.checkoutItems(this, false);
  },

  updateTotal: function(e) {
    const self = this;

    self.setData({
      total: e.detail.total
    })
  },

  onShareAppMessage: function (res) {}
})