const { showLoading } = require("../../../utils/common.js");

const app = getApp();

let need_refresh = true; // Used to prevent refresh user info when adding wechat fapiao info
let get_fapiao = true; // Used to enable get fapiao info from Wechat

Page({
  onLoad: function() {
    need_refresh = true;
  },

  onShow: async function () {
    let self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.fapiao
    })

    // Refreshing user info
    if (need_refresh) {
      let user = await app.sessionUtils.refreshUserInfo(null);
      self.setData({
        fapiao: user.fapiaoInformation ? user.fapiaoInformation : '',
      })
      showLoading(false);
      need_refresh = false;
    }

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;
  
    // Set page translation
    self.setData({
      _t: {
        fapiao: i18n.fapiao,
        save: i18n.save,
      }
    })
  },

  // Get Wechat fapiao info
  getFapiaoInfo: function() {
    const self = this;
    if (!get_fapiao) return;
    wx.chooseInvoiceTitle({
      success: res => {
        let fapiao_info = `${ res.title }\n${ res.taxNumber }\n${ res.companyAddress }`;

        self.setData({
          fapiao: fapiao_info
        })
      },

      complete: res => {
        self.setData({
          _focus: true
        })
        get_fapiao = false;
      }
    })
  },

  // Change fapiao in page data
  setFapiaoInfo: function(e) {
    this.setData({
      fapiao: e.detail.value
    })
  },

  // Enable get fapiao info from Wechat
  unsetFocus: function() {
    get_fapiao = true;
  },

  // Save data
  saveInformation: function(e) {
    const self = this;

    showLoading(true);
    let data = {
      fapiaoInformation: self.data.fapiao
    }

    let prev = app.routes.account;
    let switch_tab = true;
    if (self.options.action == 'edit') {
      let pages = getCurrentPages();
      let cart_pg = pages[pages.length - 2];
      cart_pg.options.back = true;
      prev = app.routes.cart;
      switch_tab = false;
    }

    app.sessionUtils.updateUserInfo(data, prev, switch_tab);
  }
})