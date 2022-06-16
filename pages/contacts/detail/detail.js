const { changeFocus, navigateBack, showLoading } = require("../../../utils/common.js");
const { findIndex } = require("../../../utils/util.js");

const app = getApp();
const validate_keys = ['name', 'phone'];

// Get user profile
async function getUserInfo(page) {
  showLoading(true);
  let user = await app.sessionUtils.refreshUserInfo(null);

  // Set default address info
  let count = user.contacts ? user.contacts.length : 0;
  let contact = {};

  // Set address info if edit
  if (page.options.id) {
    count = findIndex(user.contacts, page.options.id, '_id');
    contact = user.contacts[count];
  } else {
    contact.name = user.name;
    contact.phone = user.phone;
  }

  showLoading(false);

  page.setData({
    _count: count,
    contact: contact
  })
}

// Check if input empty
const _validateInputs = (page, data) => {
  let error = '';
  for (var i in validate_keys) {
    (data[validate_keys[i]] == null || data[validate_keys[i]] == '') ? error += `error-field-${i} ` : '';
  }

  page.setData({
    error: error
  })

  return error;
}

// Create address data for api
const _generateUserContact = (page, action, new_contact) => {
  let contacts = app.db.get('userInfo').customer.contacts;

  if (action == 'reset') {
    let addr_index = page.data._count;
    contacts.splice(addr_index, 1)
  } else {
    if (page.options.id) {
      contacts[page.data._count] = new_contact;
    } else {
      contacts && contacts.length > 0 ? contacts.push(new_contact) : contacts = [new_contact];
    }
  }

  return contacts;
}

Page({
  onShow: function () {
    let self = this;
    let i18n = app.globalData.i18n;

    if (self.options.back) return;

    showLoading(true);

    // Change page nav title
    wx.setNavigationBarTitle({
      title: self.options.id ? i18n.edit_contact : i18n.add_contact
    })

    // Set page translation
    self.setData({
      _t: {
        contact: i18n.contact,
        delete: i18n.delete,
        name: i18n.name,
        phone_no: i18n.phone_no,
        save: i18n.save,
      },
    })

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    getUserInfo(self);
  },

  // Change input focus
  next: function(e) {
    changeFocus(this, e);
  },

  // Save address info
  updateContact: function(e) {
    const self = this;
    let action = e.type;

    // Go back to address page if delete new address
    if (action == 'reset' && !self.options.id) {
      navigateBack(app.routes.contacts, false);
      return;
    }
 
    // Stop if saving but inputs empty
    if (action != 'reset' && _validateInputs(self, e.detail.value)) return;

    showLoading(true);

    // Update contact info to BO
    let contact = e.detail.value;
    let contact_list = _generateUserContact(self, action, contact);
    app.sessionUtils.updateUserInfo({ contacts: contact_list }, app.routes.contacts);
  }
})