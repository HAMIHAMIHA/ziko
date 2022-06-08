const { showLoading, showToast } = require("../../../utils/common.js");

const app = getApp();

Page({
  data: {
    _routes: {
      contact: app.routes.contact
    }
  },

  onShow: async function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: (self.options.action == 'select') ? i18n.select_contact : i18n.contacts
    })

    // Set page translation
    self.setData({
      _t: {
        contact: i18n.contact,
        add_new_contact: i18n.add_new_contact,
        select: i18n.select
      }
    })

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    // Get user info
    showLoading(true);
    console.log('show');
    let u = await app.sessionUtils.refreshUserInfo(self);
    console.log(u);
    console.log('comp');
    showLoading(false);

    // Set page Data
    if (self.options.selected_contact != undefined) {
      self.setData({
        select_index: self.options.selected_contact
      })
    }

    self.setData({
      _setting: {
        selecting: self.options.action == 'select'
      }
    })
  },

  selectContact: function(e) {
    const self = this;

    // Prevent select triggering if in user address list
    if (self.options.action != 'select') return;

    let selected = e.currentTarget.dataset.index;
    self.setData({
      select_index: selected
    })
  },

  select: function() {
    const self = this;

    let pages = getCurrentPages();
    let prev = pages[pages.length - 2];

    // Check if an area is selected
    if (self.data.select_index == -1) {
      showToast(app.globalData.i18n.contact_empty);
      return;
    }

    // Prevent on show clear page data when going back
    let options = prev.options
    options.back = true;
    prev.options = options

    // Set selected address data
    prev.setData({
      contact_selected: self.data.select_index
    })

    // Go back to previous page
    wx.navigateBack({
      delta: 1,
    })
  }
})