const index_data = require("../../../utils/constants.js");
const {
  showLoading
} = require("../../../utils/common.js");
const {
  voucher_status,
  communities
} = require("../../../utils/constants.js");
const {
  formatDate,
  formatTime
} = require("../../../utils/util.js");
const {truncateText, formatWeekDate, findIndex, _checkMediaType, mapDeliveryDates, formatCountDown} = require("../../../utils/util");

const app = getApp();
const _voucher_status = ['all', 'unused', 'used'];
let current_filter = { type: 'map', group: '', date: '' }; // Default filter for page

// Set page translation
const _setPageTranslation = page => {
  let i18n = app.globalData.i18n;

  // Change page nav title
  wx.setNavigationBarTitle({
    title: i18n.vouchers
  })

  page.setData({
    _language: app.db.get('language'),
    _t: {
      available_for: i18n.available_for,
      contact_customer_hero: i18n.contact_customer_hero,
      expire_on: i18n.expire_on,
      from: i18n.from,
      get_profile: i18n.get_profile,
      moile_login: i18n.mobile_login,
      need_login: i18n.need_login,
      received: i18n.received,
      select: i18n.select,
      to_order: i18n.to_order,
      voucher_question: i18n.voucher_question,
      voucher_status: i18n.voucher_status,
      ziko: i18n.ziko,
      expires: i18n.expires,
      use_now: i18n.use_now,
      no_vouchers_yet: i18n.no_vouchers_yet,
      its_up_to_you: i18n.its_up_to_you,
      view_ziko_offers: i18n.view_ziko_offers
    },
  })
}

