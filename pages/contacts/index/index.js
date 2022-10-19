const {
  showLoading,
  showToast
} = require("../../../utils/common.js");

const app = getApp();

const _getUserInfo = async page => {
  await app.sessionUtils.refreshUserInfo(page);
  const customer = app.db.get('userInfo').customer;
  page.setData({
    contacts: customer.contacts
  })
}

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
      title: (self.options.action == 'select') ? i18n.select_contact : i18n.contact_list
    })

    // Set page translation
    self.setData({
      _t: {
        there_is_no_contact: i18n.there_is_no_contact,
        contact: i18n.contact,
        add_new_contact: i18n.add_new_contact,
        select: i18n.select,
        contact_name: i18n.contact_name,
        contact_number: i18n.contact_number,
        default_selection: i18n.default_selection,
        tips: i18n.tips,
        delete_it_or_not: i18n.delete_it_or_not,
        confirm: i18n.confirm,
        cancel: i18n.cancel,
      }
    })

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    // Get user info
    showLoading(true);
    _getUserInfo(this);
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

  deleteContact: function (e) {
    const self = this;

    wx.showModal({
      title: self.data._t.tips,
      content: self.data._t.delete_it_or_not,
      cancelText: self.data._t.cancel,
      confirmText: self.data._t.confirm,
      success(res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          let contacts = self.data.contacts;
          contacts.splice(index, 1);

          self.setData({
            contacts,
          })

          app.sessionUtils.updateUserInfo({
            contacts: self.data.contacts
          });
        } else if (res.cancel) {
          console.log('Cancel')
        }
      }
    })
  },

  selectContact: function (e) {
    const self = this;

    // Prevent select triggering if in user address list
    if (self.options.action != 'select') return;

    let selected = e.currentTarget.dataset.index;
    self.setData({
      select_index: selected
    })
  },

  select: function () {
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
  },

  setDefault: function (event) {
    const self = this;
    const contact = event.currentTarget.dataset.contact;
    const contacts = self.data.contacts;
    if (contact.default) return;
    const contacts_list = contacts.map(new_contact => {
      new_contact.default = new_contact._id === contact._id;
      return new_contact;
    });
    console.log("contacts_list", contacts_list);
    app.sessionUtils.updateUserInfo({
      contacts: contacts_list
    })
    _getUserInfo(self);
  }
})