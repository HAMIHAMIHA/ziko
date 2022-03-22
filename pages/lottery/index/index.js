const { showLoading } = require("../../../utils/common");
const index_data = require("../../../utils/constants");
const { formatWeekDate, findIndex, mapDeliveryDates } = require("../../../utils/util");

const app = getApp();
let current_filter = { group: '', date: '' }; // Default filter for page


let timer_intervals = [];

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
      coming_soon: i18n.coming_soon,
      community: i18n.community,
      delivery: i18n.delivery,
      empty: i18n.empty,
      explore: i18n.explore,
      get_reminder: i18n.get_reminder,
      item_unit: i18n.item_unit,
      items_unit: i18n.items_unit,
      list: i18n.list,
      lottery: i18n.lottery,
      no_offers: i18n.no_offers,
      offers: i18n.offers,
      orders_unit: i18n.orders_unit,
      order_unit: i18n.order_unit,
      remaining_time: i18n.remaining_time,
      specials: i18n.specials,
      viewers: i18n.viewers,
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
  // ,{"miniprogram.lotteryEnable": "true"}
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
      [
        [{"startingDate":{"$lte":`${ now_timestamp }`}},{"endingDate":{"$lte":`${ now_timestamp }`}}],
        `["startingDate","DESC"]`
      ]
    ],
    today: [
      [
        [{"startingDate":{"$gte":`${ filter_date }`,"$lte":`${ now_timestamp }`}},{"endingDate":{"$gt":`${ now_timestamp }`}}],
        `["endingDate","ASC"]`
      ],
      [
        [{"startingDate":{"$gte":`${ filter_date }`,"$lte":`${ now_timestamp }`}},{"endingDate":{"$lte":`${ now_timestamp }`}}],
        `["startingDate","DESC"]`
      ]
    ],
    other: [
      [
        [{"startingDate":{"$gte":`${ filter_date }`, "$lte":`${ new Date(filter_date).setHours(23, 59, 59, 999) }`}},{"endingDate":{"$gt":`${ now_timestamp }`}}],
        `["endingDate","ASC"]`
      ],
      [
        [
          {"startingDate":
            {
              "$gte":`${ filter_date }`,
              "$lte":`${ new Date(filter_date).setHours(23, 59, 59, 999) }`
            }
          },{
            "endingDate":{"$lte":`${ now_timestamp }`}
          }
        ],
        `["startingDate","DESC"]`
      ]
    ],
  }


  let filter_str = filter_str_list[key][step];

  let filter_conditions = {"$and":[{"$or":[{"channel":"all"},{"channel":"miniprogram"}]}, ...filter_str[0]]}
  return filter_str ? `&filter=${JSON.stringify(filter_conditions)}&sort=${filter_str[1]}` : null;
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

  // Loading module
  showLoading(true);
  
  let raw_offers = [];

  // Set up page data, Start new timers, Change date filters
  let callback = res => {
    raw_offers = [...raw_offers, ...res];

    // // Filter only offers with lottery
    // res = res.filter(offer => {
    //   return offer.miniprogram.lotteryEnable
    // })

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

      // Modify offer data to fit page display
      offer.started = (new Date() >= new Date(offer.startingDate));
      offer.startDate = date_value;
      offer.deliveryDates = mapDeliveryDates(offer.deliveryDates);
      offer.banner = banner ? app.folders.offer_banner + banner : '';
      offers.push(offer);
    })

    page.setData({
      days: days.sort( (a,b) => { return a.timestamp - b.timestamp }),
      offers: offers
    })
    _timerControl(page, true);
    showLoading(false);
  };

  // Set up API
  suffix = `?community=${filter_id}${ _generateSuffix(0, filter_date) }`;
  app.api.getOffers(suffix).then(res => {
    // Get on going events
    raw_offers = res;

    // Set up API
    let date_suffix_str = _generateSuffix(1, filter_date);
    suffix = `?community=${ filter_id }${ date_suffix_str }`;

    if (date_suffix_str) {
      app.api.getOffers(suffix).then(callback);
    } else {
      callback([]);
    }
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
  },

  onLoad: function() {
    const self = this;
    self.filterOffers({detail: { change_date: false }});
  },

  onShow: function() {
    const self = this;
    _setPageTranslation(self);
  },

  // Filter offers by selected group
  filterOffers: function(e) {
    const self = this;
    let data = e.currentTarget ? e.currentTarget.dataset : {};

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
    const self = this;
    let data = e.currentTarget.dataset;

    if (!data.started) return;

    wx.navigateTo({
      url: app.routes.lottery_detail + '?id=' + data.offerId,
    })
  },

  onShareAppMessage: function (res) {},
})