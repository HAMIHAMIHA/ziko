const animate = require('../../../templates/offer/animation.js').tabbar;
const Offers = require('../../../templates/offer/getOffers.js');
const ModifyCart = require('../../../templates/offer/modifyCart.js');

const app = getApp();

let countdown_timer = [];

Page({
  data: {
    _setting: {
      swiperIndex: 1,
      currentTab: "product",
      height: '0px',
      left: '0',
      animate: animate,
    },
    _setting_scrollTo: {
      height: '0',
      currentTab: "offer"
    },
    messages: [],
  },

  onShow: function () {
    const self = this;
    // Get Offer
    Offers.getOffer(self, self.options.id);
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
    await getApp().sessionUtils.mobileLogin(this, e.detail.code);
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
    const self = this;

    // TEMP TODO
    if (e.currentTarget.dataset.info == 'packs') {
      Offers.switchTabs(self, 'pack');
    }

    let query = wx.createSelectorQuery();
    let top = 0;
    query.select(`#${e.currentTarget.dataset.info}`).boundingClientRect(res => {
      top = res.top;
      Offers.scrollTo(self, e.currentTarget.dataset.info, top);
    }).exec();
  },

  // Checkout offer
  checkout: function () {
    ModifyCart.checkoutItems(this.options.id);
  },

  // Change product amount in cart
  changeAmount: function (e) {
    ModifyCart.modifyCartItems(this, e)
  },

  onShareAppMessage: function (res) {},

})