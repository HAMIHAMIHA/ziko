const { mobileLogin, showLoading } = require("../../utils/common");
const index_data = require("../../utils/constants");
const { formatWeekDate, findIndex, mapDeliveryDates } = require("../../utils/util");

const app = getApp();
let leave_triggered = false; // To track if leave page already triggered
let current_filter = { type: 'map', group: '', date: '' }; // Default filter for page

// Reset date filter to all
const _resetDateFilters = (page) => {
  let date_filter = page.selectComponent('#list_date_filters');
  if (current_filter.type == "map") {
    date_filter = page.selectComponent('#map_date_filter');
  }
  date_filter.resetDateFilter();
}

// Toggle timer intervals
const _timerControl = (page, timer_switch) => {
  let offers = page.selectComponent('#list_offers');
  if (current_filter.type == "map") {
    offers = page.selectComponent('#map_offers');
  }
  if (offers) {
    offers.updateCards(page.data._t, timer_switch);
  }
}

// Rules for generating api url
const _generateSuffix = (step, filter_date) => {
  const start_suffix = `&filter={"$and":[{"$or":[{"channel":"all"},{"channel":"miniprogram"},{"channel":"1wechat_group"}]}`;

  let key = 'general';
  let now = new Date();
  if (filter_date) {
    let today = now.setHours(0, 0, 0, 0);
    key = (filter_date == today) ? (filter_date > today) ? 'tomorrow' : 'yesturday' : 'today';
  }

  const filter_str_list = {
    general: {
      1: [`,{"endingDate":{"$gte":"${ now }"}},{"startingDate":{"$lte":"${ now }"}}`, `["endingDate","ASC"]`],
      2: [`,{"startingDate":{"$gt":"${ now }"}},{}`, `["startingDate","ASC"]`]
    },
    today: {
      // TODO
      // filter_date.setHours(0, 0, 0, 0) < startingDate < now and now < endingDate => 1
      // startingDate > now and startingDate < filter_date.setHours(999) => 2

      // 1: [`,{"endingDate":{"$gte":"${ now }"}},{"startingDate":{"$lte":"${ now }"}}`, `["endingDate","ASC"]`],
      // 2: [`,{"startingDate":{"$gt":"${ now }"}},{}`, `["startingDate","ASC"]`]
    },
    tomorrow: {
      // TODO
      // filter_date.setHours(0, 0, 0, 0) < startingDate < filter_date.setHours(999) => 1
      // 1: [`,{"endingDate":{"$gte":"${ now }"}},{"startingDate":{"$lte":"${ now }"}}`, `["endingDate","ASC"]`]
    },
    yesturday: {
      // TODO
      // filter_date.setHours(0, 0, 0, 0) < startingDate < filter_date.setHours(999) and endingDate > now => 1
      // 1: [`,{"endingDate":{"$gte":"${ now }"}},{"startingDate":{"$lte":"${ now }"}}`, `["endingDate","ASC"]`],
    }
  }

  let filter_str = filter_str_list[key][step];
  return filter_str ? `${ start_suffix }${ filter_str[0] }]}&sort=${ filter_str[1] }` : null;
}

