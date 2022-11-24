const animate = require('../../../../templates/offer/animation.js').tabbar;
const Offers = require('../../../../templates/offer/getOffers.js');
const ModifyCart = require('../../../../templates/offer/modifyCart.js');

const app = getApp();

let countdown_timer = [];

Page({
  data: {
    pagePath: app.routes.offer_cellar,
    _setting_scrollTo: {
      height: '0',
      currentTab: "offer"
    },
    messages: [],
  },

  onShow: function () {
    const self = this;

    self.setData({
      _setting: {
        swiperIndex: 1,
        nextOffer: '',
        currentTab: "product",
        height: '0px',
        left: '0',
        animate: animate,
      },
    })

    // Get Offer
    Offers.getOffer(self, self.options.id);

    wx.getSystemInfo({
      success: (res) => {
        self.setData({
          onePxToRpx: 750 / res.windowWidth,
        })
      },
    })
  },

  // Stop countdown timer on leaving page
  onHide: function () {
    countdown_timer = Offers._clearCountdown(this, countdown_timer);
    Offers.clearBuyerInterval();
    this.selectComponent('#scroll_messages').clearMessageInterval();
  },

  onUnload: function () {
    countdown_timer = Offers._clearCountdown(this, countdown_timer);
    Offers.clearBuyerInterval();
    this.selectComponent('#scroll_messages').clearMessageInterval();

    Offers.unloadOfferPage(this);
  },

  // Mobile login
  getPhoneNumber: async function (e) {
    await app.sessionUtils.mobileLogin(this, e.detail.code);
    this.checkout();
  },

  // Get user profile if not logged in
  getUserProfile: function () {
    app.sessionUtils.getWxUserInfo(this);
  },

  // Start countdown timer
  startCountdown: function () {
    // Start countdown
    let timer = this.selectComponent('#countdown');
    countdown_timer.push(timer.setTimer([], true));
  },

  // Change swiper indicatior
  swiperChange: function (e) {
    const self = this;
    let data = {
      currentTarget: {
        dataset: {
          index: (self.data._setting.swiperIndex - 1),
          do_pause: true
        }
      }
    }

    // Pause current video
    self.toggleVideo(data);

    // Play next video
    data.currentTarget.dataset.index = e.detail.current;
    data.currentTarget.dataset.do_pause = false;
    self.toggleVideo(data);

    self.setData({
      "_setting.swiperIndex": (e.detail.current) + 1,
    });
  },

  // Toggle video
  toggleVideo: function (e) {
    Offers.toggleVideo(this, e);
  },

  // Pause video after video ended
  setPause: function (e) {
    Offers.pauseVideo(this, e);
  },

  // Switch between recipe and products
  switchTab: function (e) {
    Offers.switchTabs(this, e.currentTarget.dataset.toTab);
  },

  // Scroll to the specific section
  scrollTo: function (e) {
    Offers.scrollTo(this, e.currentTarget.dataset.info, this.data._setting[e.currentTarget.dataset.info].top);
  },

  // Checkout offer
  checkout: function () {
    console.log("checkout")
    ModifyCart.checkoutItems(this.options.id);
  },

  // Change product amount in cart
  changeAmount: function (e) {
    ModifyCart.modifyCartItems(this, e)
  },

  onShareAppMessage: function (res) {}
})