const _getVouchers = (page, filters) => {
  console.log("_getVouchers")
  const { status, filter} = filters;
  if (!status) filters.status = "validated"
  console.log("fillters", filters)
  const callback = res => {
    console.log("res", res)
    let vouchers = [];

    res.forEach(v => {
      if (v.status === 'pending' || v.status === 'declined') return;
      let voucher = {};

      // Voucher basic data
      voucher.id = v.id;
      voucher.amount = v.amount;
      voucher.status = v.status; /* validated, used, expired */
      voucher.createdAt = `${formatDate('yyyy/mm/dd', v.createdAt)} ${formatTime(v.createdAt)}`;
      // voucher.expirationDate = formatDate('yyyy-mm-dd', v.expirationDate);
      voucher.expirationDate = formatCountDown(v.expirationDate);
      voucher.order = v.order;
      voucher.reason = app.globalData.i18n.voucher_source[v.reason];

      // Check if voucher expired
      if (v.expirationDate > new Date()) {
        voucher.status = "expired";
      }

      // Available for community
      let community_list = [];
      let ticket_type = "kitchen";
      console.log("v.community", v)
      if (v.communities.length === 4) voucher.community = app.globalData.i18n.community.all
      else {
        if (v.communities.find(c => communities[c] === "pet")) {
          community_list.unshift({
            name: app.globalData.i18n.community.pet,
            style: "pet"
          });
          ticket_type = "pet";
        }
        if (v.communities.find(c => communities[c] === "farm")) {
          community_list.unshift({
            name: app.globalData.i18n.community.farm,
            style: "garden"
          });
          ticket_type = "garden";
        }
        if (v.communities.find(c => communities[c] === "cellar")) {
          community_list.unshift({
            name: app.globalData.i18n.community.cellar,
            style: "cellar"
          });
          ticket_type = "cellar";
        }
        if (v.communities.find(c => communities[c] === "kitchen")) {
          community_list.unshift({
            name: app.globalData.i18n.community.kitchen,
            style: "kitchen"
          });
          ticket_type = "kitchen";
        }
        // v.communities.forEach(c => {
        //   community_list.push(app.globalData.i18n.community[communities[c]])
        // })

        voucher.community_list = community_list;
      }
      voucher.ticket_type = ticket_type;
      voucher.rawCommunity = v.communities;

      vouchers.push(voucher)
    });

    // Show vouchers in order with selectables at bottom by crate time
    vouchers.sort((v1, v2) => {
      return v2.createdAt - v1.createdAt
    })
    console.log("vouchers", vouchers)

    page.setData({
      vouchers
    })

    if (!status) {
      app.db.set('vouchers', res.filter(r => {
        return r.status === 'validated'
      }).length)
    }
    showLoading(false);
    console.log("end of callback")
  }

  showLoading(true);
  app.api.getVouchers(status, filter).then(callback);
}
const _resetDateFilters = (page, new_list) => {
  let date_filter = page.selectComponent('#list_date_filters');
  if (current_filter.type == "map") {
    date_filter = page.selectComponent('#map_date_filter');
  }

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
const _filterVoucherData = (page, filter_type, filter_group, filter_id, filter_date) => {
  let suffix = '';
  let raw_vouchers = [];

  // Stop all timers

  page.setData({
    map: (filter_type === 'map'),
    filter_group: filter_group,
  })

  // Change filter type if different from current
  if (current_filter.type !== filter_type) {
    current_filter.type = filter_type;
  }

  // Reset date filter if filter type and filter group different from current
  if (!filter_date) {
    _resetDateFilters(page, current_filter.type != filter_type || current_filter.group != filter_id);
  }

  // Get data by filter group and filter date
  current_filter.group = filter_id;
  current_filter.date = filter_date;
  console.log("current_filter: " ,current_filter)

  if (filter_type == 'map') {
    if (!filter_group) {
      // If filter type = map, group == null => clear data and return
      page.setData({filter_group: '', offers: {}})
      return;
    }
  }

  // Loading module
  showLoading(true);


  // Set up page data, Start new timers, Change date filters
  let callback = res => {
    console.log(res, "res")
    page.setData({
      vouchers:res
    })
    showLoading(false);
  };

  // Set up API
  // suffix = filter_id === "" ? filter_id : `&communities=${filter_id}`;
  const filter = {};
  if (filter_id !== "") filter.communities = filter_id
  _getVouchers(page, {status: "validated", filter})
}

Page({
  data: {
    // _pickers: {
    //   _voucher_status
    // },
    // _routes: {
    //   order: app.routes.order,
    // },
    // current_status: "all",
    // _folders: {
    //   asset: app.folders.asset
    // },
    _filters: {
      list: index_data.list_filter,
      map: index_data.map_filters
    },
    // filter_group: '',
    // map: true // Default open to map view
  },
  onLoad: async function () {
    this.setData({filter_group: ""});
  },
  onShow: function () {
    const self = this;
    _setPageTranslation(self);

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;
    app.sessionUtils.getUserInfo(self).then(
      () => {
        if (app.db.get('userInfo')?.token) {
          // self.getVouchers();
          // this.setData({filter_group: ""});
          _getVouchers(this, {status: "validated"});
        }
      }
    );
  },

  getVouchers: function () {
    _getVouchers(this, {});
  },

  // Get Profile info
  getUserProfile: function (e) {
    app.sessionUtils.getWxUserInfo(this);
  },

  // Mobile login
  getPhoneNumber: async function (e) {
    await app.sessionUtils.mobileLogin(this, e.detail.code);
    this.getVouchers();
  },

  changeFilter: function (e) {
    const self = this;

    self.setData({
      current_status: e.currentTarget.dataset.value
    })
    _getVouchers(self, {status: voucher_status[e.currentTarget.dataset.value]});
  },
  // Filter vouchers by selected group
  filterVouchers: function (e) {
    const self = this;
    console.log('Filter voucher', e)
    let data = e.currentTarget ? e.currentTarget.dataset : {};

    // Set up filtering items if just changing date
    if (JSON.stringify(data) == '{}') {
      data = {
        filter_type: current_filter.type,
        filter_group: index_data.communities[current_filter.group],
        filter_id: current_filter.group,
      }
    }
    // Get filtering date value
    let date = (e.detail && e.detail.change_date) ? e.detail.date : '';
    // Filter
    _filterVoucherData(self, data.filter_type, data.filter_group, data.filter_id, date);
  },

  navigateOffer: function () {
    const {vouchers} = this.data;
    const filters = [];
    if (vouchers && vouchers.length === 1) {
      // switched to specified tab
      if ("community_list" in vouchers[0]) {
        filters.push(`tab=${vouchers[0][0].name}`);
      }
    }
    filters.push(`tab=kitchen`);
    wx.switchTab({
      url: `${app.routes.home}?${filters.join('&')}`
    })
  }
})