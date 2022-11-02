const {
  showLoading
} = require("../../../utils/common.js");
const index_data = require("../../../utils/constants.js");
const {
  formatWeekDate,
  findIndex,
  mapDeliveryDates
} = require("../../../utils/util.js");
const Offers = require('../../../templates/offer/getOffers.js');

const {
  getRulePrice
} = require("../../../templates/offer/offerRules");

const app = getApp();
let _refresh_data = true,
  _leave_triggered = false;

let current_filter = {
  group: '',
  type: 'general'
}; // Default filter for page
let timer_intervals = [];
let raw_offers = [],
  lotteries = [],
  orders = [];

const _setPageTranslation = function (page) {
  // Translate tabbar
  // app.setTabbars();
  // Translation and default values
  let i18n = app.globalData.i18n;

  wx.setNavigationBarTitle({
    title: i18n.lottery,
  })

  page.setData({
    _language: app.db.get('language'),
    _t: {
      all: i18n.all,
      closed: i18n.closed,
      community: i18n.community,
      no_offers: i18n.no_offers,
      tickets: i18n.tickets,
      remaining_draws: i18n.remaining_draws,
      time_remaining: i18n.time_remaining,
      you_win: i18n.you_win,
      ziko_lottery: i18n.ziko_lottery,
      lorem_ipsum_dolor: i18n.lorem_ipsum_dolor,
      got_it: i18n.got_it,
      past_luck: i18n.past_luck,
      still_a_chance: i18n.still_a_chance,
      lottery_selected: i18n.lottery_selected,
      past_luck: i18n.past_luck,
      chances: i18n.chances,
      to_win: i18n.to_win,
      draws: i18n.draws,
      locked: i18n.locked,
      tickets: i18n.tickets,
      time_remaining: i18n.time_remaining,
      day: i18n.day,
      access_the_offer: i18n.access_the_offer,
      prizes: i18n.prizes,
      congrats: i18n.congrats,
      you_won: i18n.you_won,
      orders: i18n.orders,
      items: i18n.items,
    }
  })
}

// Toggle timer intervals
const _timerControl = (page, timer_switch) => {
  // Set offer card contents
  let timer = page.selectAllComponents('.timer');
  // Start or end timers
  if (timer_switch) {
    for (var i in timer) {
      timer_intervals.push(timer[i].setTimer([], timer_switch));
    }
  } else {
    if (timer.length == 0) return;

    timer[0].setTimer(timer_intervals, timer_switch);
    timer_intervals = [];
  }
}

// Rules for generating api url
const _generateSuffix = (step, filter_type) => {
  let key = 'general';
  let now = new Date();
  let now_timestamp = now.getTime();
  let past = new Date();
  past.setDate(past.getDate() - 30);
  let past_timestamp = past.getTime();

  if (filter_type) {
    key = (filter_type === 'past') ? 'past' : 'general';
  }

  const filter_str_list = {
    general: [
      [
        [{
          "startingDate": {
            "$lte": `${ now_timestamp }`
          }
        }, {
          "endingDate": {
            "$gt": `${ now_timestamp }`
          }
        }],
        `["endingDate","ASC"]`
      ],
    ],
    past: [
      [
        [{
          "endingDate": {
            "$gte": `${ past_timestamp }`,
            "$lte": `${ now_timestamp }`
          }
        }],
        `["endingDate","ASC"]`
      ],
    ],
  }
  let filter_str = filter_str_list[key][step];
  let filter_conditions = {
    "$and": [{
      "$or": [{
        "channel": "all"
      }, {
        "channel": "miniprogram"
      }]
    }, {
      "miniprogram.lotteryEnable": "true"
    }, ...filter_str[0]]
  }
  return filter_str ? `&filter=${JSON.stringify(filter_conditions)}&sort=${filter_str[1]}` : null;
}

