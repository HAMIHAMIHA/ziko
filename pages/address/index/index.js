const { showLoading, showToast } = require("../../../utils/common.js");
const { findIndex } = require("../../../utils/util.js");

const app = getApp();
const routes = app.routes;

let areas = [];

const _getAddressAreas = () => {
  app.api.getAreas().then( res => {
    areas = res;
  });
}
const _getUserInfo = async page => {
  await app.sessionUtils.refreshUserInfo(page);
  const {customer} = app.db.get("userInfo");
  page.setData({addresses: customer.addresses});
}

Page({
  data: {
    _routes: {
      address_detail: routes.address_detail
    }
  },

  onShow: async function () {
    console.log("userData",this.data)
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
        select: i18n.select,
        default_selection:i18n.default_selection
      }
    })

    // Get user info
    showLoading(true);
    await _getUserInfo(this);
    showLoading(false);

    _getAddressAreas();

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    // Set page Data
    if (self.options.selected_address != undefined) {
      self.setData({
        select_index: self.options.selected_address
      })
    }

    self.setData({
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
    const self = this;

    let pages = getCurrentPages();
    let prev = pages[pages.length - 2];

    // Check if an area is selected
    if (self.data.select_index == -1) {
      showToast(app.globalData.i18n.address_empty);
      return;
    }

    // Get area list without areas not supported (by Alex)
    let fees = prev.data._offer.fees;
    let areaList = [...areas] // the list of all areas
    if (fees && fees.length) {
      let feeAreas = [...fees] // the list of areas in the order
      let newAreaList = []
      let topParents = areaList.filter((area) => !area.parent)
      while (topParents.length) {
        for (const area of topParents) {
          const inFeeId = feeAreas.findIndex((e) => e.area.id === area.id)
          const inAreaId = areaList.findIndex(
            (e) => e.id === area.id
          )

          if (inFeeId === -1) {
            areaList = areaList.map((e) =>
              area.id === e.parent
                ? { ...e, parent: undefined }
                : e
            )
            areaList.splice(inAreaId, 1)
          } else {
            newAreaList = [
              ...newAreaList,
              ...areaList.splice(inAreaId, 1),
            ]
          }
        }

        topParents = areaList.filter((area) => !area.parent)
      }
      areaList = [...areaList, ...newAreaList]
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
      address_selected: self.data.select_index
    })

    prev.calculateDeliveryFee(selected_address.area);

    // Go back to previous page
    wx.navigateBack({
      delta: 1,
    })
  },
  deleteAddress: function (event) {
    const self = this;
    const {addresses} = self.data;
    const {index} = event.currentTarget.dataset;
    addresses.splice(index, 1);
    self.setData({addresses});
    app.sessionUtils.updateUserInfo({addresses})
  }
})