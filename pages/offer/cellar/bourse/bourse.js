const { mobileLogin, getWxUserInfo } = require("../../../../utils/common");
const { bourse_colors } = require('../../../../utils/constants.js');
const animate = require('../../../../templates/offer/animation.js').tabbar;
const Offers = require('../../../../templates/offer/getOffers.js');
const ModifyCart = require('../../../../templates/offer/modifyCart.js');

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
    }
  },

  onShow: function () {
    const self = this;
    // Get Offer
    Offers.getOffer(self, self.options.id);
  
    // Message counts
    let messageIndex = []
  },

  // Stop countdown timer on leaving page
  onHide: function() {
    countdown_timer = Offers._clearCountdown(this, countdown_timer);
  },
  onUnload: function() {
    countdown_timer = Offers._clearCountdown(this, countdown_timer);
    Offers.unloadOfferPage();
  },

  // Set bourse style
  setBourseGraph: function(offer) {
    const self = this;
    const colors = bourse_colors;
    /*
    // Cellar Lottery detail
    if (offer.miniprogram.lotteryEnable && offer.community === "cellar" && offer.miniprogram.lottery.draws.length > 0) {
      

      offer.last_val = offer.miniprogram.lottery.draws[offer.miniprogram.lottery.draws.length - 1].conditionValue;
      if ( offer.miniprogram.lottery.draws[0].conditionType === "number_of_order" ) {
        offer.lottery_progress = Math.round(offer.orders / offer.last_val * 100);
      } else {
        offer.lottery_progress = Math.round(offer.sold / offer.last_val * 100);
      }

      let prev = 0;
      offer.miniprogram.lottery.draws.forEach( draw => {
        let winners = [];
        lotteries.forEach( l => {
          if (l.offerDrawId === draw._id){
            l.winners.forEach( w => {
              if (w.order && w.order.customer && winners.findIndex( winner => { return winner.id === w.order.customer.id }) === -1) {
                winners.push(w.order.customer);
              }
            })
          }
        });
  
        // Set size of axis mark
        draw.position = Math.round(draw.conditionValue / offer.last_val * 100);
        prev = draw.conditionValue
  
        draw.winners = winners
        draw.unlocked = ((draw.conditionType === "number_of_order" && offer.orders >= draw.conditionValue) ||  (draw.conditionType === "x_item_sold" && offer.sold >= draw.conditionValue));
      })

      offer.miniprogram.lottery.draws = [{
        conditionValue: 0,
        position: 0,
        _id: '000'
      }, ...offer.miniprogram.lottery.draws]
    }
    */

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

    // linear-gradient(90deg, rgba(241,184,95,1) 0%, rgba(213,153,189,1) 1%, rgba(109,189,180,1) 3%, rgba(108,179,231,1) 5%, rgba(129,129,229,1) 10%, rgba(231,138,148,1) 15%);

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

    console.log(bourses);

    self.setData({
      _bourse_info: {
        progress,
        list: bourses,
        bg_color: `linear-gradient(90deg, ${ bg_list.join(', ') })`
      }
    })
  },

  // Mobile login
  getPhoneNumber: function(e) {
    mobileLogin(this, e.detail.code, this.checkout);
  },

  // Get user profile if not logged in
  getUserProfile: function() {
    getWxUserInfo(this);
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
    self.setData({
      "_setting.swiperIndex": (e.detail.current) + 1,
    })
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