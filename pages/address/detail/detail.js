const { navigateBack } = require("../../../utils/common");

const app = getApp();

// create data to model in db
const generateUserData = (action) => {
  let data = {};
  if (action == 'delete') '';
  else '';

  return data;
}

// Save new address list
const updateUserAddress = (page, data) => {
  // callback
  let callback = {
    success: function(res) {
      navigateBack(app.routes.address, false);
    }
  }

  // api
  // api(data)
  callback.success('')
}

Page({
  onShow: function () {
    let self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: self.options.id ? i18n.edit_address : i18n.add_address
    })

    // Set page translation
    self.setData({
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
      }
    })

    // TEMP
    if (self.options.id) {
      self.setData({
        formData: {
          name: "Address 1",
          type: 'Home',
          city: 'Shanghai',
          area: 'Xuhui',
          zipcode: '200000',
          address: '水电路1200弄3号401室',
          phone: '13111111111',
          comment: 'Here is a long comment about the adress'
        }
      })
    }
  },

  updateAddress: function(e) {
    const self = this;

    let action = e.currentTarget.dataset.action;

    if (action == 'delete' && !self.options.id) {
      console.log('new back');
      navigateBack(app.routes.address, false);
      return;
    }

    // data
    console.log(action);
    let data = generateUserData(action);
    updateUserAddress(self, data)
  }
})