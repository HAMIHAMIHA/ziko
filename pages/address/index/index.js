const app = getApp();
const routes = app.routes;

Page({
  data: {
    _routes: {
      address_detail: routes.address_detail
    }
  },

  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: (self.options.action == 'select') ? i18n.select_address : i18n.addresses
    })

    // Set page translation
    self.setData({
      _t: {
        address: i18n.address,
        add_new_address: i18n.add_new_address,
        select: i18n.select
      }
    })

    // Get user info
    let user = app.db.get('userInfo').user;
    if (!user) { return; }

    // Set page Data
    self.setData({
      user: user,
      _setting: {
        selecting: self.options.action == 'select'
      }
    })
  },

  selectAddress: function(e) {
    const self = this;

    // Prevent select triggering if in user address list
    if (self.options.action != 'select') return;

    let selected = e.currentTarget.dataset.index;
    self.setData({
      select_index: selected
    })
  },

  select: function() {
    // 1. change cart address data to selected address
    // 2. go back to previous (cart) page
    // 3. [in cart page] update page address display
  }
})