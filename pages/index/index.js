const index_data = require("./indexData");
const { offer_data } = require("./indexData"); // TEMP

const app = getApp();

let leave_triggered = false;

// Default filter for page
let current_filter = {
  type: 'map',
  group: '',
  date: ''
};

// TEMP for testing default to list
// let current_filter = {
//   type: 'list',
//   group: 'all',
//   date: ''
// };

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
    offers.changeTimers(timer_switch);
  }
}

// Get offer data by filters
const _filterOfferData = (page, filter_type, filter_group, filter_date) => {
  let suffix = '';
  let successCallback = res => {};

  // 1. Stop all timers
  _timerControl(page, false);

  // 2. Change filter type if different from current
  if (current_filter.type != filter_type) {
    page.setData({
      map: (filter_type == 'map'),
      filter_group: filter_group
    })
    current_filter.type = filter_type;
  }

  // 3. Get data by filter group and filter date
  current_filter.group = filter_group;
  current_filter.date = filter_date;

  if (filter_type == 'map') {
    if (!filter_group) {
      // If filter type = map, group == null => clear data and return
      page.setData({
        filter_group: '',
        offers: {}
      })
      return;
    } else {
      // If filter type = map, group = smth, date = mull || smth => api => change popup title depending on selected
      successCallback = res => {
        page.setData({
          filter_group: filter_group
          // map_type_name: app.globalData.i18n[filter_group] // TODO translate 
        })
      }
    }
  } else {
  // If filter type = list, group = all || smth, date = null || smth => api
    filter_group = filter_group == 'all' ? '' : filter_group; // Remove 'all' for filter to api
  }  

  // 4. Set up page data, Start new timers, Change date filters
  let callback = {
    success: res => {
      // TEMP
      res = { offers: offer_data };
      successCallback(res);

      // TODO add checkout product count to offer list

      page.setData({
        filter_group: filter_group,
        offers: res.offers
      })
      _timerControl(page, true);
      _setDateFilters(page, res.offers, filter_date);
    }
  };

  // API
  // TODO filter date > filter date and < next day
  let date_filter = '';
  if (filter_date) {
  // TODO filter date by gte or lte
    let last_hour = new Date(filter_date).setHours(23,59,59,999);
    date_filter = `&filter={"$and":"[{"date":{"$gte":${filter_date}}, {"date":{"$lte":${last_hour}}]"}`
  }

  suffix = `?type=${filter_group}${date_filter}`;
  callback.success(); // TEMP
  // TODO api
  // app.api.getOffers(suffix, callback, app.globalData.i18n.loading);
}

Page({
  data: {
    // map: false, // temp for testing
    // filter_group: 'all', // temp for testing
    map: true // Default open to map view
  },

  onShow: function() {
    const self = this;

    app.setTabbar();

    leave_triggered = false;

    // TODO translate tabbar
    // TOOD translate navbar
    // Translation values
    self.setData({
      _t: {
        // TODO Bottom switch
        // TODO card items
        // TOOD filter names
        // TODO days of week
      },
      _filters: {
        list: index_data.list_filtes,
        map: index_data.map_filters
      }
    })
  },

  onHide: function(e) {
    const self = this;
    self.navigatePage({ detail: {} });
  },

  navigatePage: function(e) {
  // Close modal or reset page view to map when leaving page by tabbar click
    const self = this;

    if (leave_triggered) {
      return;
    } else if (e.detail.navigating) {
      leave_triggered = true;
      return;
    }

    self.closeMapModal();
  },

  switchType: function(e) {
    const self = this;
    // Scroll page
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })

    // Wait for page scroll then change
    setTimeout(() => {
      // Check if changing to the map view
      let filter_type = e.currentTarget.dataset.type;
      let filter_group = e.currentTarget.dataset.group;
      _filterOfferData(self, filter_type, filter_group, '');
    }, 300);
  },

  // Filter offers by selected group
  filterOffers: function(e) {
    const self = this;
    let date = e.detail.date ? e.detail.date : '';
    _filterOfferData(self, e.currentTarget.dataset.filterType, e.currentTarget.dataset.filterGroup, date);
  },

  // Close modal for map list
  closeMapModal: function() {
    const self = this;
    _filterOfferData(self, 'map', '', '');
  },

  // Stop slide action at the back when modal is opened
  preventSlide: function() {},

  getPhoneNumber: function(e) {
    console.log(e);
    // TODO api to get user phone -> user name + code + openid
  },
})

/* when need to fetch address
wx.chooseAddress({
  success (res) {
    console.log(res);
  }
})
*/