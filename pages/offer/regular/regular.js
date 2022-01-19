const { mobileLogin } = require("../../../utils/common");
const animate = require('../../../templates/offer/animation.js').tabbar;
const Offers = require('../../../templates/offer/getOffers.js');
const ModifyCart = require('../../../templates/offer/modifyCart.js');

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
    // Get Offer
    Offers.getOffer(self, self.options.id);

    // Message counts
    let messageIndex = []
  },

  onHide: function() {
    countdown_timer = Offers._clearCountdown(this, countdown_timer);
  },

  onUnload: function() {
    countdown_timer = Offers._clearCountdown(this, countdown_timer);

    Offers.unloadOfferPage();
  },

  // Hide for v1
  onReachBottom: function() {
    // TODO If current tab is on receipe
    Offers.updateReceipes(this);
  },

  // Mobile login
  getPhoneNumber: function(e) {
    mobileLogin(this, e.detail.code, this.checkout);
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
    ModifyCart.checkoutItems(this.options.id);
  },

  changeAmount: function(e) {
    ModifyCart.modifyCartItems(this, e)
  },

  onShareAppMessage: function (res) {}
})