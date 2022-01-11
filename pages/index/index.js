const { mobileLogin, showLoading } = require("../../utils/common");
const index_data = require("../../utils/constants");
const { formatTime, formatWeekDate } = require("../../utils/util");

const app = getApp();
let leave_triggered = false; // To track if leave page already triggered
let current_filter = { type: 'map', group: '', date: '' }; // Default filter for page

// Update date filter to selected or change depending on days of offers
const _setDateFilters = (page, offers, filter_date) => {
  let date_filter = page.selectComponent('#list_date_filters');
  if (current_filter.type == "map") {
    date_filter = page.selectComponent('#map_date_filter');
  }
  date_filter.updateFilter(offers, filter_date);
}

// Toggle timer intervals
const _timerControl = (page, timer_switch) => {
  let offers = page.selectComponent('#list_offers');
  if (current_filter.type == "map") {
    offers = page.selectComponent('#map_offers');
  }
  if (offers) {
    offers.changeTimers(timer_switch, page.data._t);
  }
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

  // Get data by filter group and filter date
  current_filter.group = filter_group;
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

  // Set up page data, Start new timers, Change date filters
  let callback = {
    success: res => {
      let offers = [];
      for (var i in res) {
        let offer = res[i];
        offer.started = (new Date() >= new Date(res.startingDate));
        offer.startDate = formatWeekDate(res.startingDate);
        offer.startDate = formatTime(res.startingDate);
      }

      page.setData({
        offers: res
      })
      _timerControl(page, true);
      _setDateFilters(page, res.offers, filter_date);
      showLoading(false);
    }
  };

  // Set up API
  let general_filter = `&filter={"$and":[{"$or":[{"channel":"all"},{"channel":"miniprogram"}]},{"endingDate":{"$gte":"${ new Date() }"}},{}]}`;

  // TODO get filterable dates
  if (filter_date) {
    let starting_date_filter = `{"startingDate":{"$gte":"${ new Date(filter_date).setHours(0, 0, 0, 0) }", "$lte": "${ new Date(filter_date).setHours(23,59,59,999) }"}}`;
    general_filter.replace('{}', starting_date_filter);
  }

  suffix = `?community=${filter_id}${general_filter}`;
  app.api.getOffers(suffix, callback);
}

Page({
  data: {
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
    let date = e.detail.date ? e.detail.date : '';
    console.log(data);
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
      _language: app.db.get('langauge'),
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