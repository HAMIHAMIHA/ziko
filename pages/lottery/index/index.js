const { showLoading, getUserInfo } = require("../../../utils/common");
const index_data = require("../../../utils/constants");
const { formatWeekDate, findIndex, mapDeliveryDates } = require("../../../utils/util");

const app = getApp();
let _refresh_data = true, _leave_triggered = false;

let current_filter = { group: '', date: '' }; // Default filter for page
let timer_intervals = [];
let raw_offers = [], lotteries = [], orders = [];

const _setPageTranslation = function(page) {
  // Translate tabbar
  app.setTabbar();
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
      remaining_time: i18n.remaining_time,
      you_win: i18n.you_win,
    }
  })
}

// Reset date filter to all
const _resetDateFilters = (page, new_list) => {
  let date_filter = page.selectComponent('#list_date_filters');

  // Set seleted data to all
  if (date_filter) {
    date_filter.resetDateFilter();
  }

  // Remove days list for refresh
  if (new_list) {
    page.setData({
      days: []
    })
  }
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
const _generateSuffix = (step, filter_date) => {
  let key = 'general';
  let now = new Date();
  let now_timestamp = now.getTime();

  if (filter_date) {
    let today = now.setHours(0, 0, 0, 0);
    key = (filter_date === today) ? 'today' : 'other';
  }

  const filter_str_list = {
    general: [
      [
        [{"startingDate":{"$lte":`${ now_timestamp }`}},{"endingDate":{"$gt":`${ now_timestamp }`}}],
        `["endingDate","ASC"]`
      ],
    ],
    today: [
      [
        [{"startingDate":{"$gte":`${ filter_date }`,"$lte":`${ now_timestamp }`}},{"endingDate":{"$gt":`${ now_timestamp }`}}],
        `["endingDate","ASC"]`
      ],
    ],
    other: [
      [
        [{"startingDate":{"$gte":`${ filter_date }`, "$lte":`${ new Date(filter_date).setHours(23, 59, 59, 999) }`}},{"endingDate":{"$gt":`${ now_timestamp }`}}],
        `["endingDate","ASC"]`
      ],
    ],
  }
  let filter_str = filter_str_list[key][step];
  let filter_conditions = {"$and":[{"$or":[{"channel":"all"},{"channel":"miniprogram"}]},{"miniprogram.lotteryEnable":"true"}, ...filter_str[0]]}
  return filter_str ? `&filter=${JSON.stringify(filter_conditions)}&sort=${filter_str[1]}` : null;
}

const _setOffers = (page, filter_date) => {
  let offers = [];
  let days = page.data.days;
  if (!filter_date) {
    days = []; // create list for date picker
  }

  raw_offers.forEach( offer => {
    let date_value = formatWeekDate(offer.startingDate);

    // Creating date filter list
    if (!filter_date && findIndex(days, date_value.timestamp, "timestamp") == -1) {
      days.push(date_value);
    }

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
    offer.miniprogram.lottery.draws.forEach( d => {
      lotteryIds.push(d._id);
    })

    let lottery_drawn = lotteries.filter( l => { return (l.offer.id === offer.id) && l.winners.length && (lotteryIds.findIndex(i => l.offerDrawId === i ) > -1) });
    let offer_orders = orders.filter( o => { return o.offer.id === offer.id });
    let wins = offer_orders.filter( o => {
      return o.gifts.filter( g => g.origin === 'lottery').length;
    });

    let offer_tickets = 0;
    if (offer_orders.length > 0) {
      offer_orders.forEach( o => offer_tickets += o.ticketAmount)
    }

    // Modify offer data to fit page display
    offer.ended = (new Date() >= new Date(offer.endingDate));
    offer.startDate = date_value;
    offer.deliveryDates = mapDeliveryDates(offer.deliveryDates);
    offer.banner = banner ? app.folders.offer_banner + banner : '';
    offer.lotteries = {
      remaining_draws: (offer.miniprogram.lottery.draws.length - lottery_drawn.length),
      win: wins.length > 0,
      draws: offer_tickets
    }
    offers.push(offer);
  })

  page.setData({
    days: days.sort( (a,b) => { return a.timestamp - b.timestamp }),
    offers: offers
  })
  _timerControl(page, true);
  showLoading(false);
}

// Get offer data by filters
const _filterOfferData = (page, filter_group, filter_id, filter_date) => {
  let suffix = '';

  // Stop all timers
  _timerControl(page, false);

  page.setData({
    filter_group: filter_group,
  })

  // Reset date filter if filter type and filter group different from current
  if (!filter_date) {
    _resetDateFilters(page, current_filter.group != filter_id);
  }

  // Get data by filter group and filter date
  current_filter.group = filter_id;
  current_filter.date = filter_date;

  // Set up API
  suffix = `?community=${filter_id}${ _generateSuffix(0, filter_date) }`;
  app.api.getOffers(suffix).then(res => {
    // Get on going events
    raw_offers = res;
    app.api.getLotteries().then( res => {
      lotteries = res;

      // Get user orders if user is logged in
      if (page.data.user.id) {
        app.api.getOrders({
          filter_str: `channel=miniprogram&paymentStatus=paid`
        }).then( res => {
          orders = res;
          _setOffers(page, filter_date);
        })
      } else {
        _setOffers(page, filter_date);
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
    _communities: index_data.communities
  },

  onShow: function() {
    const self = this;
    _setPageTranslation(self);

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    _leave_triggered = false;
    if (_refresh_data) {
      showLoading(true);
      getUserInfo(self);
      self.filterOffers({detail: { change_date: false }});
    }
  },

  onHide: function() {
    if (_leave_triggered) return;
    _refresh_data = true;
    _timerControl(this, false);
  },

  onUnload: function() {
    _refresh_data = true;
    _timerControl(this, false);
  },

  // Filter offers by selected group
  filterOffers: function(e) {
    const self = this;
    let data = e.currentTarget ? e.currentTarget.dataset : {};

    showLoading(true);
    // Set up filtering items if just changing date
    if (JSON.stringify(data) == '{}') {
      data = {
        filter_group: index_data.communities[current_filter.group],
        filter_id: current_filter.group,
      }
    }

    // Get filtering date value
    let date = (e.detail && e.detail.change_date) ? e.detail.date : '';
  
    // Filter
    _filterOfferData(self, data.filter_group, data.filter_id, date);
  },

  // To lottery detail
  toLottery: function(e) {
    let data = e.currentTarget.dataset;
    _refresh_data = false;
    _leave_triggered = true;
    wx.navigateTo({
      url: app.routes.lottery_detail + '?id=' + data.offerId,
    })
  },

  onShareAppMessage: function (res) {},
})