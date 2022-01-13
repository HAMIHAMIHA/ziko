const checkout = require('../../../../templates/checkout/checkout.js');
const animate = require('../../../../templates/offer/animation.js').tabbar;
const offers = require('../../../../templates/offer/offers.js');

let countdown_timer = [];
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
  },

  onShow: function () {
    const self = this;

    // Get products
    offers.getOffer(self, self.options.id);


    // // Change page translation
    // offers._getTranslations(self, 'cellar');
  
    // // Start countdown
    // let timer = self.selectComponent('#countdown');
    // countdown_timer.push(timer.setTimer([], true));

    // // TEMP need to be from data
    // self.setData({
    //   "_offer.price_rule" : self.options.rule
    // })
  },

  onHide: function() {
    countdown_timer = offers._clearCountdown(this, countdown_timer);
  },

  onUnload: function() {
    countdown_timer = offers._clearCountdown(this, countdown_timer);
  },

  onReachBottom: function() {
    // TODO If current tab is on receipe
    offers.updateReceipes(this);
  },

  startCountdown: function() {
    // Start countdown
    let timer = this.selectComponent('#countdown');
    countdown_timer.push(timer.setTimer([], true));
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
  
  checkout: function() {
    checkout.checkoutItems(this, false);
  },

  updateTotal: function(e) {
    const self = this;
    console.log('update');

    self.setData({
      total: e.detail.total
    })
  },

  onShareAppMessage: function (res) {}
})