const _setOffers = (page) => {
  let offers = [];

  raw_offers.forEach(offer => {
    let date_value = formatWeekDate(offer.startingDate);

    let banner = '';
    if (offer.banner) {
      if (offer.banner[app.db.get('language')]) {
        banner = offer.banner[app.db.get('language')].uri;
      } else if (app.db.get('language') === 'zh' && offer.banner.en) {
        banner = offer.banner.en.uri;
      } else if (app.db.get('language') === 'en' && offer.banner.zh) {
        banner = offer.banner.zh.uri;
      }
    }

    let lotteryIds = [];
    offer.miniprogram.lottery.draws.forEach(d => {
      lotteryIds.push(d._id);
    })

    let lottery_drawn = lotteries.filter(l => {
      return (l.offer.id === offer.id) && l.winners.length && (lotteryIds.findIndex(i => l.offerDrawId === i) > -1)
    });
    let offer_orders = orders.filter(o => {
      return o.offer.id === offer.id
    });
    let wins = offer_orders.filter(o => {
      return o.gifts.filter(g => g.origin === 'lottery').length;
    });

    let offer_tickets = 0;
    if (offer_orders.length > 0) {
      offer_orders.forEach(o => offer_tickets += o.ticketAmount)
    }

    let offer_gifts = 0;
    if (offer.miniprogram.lottery.draws.length > 0) {
      offer.miniprogram.lottery.draws.map(draw => {
        offer_gifts = offer_gifts + draw.gifts.length;
      })
    }

    // Modify offer data to fit page display
    offer.ended = (new Date() >= new Date(offer.endingDate));
    offer.startDate = date_value;
    offer.deliveryDates = mapDeliveryDates(offer.deliveryDates);
    offer.banner = banner ? app.folders.offer_banner + banner : '';
    offer.lotteries = {
      remaining_draws: (offer.miniprogram.lottery.draws.length - lottery_drawn.length),
      win: wins.length > 0,
      draws: offer_tickets,
      gifts: offer_gifts,
    }

    offer.sold = 0;
    // Product / Pack name
    let offer_products = [...offer.miniprogram.items, ...offer.miniprogram.packs];
    offer_products.forEach(p => {
      offer.sold += (p.stock - p.actualStock);

      // Check for and Change all free fall product price 
      if (offer.type === "free_fall" && p.freeFall && p.freeFall.quantityTrigger) {
        getRulePrice("free_fall", offer.id, p);
      }

      // Check for multiple price
      if (offer.type === "multiple_items" && p.multipleItem && p.multipleItem.length > 0) {
        getRulePrice("multiple", offer.id, p)
      }
    })

    // Lottery detail
    if (offer.miniprogram.lotteryEnable && offer.miniprogram.lottery.draws.length) {
      offer.miniprogram.lottery.draws.sort((a, b) => {
        return a.conditionValue - b.conditionValue;
      })

      offer.last_val = offer.miniprogram.lottery.draws[offer.miniprogram.lottery.draws.length - 1].conditionValue;

      offer = Offers._setLotteryDraws(offer, null);
      offers.push(offer);
    }

    // offers.push(offer);
  })

  page.setData({
    offers: offers
  })
  _timerControl(page, true);
  showLoading(false);
}

// Get offer data by filters
const _filterOfferData = (page, filter_group, filter_id, filter_type) => {
  let suffix = '';

  // Stop all timers
  _timerControl(page, false);

  page.setData({
    filter_group: filter_group || "",
  })

  // Get data by filter group and filter date
  current_filter.group = filter_id;
  current_filter.type = filter_type;

  // Set up API
  suffix = `?community=${filter_id}${ _generateSuffix(0, filter_type) }`;
  app.api.getOffers(suffix).then(res => {
    // Get on going events
    raw_offers = res;
    app.api.getLotteries().then(res => {
      lotteries = res;

      // Get user orders if user is logged in
      if (page.data.user?.id) {
        app.api.getOrders({
          filter_str: `channel=miniprogram&paymentStatus=paid`
        }).then(res => {
          orders = res;
          _setOffers(page);
        })
      } else {
        _setOffers(page);
      }
    })
  });
}