// Get offer data by filters
const _filterOfferData = (page, filter_type, filter_group, filter_id, filter_date) => {
  let suffix = '';

  // Stop all timers
  _timerControl(page, false);

  page.setData({
    map: (filter_type == 'map'),
    filter_group: filter_group
  })

  // Change filter type if different from current
  if (current_filter.type != filter_type) {
    current_filter.type = filter_type;
  }

  // Reset date filter if filter type and filter group different from current
  if (current_filter.type != filter_type && current_filter.group != filter_id) {
    _resetDateFilters(self);
  }

  // Get data by filter group and filter date
  current_filter.group = filter_id;
  current_filter.date = filter_date;

  if (filter_type == 'map') {
    if (!filter_group) {
      // If filter type = map, group == null => clear data and return
      page.setData({ filter_group: '', offers: {} })
      return;
    }
  }

  // Loading module
  showLoading(true);
  
  let raw_offers = [];

  // Set up page data, Start new timers, Change date filters
  let callback = {
    success: res => {
      raw_offers = raw_offers.concat(res);

      let offers = [];
      let days = page.data.days;
      if (!filter_date) {
        days = []; // create list for date picker
      }
      // console.log(res);

      for (var i in raw_offers) {
        let offer = raw_offers[i];
        let date_value = formatWeekDate(offer.startingDate);

        // Creating date filter list
        if (!filter_date && findIndex(days, date_value.timestamp, "timestamp") == -1) {
          days.push(date_value);
        }

        // Modify offer data to fit page display
        offer.started = (new Date() >= new Date(offer.startingDate));
        offer.startDate = date_value;
        offer.deliveryDates = mapDeliveryDates(offer.deliveryDates);
        offer.banner = app.folders.offer_banner + offer.banner[page.data._language].uri
        offers.push(offer);
      }

      page.setData({
        days: days,
        offers: offers
      })
      _timerControl(page, true);
      // _setDateFilters(page, res.offers, filter_date);
      showLoading(false);
    }
  };

  // Get on going events
  let firstCallback = {
    success: res => {
      // console.log(res);
      raw_offers = res;

      // Set up API
      suffix = `?community=${ filter_id }${ _generateSuffix(2, filter_date) }`;

      if (suffix) {
        app.api.getOffers(suffix, callback);
      } else {
        callback.success([]);
      }
    }
  }

  // Set up API
  suffix = `?community=${filter_id}${ _generateSuffix(1, filter_date) }`;
  app.api.getOffers(suffix, firstCallback);
}

Page({
  data: {
    filter_group: '',
    map: true // Default open to map view
  },

  onShow: function() {
    const self = this;

    leave_triggered = false;
    self.updatePageLanguage();

    // Set page default values
    self.setData({
      _filters: {
        list: index_data.list_filter,
        map: index_data.map_filters
      },
      user: app.db.get('userInfo').user
    })
  },

  onHide: function(e) {
    const self = this;
    self.navigatePage({ detail: {} });
  },

  // Mobile login
  getPhoneNumber: function(e) {
    mobileLogin(this, e.detail.code);
    // TODO api to get user phone -> user name + code + openid
  },

  // Close modal or reset page view to map when leaving page by tabbar click
  navigatePage: function(e) {
    const self = this;

    if (leave_triggered) {
      return;
    } else if (e.detail.navigating) {
      leave_triggered = true;
      return;
    }

    self.closeMapModal();
  },

  // Switch display method
  switchType: function(e) {
    const self = this;

    // Check if changing to the map view
    let data = e.currentTarget.dataset;
    _filterOfferData(self, data.type, data.group, '', '');
  },

  // Filter offers by selected group
  filterOffers: function(e) {
    const self = this;
    let data = e.currentTarget.dataset;

    // Set up filtering items if just changing date
    if (JSON.stringify(data) == '{}') {
      data = {
        filter_type: current_filter.type,
        filter_group: index_data.communities[current_filter.group],
        filter_id: current_filter.group,
      }
    }

    // Get filtering date value
    let date = e.detail.date ? e.detail.date : '';
  
    // Filter
    _filterOfferData(self, data.filter_type, data.filter_group, data.filter_id, date);
  },

  // Close modal for map list
  closeMapModal: function() {
    const self = this;
    _filterOfferData(self, 'map', '', '', '');
  },

  updatePageLanguage: function() {
    const self = this;

    // Translate tabbar
    app.setTabbar();

    // Translation and default values
    let i18n = app.globalData.i18n;
    self.setData({
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
        offers: i18n.offers,
        orders_unit: i18n.orders_unit,
        order_unit: i18n.order_unit,
        remaining_time: i18n.remaining_time,
        specials: i18n.specials,
        viewers: i18n.viewers,
        // TODO days of week
      }
    })
  },

  // Stop slide action at the back when modal is opened
  preventSlide: function() {},
  onShareAppMessage: function (res) {},
})