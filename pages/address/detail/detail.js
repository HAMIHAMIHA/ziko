const { navigateBack, updateUserInfo } = require("../../../utils/common");
const { findIndex } = require("../../../utils/util");

const app = getApp();
const address_type = ['home', 'work'];
const validate_keys = ['type', 'city', 'area', 'address', 'phone'];

// Check if input empty
const validateInputs = (page, data) => {
  let error = '';
  for (var i in validate_keys) {
    !data[validate_keys[i]] ? error += `error-field-${i} ` : '';
  }

  page.setData({
    error: error
  })

  return error;
}

// Create address data for api
const generateUserAddress = (page, action, new_address) => {
  let address = app.db.get('userInfo').user.address;

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

    // Change page nav title
    wx.setNavigationBarTitle({
      title: self.options.id ? i18n.edit_address : i18n.add_address
    })

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
        city: i18n.city,
        comment: i18n.comment,
        delete: i18n.delete,
        phone_no: i18n.phone_no,
        save: i18n.save,
        type: i18n.type,
        zipcode: i18n.zipcode,
      },
    })

    // TODO get user info
    // TEMP
    let user = app.db.get('userInfo').user;

    // Set default address info
    let count = user.address ? user.address.length : 0;
    let address = {};
    let picker_selected = '';

    // Set address info if edit
    if (self.options.id) {
      count = findIndex(user.address, self.options.id, '_id');
      address = user.address[count];
      picker_selected = `${address_type.indexOf(address.type)}`
    }

    self.setData({
      _count: count,
      _picker_selected: picker_selected,
      address: address
    })
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
    if (action != 'reset' && validateInputs(self, e.detail.value)) return;

    let address = e.detail.value;
    address ? address.type = self.data.address.type : '';
    // TEMP id for testing
    address ? address._id = self.data._count + 1 + new Date().getMilliseconds() : '';

    let address_list = generateUserAddress(self, action, address);
    // TODO api save user data
    // updateUserInfo({ address: address }, app.routes.address);

    // TEMP
    let user_info = app.db.get('userInfo');
    user_info.user.address = address_list;
    app.db.set('userInfo', user_info);
    navigateBack(app.routes.address, false);
  }
})