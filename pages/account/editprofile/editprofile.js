const {
  showLoading
} = require("../../../utils/common.js");
const app = getApp();

const _setPageTranslation = page => {
  let i18n = app.globalData.i18n;

  // Set page translation
  page.setData({
    _t: {
      edit: i18n.edit,
      your_ziko_name: i18n.your_ziko_name,
      cancel: i18n.cancel,
      save: i18n.save
    },
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
    name: '',
    _folders: {
      customer_picture: app.folders.customer_picture,
    }
  },

  onLoad: function () {

  },

  onShow: async function () {
    const self = this;
    let i18n = app.globalData.i18n;

    showLoading(true);

    //Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.edit_profile,
    })
    _setPageTranslation(self);
    // Get user info
    let user = await app.sessionUtils.refreshUserInfo(self);
    self.setData({
      name: user.name,
    })

    showLoading(false);
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

  // Set input to data
  changeInput: function (e) {
    const self = this;
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;

    if (index >= 0) {
      key = key.replace('index', index);
    }

    let res = self.data[key];
    res = e.detail.value;

    self.setData({
      [key]: res
    })
  },

  save: function () {
    const self = this;

    app.sessionUtils.updateUserInfo({ name: self.data.name }, app.routes.account, true);
  },
})