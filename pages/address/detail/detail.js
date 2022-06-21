const { changeFocus, navigateBack, showLoading } = require("../../../utils/common.js");
const { findIndex } = require("../../../utils/util.js");

const app = getApp();
const address_type = ["office", "home", "other"];
const validate_keys = ['type', 'contact', 'city', 'detailedAddress', 'phone'];

const _getAddressAreas = (page, area_id) => {
  app.api.getAreas().then(res => {
    page.setData({
      area: res[findIndex(res, area_id, 'id')]
    })
  });
}

// Get user profile
async function getUserInfo(page) {
  showLoading(true);
  let user = await app.sessionUtils.refreshUserInfo(null);

  // Set default address info
  let count = Math.max(user.addresses?.length, 0);
  let address = {};
  let picker_selected = '';

  // Set address info if edit
  if (page.options.id) {
    count = findIndex(user.addresses, page.options.id, '_id');
    address = user.addresses[count];
    _getAddressAreas(page, address.area);
    picker_selected = `${address_type.indexOf(address.type)}`
  } else {
    address.contact = user.name;
  }

  showLoading(false);

  page.setData({
    _count: count,
    _picker_selected: picker_selected,
    address: address
  })
}

// Check if input empty
const _validateInputs = (page, data) => {
  let error = '';
  for (var i in validate_keys) {
    (data[validate_keys[i]] == null || data[validate_keys[i]] == '') ? error += `error-field-${i} ` : '';
  }

  if (!page.data.area || JSON.stringify(page.data.area) == "{}") {
    error += 'error-field-5 ';
  }

  page.setData({
    error: error
  })

  return error;
}

// Create address data for api
const _generateUserAddress = (page, action, new_address) => {
  let address = app.db.get('userInfo').customer.addresses;

  if (action == 'reset') {
    let addr_index = page.data._count;
    address.splice(addr_index, 1)
  } else {
    if (page.options.id) {
      address[page.data._count] = new_address;
    } else {
      address ? address.push(new_address) : address = [new_address];
    }
  }

  return address;
}

Page({
  onShow: function () {
    let self = this;
    let i18n = app.globalData.i18n;

    if (self.options.back) return;

    showLoading(true);

    // Change page nav title
    wx.setNavigationBarTitle({
      title: self.options.id ? i18n.edit_address : i18n.add_address
    })

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    // Format picker values based on langauge
    let address_picker = [];
    for (var type in address_type) {
      let type_variable = address_type[type];
      address_picker.push(i18n.address_type[type_variable]);
    }

    // Set page translation
    self.setData({
      _picker: {
        address_type: address_picker
      },
      _t: {
        address: i18n.address,
        address_type: i18n.address_type,
        area: i18n.area,
        contact: i18n.contact,
        city: i18n.city,
        comment: i18n.address_comment,
        delete: i18n.delete,
        phone_no: i18n.phone_no,
        save: i18n.save,
        type: i18n.type,
        zipcode: i18n.zipcode,
      },
      _routes: {
        address_areas: app.routes.address_areas,
      }
    })

    getUserInfo(self);
  },

  // Change picker result
  bindPickerChange: function(e) {
    const self = this;

    let new_index = e.detail.value;

    self.setData({
      'address.type': address_type[new_index],
      _picker_selected: new_index,
    })
  },

  // Change input focus
  next: function(e) {
    changeFocus(this, e);
  },

  // Save address info
  updateAddress: function(e) {
    const self = this;
    let action = e.type;

    // Go back to address page if delete new address
    if (action == 'reset' && !self.options.id) {
      navigateBack(app.routes.address, false);
      return;
    }
 
    // Stop if saving but inputs empty
    if (action != 'reset' && _validateInputs(self, e.detail.value)) return;

    showLoading(true);

    // Add address to addrss list
    let address = e.detail.value;
    address ? address.type = self.data.address.type : '';
    address ? address.area = self.data.area.id : '';
    let address_list = _generateUserAddress(self, action, address);

    app.sessionUtils.updateUserInfo({ addresses: address_list }, app.routes.address);
  }
})