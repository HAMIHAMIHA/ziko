const { map_filters } = require("./mapData");
const { offer_data } = require("./mapData"); // TEMP

const app = getApp();

// Default filter for page
let current_filter = {
  type: 'map',
  group: '',
  date: ''
};

// Update date filter to selected or change depending on days of offers
const _setDateFilters = (page, offers, filter_date) => {
  let date_filter = page.selectComponent('#list_date_filters');
  if (current_filter.type == "map") {
    date_filter = page.selectComponent('#map_date_filter');
  }
  date_filter.updateFilter(offers, filter_date);
}

const _timerControl = (page, timer_switch) => {
  // Toggle timer intervals
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
      map: (filter_type == 'map')
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
        map_type_name: '',
        offers: {}
      })
      return;
    } else {
      // If filter type = map, group = smth, date = mull || smth => api => change popup title depending on selected
      suffix = `?type=${filter_group}&date=${filter_date}`;
      successCallback = res => {
        page.setData({
          map_type_name: filter_group // TEMP
          // map_type_name: app.globalData.i18n[filter_group] // TODO translate 
        })
      }
    }
  } else {
  // If filter type = list, group = all || smth, date = null || smth => api
    // TODO filter date > filter date and < next day
    suffix = `?type=${filter_group}&date=${filter_date}`;
  }  

  // 4. Set up page data, Start new timers, Change date filters
  let callback = {
    success: res => {
      // TEMP
      res = { offers: offer_data};
      successCallback(res);
      page.setData({
        offers: res.offers
      })
      _timerControl(page, true);
      _setDateFilters(page, res.offers, filter_date);
    }
  };

  // API
  callback.success(); // TEMP
  // TODO api
  // app.api.getOffers(suffix, callback, app.globalData.i18n.loading);
}

Page({
  data: {
    // map: false, // temp for testing
    map: true // Default open to map view
  },

  onShow: function() {
    const self = this;

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
      _map_filters: map_filters
    })

  },

  switchType: function(e) {
    const self = this;
    // Check if changing to the map view
    let filter_type = e.currentTarget.dataset.type;
    _filterOfferData(self, filter_type, '', '');

    // Scroll page
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
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
  preventSlide: function() {}


  /** TODO Get user info
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  }
  **/
})
