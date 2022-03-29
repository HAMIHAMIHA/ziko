const { showLoading } = require("../../../utils/common");
const { communities } = require("../../../utils/constants");
const { formatDate, formatTime } = require("../../../utils/util");

const app = getApp();

// Translate page content
const _setPageTranslation = page => {
  let i18n = app.globalData.i18n;

  // Change page nav title
  wx.setNavigationBarTitle({
    title: i18n.select_voucher
  })

  page.setData({
    _language: app.db.get('language'),
    _t: {
      available_for: i18n.available_for,
      expire_on: i18n.expire_on,
      from: i18n.from,
      please_select_voucher: i18n.please_select_voucher,
      reveived: i18n.reveived,
      select: i18n.select,
    }
  })
}

// Get vouchers and show only usable vouchers
const _getVouchers = (page, community) => {
  let pages = getCurrentPages();
  let prev = pages[pages.length - 2];
  let pay_data = prev.data._pay_set;

  const callback = res => {
    let vouchers = [];

    res.forEach(v => {
      if (v.status === 'used') return;

      let voucher = {};

      // Voucher basic data
      voucher.id = v.id;
      voucher.amount = v.amount;
      voucher.selectable = false;
      voucher.createdAt = `${formatDate('yyyy/mm/dd', v.createdAt)} ${formatTime(v.createdAt)}`;
      voucher.expirationDate = formatDate('yyyy-mm-dd', v.expirationDate);
      voucher.reason = app.globalData.i18n.voucher_source[v.reason];

      // Check if voucher usable (price + community)
      let c_idx = v.communities.findIndex( c => c === community );
      if (v.amount <= pay_data.finalFee && c_idx > -1) {
        voucher.selectable = true;
      }

      // Available for community
      let community_list = [];
      v.communities.forEach( c => {
        community_list.push(app.globalData.i18n.community[communities[c]])
      })
      voucher.community = community_list.join(' / ')

      vouchers.push(voucher)
    });

    // Show vouchers in order with selectables at bottom by crate time
    vouchers.sort( (v1, v2) => {
      if (v1.selectable === v2.selectable) return v2.createdAt - v1.createdAt
      return v1.selectable ? -1 : 1; 
    })

    page.setData({
      vouchers
    })

    showLoading(false);
  };

  showLoading(true);
  app.api.getVouchers("validated", true).then(callback);
}


Page({
  onShow: function() {
    const self = this;
    _setPageTranslation(self);
    _getVouchers(self, self.options.community);
  },

  selectVoucher: function(e) {
    const self = this;

    // Deselect voucher
    if (self.data.selected_voucher === e.currentTarget.dataset.id) {
      self.setData({
        selected_voucher: '',
        voucher_index: '',
      })
      return;
    }

    // Select voucher
    self.setData({
      selected_voucher: e.currentTarget.dataset.id,
      voucher_index: e.currentTarget.dataset.index,
    })
  },

  select: function() {
    const self = this;

    let pages = getCurrentPages();
    let prev = pages[pages.length - 2];

    // Check if voucher is selected
    if (!self.data.selected_voucher) {
      showToast(app.globalData.i18n.voucher_empty);
      return;
    }

    // Prevent on show clear page data when going back
    let options = prev.options
    options.back = true;
    prev.options = options

    // Set selected voucher data
    prev.setData({
      voucher: {
        id: self.data.selected_voucher,
        amount: self.data.vouchers[self.data.voucher_index].amount,
      }
    })

    // Go back to previous page
    wx.navigateBack({
      delta: 1,
    })
  }
})