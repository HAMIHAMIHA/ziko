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
      _language: app.db.get('language'),
      draw: i18n.draw,
      item_quantity: i18n.item_quantity,
      locked: i18n.locked,
      lottery_prizes: i18n.lottery_prizes,
      lottery_stages: i18n.lottery_stages,
      no_winner_yet: i18n.no_winner_yet,
      offer_special_details: i18n.offer_special_details,
      offer_special_names: i18n.offer_special_names,
      orders: i18n.orders,
      quantity_bottle_sold: i18n.quantity_bottle_sold,
      terms_and_conditions: i18n.terms_and_conditions,
      unlocked: i18n.unlocked,
      winner: i18n.winner,
      you_win: i18n.you_win,
    }
  })
}

// Clear countdown timer interval
const _clearCountdown = (page, countdown_timer) => {
  if (page.data._offer.ended) return;
  let timer = page.selectComponent('#countdown');
  timer.setTimer(countdown_timer, false);
  return [];
}

// Get Offer
const _getOffer = function(page, offer_id) {
  let offer = {}, lotteries = [];

  const setPageData = res => {
    offer.community = communities[offer.community.id];
    offer.ended = (new Date() >= new Date(offer.endingDate));
    offer.started = (new Date() >= new Date(offer.startingDate));

    offer.sold = 0;
    let product_name_list = {};
    [...offer.miniprogram.packs, ...offer.miniprogram.items].forEach( item => {
      offer.sold += (item.stock - item.actualStock);
      let p_name = '';
      if (item.products) {
        p_name = `${item.name[app.db.get('language')]}`;
      } else {
        p_name = `${item.product.name[app.db.get('language')]}`;
      }
      product_name_list[item.shortName] = p_name;
    })

    offer.miniprogram.lottery.draws.sort( (a, b) => {
      return a.conditionValue - b.conditionValue;
    })

    offer.last_val = offer.miniprogram.lottery.draws[offer.miniprogram.lottery.draws.length - 1].conditionValue;
    if ( offer.miniprogram.lottery.draws[0].conditionType === "number_of_order" ) {
      offer.lottery_progress = offer.orders / offer.last_val * 100;
    } else {
      offer.lottery_progress = offer.sold / offer.last_val * 100;
    }

    let prev = 0;
    offer.miniprogram.lottery.draws.forEach( draw => {
      let winners = [];
      lotteries.forEach( l => {
        if (l.offerDrawId === draw._id){
          winners.push(...l.winners)
        }
      });

      // Set size of axis mark
      draw.size = (draw.conditionValue - prev + 1) / offer.last_val * 100;
      prev = draw.conditionValue

      draw.winners = winners
      draw.unlocked = ((draw.conditionType === "number_of_order" && offer.orders >= draw.conditionValue) ||  (draw.conditionType === "x_item_sold" && offer.sold >= draw.conditionValue));
    })

    offer.miniprogram.lottery.draws = [{
        conditionValue: 0,
        size: 1 / offer.last_val * 100,
        _id: '000'
      }, ...offer.miniprogram.lottery.draws]

    let tickets = 0;
    res.forEach(order => {
      tickets += order.ticketAmount;
    });

    page.setData({
      _offer: offer,
      _product_names: product_name_list,
      _tickets: tickets,
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
    app.api.getLotteries(`offer=${offer_id}`).then( res => {
      lotteries = res;
      app.api.getOrders({ filter_str: `offer=${offer_id}` }).then(setPageData)
    });
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

  // Navigate to offer page
  toOffer: function(e) {
    const self = this;
    let data = e.currentTarget.dataset;

    if (!data.started) return;

    var url = app.routes.offer_regular;
    if (data.community === "cellar") {
      if (data.type == "bourse") {
        url = app.routes.offer_bourse;
      } else {
        url = app.routes.offer_cellar;
      }
    }

    self.triggerEvent('navigatePage', { navigating: true });  

    wx.navigateTo({
      url: url + '?id=' + data.offerId,
    })
  },

  onShareAppMessage: function () {},
})