Page({
  data: {
    _folders: {
      asset: app.folders.asset
    },
    filter_group: '',
    _filters: {
      list: index_data.list_filter
    },
    _communities: index_data.communities,
    first_show: app.db.get('lotteryShow'),
    lottery_logo: "/assets/images/zikoland.svg",
    lottery_content: [{
      numb: "i0",
      name: "bottle-1",
      src: "/assets/icons/bottle.svg"
    }, {
      numb: "i1",
      name: "cheese-1",
      src: "/assets/icons/cheese.svg"
    }, {
      numb: "i2",
      name: "fruit-1",
      src: "/assets/icons/fruit.svg"
    }, {
      numb: "i3",
      name: "noodle-1",
      src: "/assets/icons/noodle.svg"
    }, {
      numb: "i4",
      name: "Vector-1",
      src: "/assets/icons/Vector.svg"
    }, {
      numb: "i5",
      name: "bottle-2",
      src: "/assets/icons/bottle.svg"
    }, {
      numb: "i6",
      name: "cheese-2",
      src: "/assets/icons/cheese.svg"
    }, {
      numb: "i7",
      name: "fruit-2",
      src: "/assets/icons/fruit.svg"
    }, {
      numb: "i8",
      name: "noodle-2",
      src: "/assets/icons/noodle.svg"
    }, {
      numb: "i9",
      name: "Vector-2",
      src: "/assets/icons/Vector.svg"
    }, ],
    type: 'general',
  },

  onShow: function () {
    const self = this;
    _setPageTranslation(self);

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    _leave_triggered = false;
    if (_refresh_data) {
      showLoading(true);
      app.sessionUtils.getUserInfo(self);
      self.filterOffers({
        detail: {
          change_date: false
        }
      });
    }
  },

  onReady: function () {
    this.animate_state_change()
  },

  onHide: function () {
    if (_leave_triggered) return;
    _refresh_data = true;
    _timerControl(this, false);
  },

  onUnload: function () {
    _refresh_data = true;
    _timerControl(this, false);
  },

  // Filter offers by selected group
  filterOffers: function (e) {
    const self = this;
    let data = e.currentTarget ? e.currentTarget.dataset : {};

    showLoading(true);
    // Set up filtering items if just changing date
    if (JSON.stringify(data).indexOf('_type') == -1) {
      data = {
        filter_group: index_data.communities[current_filter.group],
        filter_id: current_filter.group,
      }
    }

    // Get filtering type value
    let type = '';
    if (e.currentTarget && e.currentTarget.dataset.type) {
      type = e.currentTarget.dataset.type;
    } else {
      type = 'general';
    }
    self.setData({
      type: type,
    })

    // Filter
    _filterOfferData(self, data.filter_group, data.filter_id, type);
  },

  // To lottery detail
  toLottery: function (e) {
    let data = e.currentTarget.dataset;
    _refresh_data = false;
    _leave_triggered = true;
    wx.navigateTo({
      url: app.routes.lottery_detail + '?id=' + data.offerId,
    })
  },

  onShareAppMessage: function (res) {},

  animate_state_change: function () {
    setTimeout(() => {
      this.setData({
        showid1: "i6",
      })
    }, 500)
    setTimeout(() => {
      this.setData({
        showid2: "i7",
      })
    }, 800)
    setTimeout(() => {
      this.setData({
        showid3: "i8",
      })
    }, 1100)
  },

  animationend: function () {
    setTimeout(() => {
      this.setData({
        showid1: "i0",
        showid2: "i0",
        showid3: "i0",
      })
    }, 5000)
  },

  close_firstshow: function () {
    app.db.set('lotteryShow', false)
    this.setData({
      first_show: false
    })
  },
})