const {
  showLoading,
  showToast,
} = require('../../../utils/common.js');
const translate = require('../../../utils/internationalize/translate.js'); // 翻译功能

const app = getApp();

// Page data
const _getPageData = (page) => {
  // Voucher list for comparsion
  app.api.getVouchers('validated', false).then(res => {
    if (!app.db.get('vouchers')) return; // Don't check for extra if there is no voucher history in storage
    page.setData({
      new_vouchers: res.length - app.db.get('vouchers')
    })
  });

  // Order list for comparsion
  let order_filter = {
    filter_str: `channel=miniprogram`
  };
  app.api.getOrders(order_filter).then(orders => {
    if (!app.db.get('orderDeliveries')) return; // Don't check for extra if there is no voucher history in storage
    orders.slice((orders.length - app.db.get('orderDeliveries').length), orders.length);

    let deliveries = [];
    orders.forEach(order => {
      deliveries.push(order.trackingStatus);
    })

    page.setData({
      new_orders: `${deliveries}` !== `${app.db.get('orderDeliveries')}`
    })
  })
}

const _uploadProfileImage = (res, page) => {
  showLoading(true);
  const callback = file => {
    // Update profile image displaying
    let user = page.data.user;
    user.profilePicture = file;
    page.setData({
      user: user
    })
    // Update user data
    let profile_data = {
      profilePicture: file
    }
    app.sessionUtils.updateUserInfo(profile_data, null);
  }
  app.api.uploadProfilePicture(res.tempFiles[0].tempFilePath).then(callback);
}

Page({
  data: {
    user: {},
    wxUser: {},
    _folders: {
      customer_picture: app.folders.customer_picture
    },
    _routes: {
      account_info: app.routes.account_info,
      contacts: app.routes.contacts,
      fapiao: app.routes.fapiao,
      address: app.routes.address,
      orders: app.routes.orders,
      recipes_fav: app.routes.recipes_fav,
      vouchers: app.routes.vouchers,
      lottery: app.routes.lottery,
      edit_profile: app.routes.edit_profile,
      pets: app.routes.pets,
    },
    language: app.db.get('language'),
    showCopyBox: false,
    animationData: {},

    // TEMP
    // To fill in the real wechat ids
    copyContent: [{
      community: 'cellar',
      title: app.globalData.i18n.add_cellar_ziko,
      wechat: 'SimonMawas',
    }, {
      community: 'farm',
      title: app.globalData.i18n.add_farmer_ziko,
      wechat: 'SimonMawas',
    }, {
      community: 'kitchen',
      title: app.globalData.i18n.add_chef_ziko,
      wechat: 'SimonMawas',
    }, {
      community: 'pet',
      title: app.globalData.i18n.add_pet_ziko,
      wechat: 'SimonMawas',
    }, ],
  },

  onShow: async function () {
    const self = this;
    // Change page nav title
    wx.setNavigationBarTitle({
      title: ''
    })

    // Set page translation
    self.updatePageLanguage();

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    // Set user Data
    showLoading(true);
    await app.sessionUtils.getUserInfo(self);

    // Page Data (order + vouchers)
    if (app.db.get('userInfo')?.token) {
      _getPageData(self);
    }

    showLoading(false);
    // Change tabBar
    if (typeof self.getTabBar === 'function' && self.getTabBar()) {
      self.getTabBar().setData({
        selected: 2,
        lang: app.db.get('language'),
      })
    }
  },

  // Get Profile info
  getUserProfile: function (e) {
    app.sessionUtils.getWxUserInfo(this);
  },

  // Mobile login
  getPhoneNumber: function (e) {
    app.sessionUtils.mobileLogin(this, e.detail.code);
  },

  switchLanguage: function (e) {
    const self = this;

    let new_language = e.currentTarget.dataset.language;
    if (app.db.get('langugae') != new_language) {
      app.globalData.i18n = translate.change(new_language);
      self.updatePageLanguage();
    }
  },

  updatePageLanguage: function () {
    const self = this;
    const i18n = app.globalData.i18n;

    // Set tabbar translation
    // app.setTabbars();

    // Set page default data
    self.setData({
      _t: {
        account_ranking: i18n.account_ranking,
        claims: i18n.claims,
        contact: i18n.contact,
        edit_my_address: i18n.edit_my_address,
        edit_my_contacts: i18n.edit_my_contacts,
        edit_my_info: i18n.edit_my_info,
        en: i18n.en,
        fapiao_info: i18n.fapiao_info,
        get_profile: i18n.get_profile,
        moile_login: i18n.mobile_login,
        my_favorite_recipes: i18n.my_favorite_recipes,
        orders: i18n.orders,
        vouchers: i18n.vouchers,
        zh: i18n.zh,
        address_book: i18n.address_book,
        contact_list: i18n.contact_list,
        fapiao_information: i18n.fapiao_information,
        my_pets: i18n.my_pets,
        manage_your_delivery_address_details: i18n.manage_your_delivery_address_details,
        manage_contact_for_delivery: i18n.manage_contact_for_delivery,
        edit_your_fapiao_information: i18n.edit_your_fapiao_information,
        manage_your_pet_details: i18n.manage_your_pet_details,
        join_ziko_community: i18n.join_ziko_community,
        be_apart_of_our: i18n.be_apart_of_our,
        add_chef_ziko: i18n.add_chef_ziko,
        add_pet_ziko: i18n.add_pet_ziko,
        add_farmer_ziko: i18n.add_farmer_ziko,
        add_cellar_ziko: i18n.add_cellar_ziko,
        simonmawas: i18n.simonmawas,
        wechat_id: i18n.wechat_id,
        lottery: i18n.lottery,
        copied: i18n.copied,
        language_choice: i18n.language_choice,
        need_login: i18n.need_login,
      },
      language: app.db.get('language')
    })
  },

  chooseProfilePicture: function () {
    const self = this;

    let choose_media_setting = {
      count: 1,
      sizeType: ['original'],
      success(res) {
        _uploadProfileImage(res, self)
      }
    }

    // Check if wx.chooseMedia is still supported(min mp requirement: 2.11.1), if not use wx.chooseImage (discontinued)
    if (wx.canIUse('chooseMedia')) {
      choose_media_setting.mediaType = ['image'];
      wx.chooseMedia(choose_media_setting);
    } else {
      wx.chooseImage(choose_media_setting);
    }
  },

  showCopyBox: function () {
    this.setData({
      showCopyBox: true,
    })
  },

  hideCopyBox: function () {
    this.setData({
      showCopyBox: false,
    })
  },

  copy: function (e) {
    const self = this;

    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: () => {
        wx.hideToast();
        wx.showToast({
          title: self.data._t.copied,
          duration: 1500,
        })
      }
    })
  },

  navigate: function () {
    const self = this;
    if (!self.data.user.id) {
      showToast(self.data._t.need_login);
      return;
    }
  },
})