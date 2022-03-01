const app = getApp();
const { mobileLogin, getUserInfo, updateUserInfo, showLoading, getWxUserInfo } = require('../../../utils/common.js');
const translate = require('../../../utils/internationalize/translate.js'); // 翻译功能

const _uploadProfileImage = (res, page) =>  {
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
    updateUserInfo(profile_data, null);
  }
  app.api.uploadProfilePicture(res.tempFiles[0].tempFilePath).then(callback);
}

Page({
  data: {
    _folders: {
      customer_picture: app.folders.customer_picture
    },
    _routes: {
      account_info: app.routes.account_info,
      fapiao: app.routes.fapiao,
      address: app.routes.address,
      orders: app.routes.orders
    }
  },

  onShow: function () {
    const self = this;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: ''
    })

    // Set page translation
    self.updatePageLanguage();

    // Set user Data
    getUserInfo(self)
  },

  // Get Profile info
  getUserProfile: function(e) {
    getWxUserInfo(this);
  },

  // Mobile login
  getPhoneNumber: function(e) {
    mobileLogin(this, e.detail.code, null);
  },

  switchLanguage: function(e) {
    const self = this;

    let new_language = e.currentTarget.dataset.language;
    if (app.db.get('langugae') != new_language) {
      app.globalData.i18n = translate.change(new_language);
      self.updatePageLanguage();
    }
  },

  updatePageLanguage: function() {
    const self = this;

    let i18n = app.globalData.i18n;
  
    // Set tabbar translation
    app.setTabbar();
  
    // Set page default data
    self.setData({
      _t: {
        account_ranking: i18n.account_ranking,
        claims: i18n.claims,
        contact: i18n.contact,
        edit_my_address: i18n.edit_my_address,
        edit_my_info: i18n.edit_my_info,
        en: i18n.en,
        fapiao_info: i18n.fapiao_info,
        get_profile: i18n.get_profile,
        moile_login: i18n.mobile_login,
        my_favorite_recipes: i18n.my_favorite_recipes,
        orders: i18n.orders,
        vouchers: i18n.vouchers,
        zh: i18n.zh,
      },
      language: app.db.get('language')
    })
  },

  chooseProfilePicture: function() {
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
  }
})