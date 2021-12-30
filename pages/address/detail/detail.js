// Require

import { navigateBack } from "../../../utils/common";

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