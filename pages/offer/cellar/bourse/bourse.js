const animate = require('../../../../templates/offer/animation.js').tabbar;
const Offers = require('../../../../templates/offer/getOffers.js');
const ModifyCart = require('../../../../templates/offer/modifyCart.js');

const { bourse_colors } = require('../../../../utils/constants.js');
const { loadFonts } = require('../../../../utils/fontPreloader.js');

const app = getApp();

let countdown_timer = [];

Page({
  data: {
    _setting: {
      swiperIndex: 1,
      nextOffer: '',
      currentTab: "product",
      height: '0px',
      left: '0',
      animate: animate,
    },
    messages: [],
  },

  onShow: async function () {
    await loadFonts();

    const self = this;
    // Get Offer
    Offers.getOffer(self, self.options.id);
  },

  // Stop countdown timer on leaving page
  onHide: function() {
    countdown_timer = Offers._clearCountdown(this, countdown_timer);
    Offers.clearBuyerInterval();
    this.selectComponent('#scroll_messages').clearMessageInterval();
  },

  onUnload: function() {
    countdown_timer = Offers._clearCountdown(this, countdown_timer);
    Offers.clearBuyerInterval();
    this.selectComponent('#scroll_messages').clearMessageInterval();

    Offers.unloadOfferPage(this);
  },

  // Set bourse style
  setBourseGraph: function(offer) {
    const self = this;
    const colors = bourse_colors;

    let bourses = offer.miniprogram.bourses.sort( (a, b) => {
      return b.unitPrice - a.unitPrice;
    })

    if (bourses[0].from > 0) {
      bourses = [{
        _id: 'b000',
        from: 0,
        to: bourses[0].to - 1,
        unitPrice: offer.miniprogram.items[0].price,
        first: true
      }, ...bourses]
    }

    let last = bourses[bourses.length - 1];
    let progress = Math.round(offer.sold / last.to * 100);

    let bg_list = [];
    bourses.map( (b, index) => {
      if (index === bourses.length - 1) {
        b.last = true;
      }
      b.color = colors[index % colors.length];
      b.position = Math.round(b.from / last.to * 100);
      b.end_position = Math.round(b.to / last.to * 100);
      b.unlocked = offer.sold >= b.from;
      bg_list.push(`${b.color} ${b.end_position}%`);
    })

    self.setData({
      _bourse_info: {
        progress,
        list: bourses,
        bg_color: `linear-gradient(90deg, ${ bg_list.join(', ') })`
      }
    })
  },

  // Mobile login
  getPhoneNumber: async function(e) {
    await app.sessionUtils.mobileLogin(this, e.detail.code);
    this.checkout();
  },

  // Get user profile if not logged in
  getUserProfile: function() {
    app.sessionUtils.getWxUserInfo(this);
  },

  // Start countdown timer
  startCountdown: function() {
    // Start countdown
    let timer = this.selectComponent('#countdown');
    countdown_timer.push(timer.setTimer([], true));
  },

  // Change swiper indicatior
  swiperChange: function(e) {
    const self = this;
    let data = {
      currentTarget: {
        dataset: { index: (self.data._setting.swiperIndex - 1), do_pause: true }
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
  toggleVideo: function(e) {
    Offers.toggleVideo(this, e);
  },

  // Pause video after video ended
  setPause: function(e) {
    Offers.pauseVideo(this, e);
  },

  // Switch between recipe and products
  switchTab: function(e) {
    Offers.switchTabs(this, e.currentTarget.dataset.toTab);
  },
  
  // Checkout offer
  checkout: function() {
    ModifyCart.checkoutItems(this.options.id);
  },

  // Change product amount in cart
  changeAmount: function(e) {
    ModifyCart.modifyCartItems(this, e)
  },

  onShareAppMessage: function (res) {}
})