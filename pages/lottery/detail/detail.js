import { getUserInfo, showLoading } from "../../../utils/common";
import { communities } from "../../../utils/constants";

const app = getApp();
let countdown_timer = [];

// Translate page content
const _setPageTranslation = function(page) {
  // Translation and default values
  let i18n = app.globalData.i18n;

  wx.setNavigationBarTitle({
    title: i18n.lottery_detail,
  })

  page.setData({
    _language: app.db.get('language'),
    _t: {
      closed: i18n.closed,
      community: i18n.community,
      go_to_offer: i18n.go_to_offer,
      remaining_time: i18n.remaining_time,
      terms_and_conditions: i18n.terms_and_conditions,
      your_tickets: i18n.your_tickets,
    },
    _t_lottery: {
      extra_ticket: i18n.extra_ticket,
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      rmb: i18n.rmb,
      ticket: i18n.ticket,
    },
    _t_prize: {
      draw: i18n.draw,
      item_quantity: i18n.item_quantity,
      lottery_prizes: i18n.lottery_prizes,
      lottery_stages: i18n.lottery_stages,
      no_winner_yet: i18n.no_winner_yet,
      offer_special_details: i18n.offer_special_details,
      offer_special_names: i18n.offer_special_names,
      orders: i18n.orders,
      quantity_bottle_sold: i18n.quantity_bottle_sold,
      unlocked: i18n.unlocked,
      winner: i18n.winner,
      you_win: i18n.you_win,
    }
  })
}

// Clear countdown timer interval
const _clearCountdown = (page, countdown_timer) => {
  let timer = page.selectComponent('#countdown');
  timer.setTimer(countdown_timer, false);
  return [];
}

// Get Offer
const _getOffer = function(page, offer_id) {
  let offer = {};

  const callback = res => {
    console.log(res);
    offer.community = communities[offer.community.id];
    offer.ended = (new Date() >= new Date(offer.endingDate));

    page.setData({
      _offer: offer
    })
 
    if (!offer.ended) {
      page.startCountdown();
    }
    showLoading(false);
  }

  showLoading(true);
  // Get product by offer id
  app.api.getOffers(`?id=${offer_id}`).then( res => {
    offer = res[0];
    app.api.getLotteries(`offer=${offer_id}`).then(callback);
  });
}

Page({
  onLoad: function() {
    const self = this;
    getUserInfo(self);
  },

  onShow: function () {
    const self = this;
    _setPageTranslation(self);
    _getOffer(self, self.options.id);
  },

  // Start countdown timer
  startCountdown: function() {
    // Start countdown
    let timer = this.selectComponent('#countdown');
    countdown_timer.push(timer.setTimer([], true));
  },

  onHide: function() {
    countdown_timer = _clearCountdown(this, countdown_timer);
  },

  onUnload: function() {
    countdown_timer = _clearCountdown(this, countdown_timer);

    // unload offer page
    let pages = getCurrentPages();
    let previous_page = pages[pages.length - 2];
    (previous_page && previous_page.filterOffers) ? previous_page.filterOffers({}) : '';
  },

  onShareAppMessage: function () {},
})