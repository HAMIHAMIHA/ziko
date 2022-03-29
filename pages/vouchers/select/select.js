Page({
  data: {
    vouchers: [
      1, 2, 3
    ]
  },

  onShow: function() {
    const self = this;

    _getVouchers(self, self.options.community);
  },


  select: function() {
    const self = this;

    let pages = getCurrentPages();
    let prev = pages[pages.length - 2];

    // Check if an area is selected
    if (self.data.select_index == -1) {
      showToast(app.globalData.i18n.address_empty);
      return;
    }
    let selected_address = self.data.user.addresses[self.data.select_index];

    // Check if selected area is in the filtered area list
    if (selected_address && findIndex(areaList, selected_address.area, 'id') == -1) {
      showToast(app.globalData.i18n.area_invalid);
      return;
    }

    // Prevent on show clear page data when going back
    let options = prev.options
    options.back = true;
    prev.options = options

    // Set selected address data
    prev.setData({

    })

    prev.setVoucher('voucher');

    // Go back to previous page
    wx.navigateBack({
      delta: 1,
    })
  }
})