
const { showLoading } = require("../../../utils/common.js");
const app = getApp();

const _setPageTranslation = page => {
  let i18n = app.globalData.i18n;
  
  // Set page translation
  page.setData({
    _t: {
      edit:i18n.edit,
      your_ziko_name:i18n.your_ziko_name,
      cancel:i18n.cancel,
      save:i18n.save
    },
  })
}


// pages/account/editprofile/editprofile.js
Page({
  /**
   * Page initial data
   */
  data: {
    name:"david"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow:async function() {
    const self=this;
    let i18n=app.globalData.i18n;
    //Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.edit_profile,
    })
    _setPageTranslation(self);
    // Get user info
    showLoading(true);
    let user = await app.sessionUtils.refreshUserInfo(self);
    self.setData({
      name: user.name,
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

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
  },
    // Set input to data
    changeInput: function(e) {
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

})