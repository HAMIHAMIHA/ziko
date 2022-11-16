const { showLoading } = require("../../../utils/common.js");
const { communities } = require("../../../utils/constants.js");

const app = getApp();
let countdown_timer = [];
let purchase_timer;

const getOfferBuyers = (page, offer_id) => {
  let offer = page.data._offer;

  const callback = res => {
    // Check if there is a new purchase and update page contents
    if (res.length === offer.orders) return;

    // Update offer orders amount
    offer.orders = res.length;

    let new_sold = 0;
    res.forEach( order => {
      order.cart.forEach( item => {
        // Calculate newly sold amount
        new_sold += item.amount;

        // Check if winner of lottery
        order.gifts.forEach( g => {
          let draw_idx = offer.miniprogram.lottery.draws.findIndex( d => g.offerDrawId === d._id);
          offer.miniprogram.lottery.draws[draw_idx].winners = [{
            name: order.name,
            profilePicture: order.profilePicture,
            id: order.customer,
          }]
        });
      })
    })

    offer.sold = new_sold; // Update offer total sold

    // Check for lottery draw unlocked
    offer.miniprogram.lottery.draws.forEach( (draw, i) => {
      offer.miniprogram.lottery.draws[i].unlocked = ((draw.conditionType === "number_of_order" && offer.orders >= draw.conditionValue) ||  (draw.conditionType === "x_item_sold" && offer.sold >= draw.conditionValue));
    })

    // Update bottle filled
    if ( offer.miniprogram.lottery.draws[1].conditionType === "number_of_order" ) {
      offer.lottery_progress = Math.round(offer.orders / offer.last_val * 100);
    } else {
      offer.lottery_progress = Math.round(offer.sold / offer.last_val * 100);
    }

    // Set page data
    page.setData({
      _offer: offer,
    })

    // Refresh components
    page.selectComponent('#lottery_list').refresh(offer);
  }

  app.api.getOfferBuyers(offer_id).then(callback);
}

const startBuyerInterval = (page, offer_id) => {
  purchase_timer = setInterval( () => {
    if (new Date(page.data._offer.endingDate) > new Date()) {
      getOfferBuyers(page, offer_id);
    } else {
      clearInterval(purchase_timer);
    }
  }, 1000)
}

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
      time_remaining: i18n.time_remaining,
      your_tickets: i18n.your_tickets,
    },
    _t_lottery: {
      extra_ticket: i18n.extra_ticket,
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      rmb: i18n.rmb,
      ticket: i18n.ticket,
      order_unit: i18n.order_unit,
      orders: i18n.orders
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
  if (page.data._offer && page.data._offer.ended) return;
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

    // Sort order of draws occurence
    offer.miniprogram.lottery.draws.sort( (a, b) => {
      return a.conditionValue - b.conditionValue;
    })

    offer.last_val = offer.miniprogram.lottery.draws[offer.miniprogram.lottery.draws.length - 1].conditionValue;
    if ( offer.miniprogram.lottery.draws[0].conditionType === "number_of_order" ) {
      offer.lottery_progress = Math.round(offer.orders / offer.last_val * 100);
    } else {
      offer.lottery_progress = Math.round(offer.sold / offer.last_val * 100);
    }

    offer.miniprogram.lottery.draws.forEach( (draw,index) => {
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
      //The progress bar is evenly distributed
      // draw.position = Math.round((index+1) / (offer.miniprogram.lottery.draws.length) * 100);
      draw.position = Math.round(draw.conditionValue / offer.last_val * 100);

      // Draw status and winner
      draw.winners = winners
      draw.unlocked = ((draw.conditionType === "number_of_order" && offer.orders >= draw.conditionValue) ||  (draw.conditionType === "x_item_sold" && offer.sold >= draw.conditionValue));
    })

    offer.miniprogram.lottery.draws = [{
        conditionValue: 0,
        position: 0,
        _id: '000'
      }, ...offer.miniprogram.lottery.draws]

    let tickets = 0;
    res.forEach(order => {
      tickets += order.ticketAmount;
    });

    page.setData({
      _current_user: app.db.get('userInfo').customer?.id || "",
      _offer: offer,
      _product_names: product_name_list,
      _tickets: tickets,
    })
 
    if (!offer.ended) {
      page.startCountdown();
      getOfferBuyers(page, offer_id);
      startBuyerInterval(page, offer_id);
    }
    showLoading(false);
  }

  showLoading(true);
  // Get product by offer id
  app.api.getOffers(`?id=${offer_id}`).then( res => {
    offer = res[0];
    offer.orders = offer.miniprogramOrders;

    app.api.getLotteries(`offer=${offer_id}`).then( res => {
      lotteries = res;

      if (app.db.get('userInfo') && app.db.get('userInfo').token) {
        app.api.getOrders({ filter_str: `offer=${offer_id}` }).then(setPageData)
      } else {
        setPageData([]);
      }
    });
  });
}

Page({
  onLoad: function() {
    const self = this;
    app.sessionUtils.getUserInfo(self);
  },

  onShow: function () {
    const self = this;
    _setPageTranslation(self);

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

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
    if (data.community === "cellar" && data.type && data.type !== "regular") {
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