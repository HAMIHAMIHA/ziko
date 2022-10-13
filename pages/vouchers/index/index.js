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

const app = getApp();
const _voucher_status = ['all', 'unused', 'used'];

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

const _getVouchers = (page, status) => {
  const callback = res => {
    let vouchers = [];

    res.forEach(v => {
      if (v.status === 'pending' || v.status === 'declined') return;

      let voucher = {};

      // Voucher basic data
      voucher.id = v.id;
      voucher.amount = v.amount;
      voucher.status = v.status; /* validated, used, expired */
      voucher.createdAt = `${formatDate('yyyy/mm/dd', v.createdAt)} ${formatTime(v.createdAt)}`;
      voucher.expirationDate = formatDate('yyyy-mm-dd', v.expirationDate);
      voucher.order = v.order;
      voucher.reason = app.globalData.i18n.voucher_source[v.reason];

      // Check if voucher expired
      if (v.expirationDate > new Date()) {
        voucher.status = "expired";
      }

      // Available for community
      let community_list = [];
      let ticket_type = "kitchen";
      console.log("v.community", v.communities)
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
          ticket_type = "farm";
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

      vouchers.push(voucher)
    });

    // Show vouchers in order with selectables at bottom by crate time
    vouchers.sort((v1, v2) => {
      return v2.createdAt - v1.createdAt
    })

    page.setData({
      vouchers
    })

    if (!status) {
      app.db.set('vouchers', res.filter(r => {
        return r.status === 'validated'
      }).length)
    }
    showLoading(false);
  }

  showLoading(true);
  app.api.getVouchers(status, false).then(callback);
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

    //__test
    vouchers: [{
      community: "kitchen",
      community2: "",
      createdAt: "2022/08/12 12:00",
      amount: 100,
      expire_on: "In 3 hours"
    }, {
      community: "kitchen",
      community2: "pet",
      createdAt: "2022/11/11 12:00",
      amount: 100,
      expire_on: "In 3 hours"
    }, {
      community: "pet",
      community2: "",
      createdAt: "2022/11/11 12:00",
      amount: 150,
      expire_on: "In 3 hours"
    }, {
      community: "cellar",
      community2: "garden",
      createdAt: "2022/11/11 12:00",
      amount: 100,
      expire_on: "Tomorrow"
    },
      {
        community: "garden",
        community2: "",
        createdAt: "2022/11/11 12:00",
        amount: 100,
        expire_on: "Tomorrow"
      },
      {
        community: "",
        community2: "",
        createdAt: "2022/11/11 12:00",
        amount: 120,
        expire_on: "Tomorrow"
      },
    ]
  },

  onShow: async function () {
    const self = this;
    _setPageTranslation(self);

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;
    await app.sessionUtils.getUserInfo(self);
    if (app.db.get('userInfo')?.token) {
      self.getVouchers();
    }
  },

  getVouchers: function () {
    _getVouchers(this, '');
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
    _getVouchers(self, voucher_status[e.currentTarget.dataset.value]);
  }
})