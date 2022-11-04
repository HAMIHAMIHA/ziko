const {
  showLoading
} = require("../../../utils/common.js");

const app = getApp();

// Get user profile
async function getUserInfo(page) {
  showLoading(true);
  let user = await app.sessionUtils.refreshUserInfo(null);
  console.log("user,", user)

  // Set default address info
  // const havePets = user.pets && user.pets.length > 0;
  page.setData({
    // havePets,
    pets: user.pets
  })

  showLoading(false);
}

const _setPageTranslation = page => {
  let i18n = app.globalData.i18n;

  // Set page translation
  page.setData({
    _t: {
      add_pet: i18n.add_pet,
      name: i18n.name,
      pet: i18n.pet,
      pet_type: i18n.pet_type,
      pet_size: i18n.pet_size,
      save: i18n.save,
      size: i18n.size,
      type: i18n.type,
      add_new_pet: i18n.add_new_pet,
      pet_name: i18n.pet_name,
      there_is_no_pet: i18n.there_is_no_pet,
      you_can_add_pet: i18n.you_can_add_pet,
      add_a_cat: i18n.add_a_cat,
      add_a_dog: i18n.add_a_dog,
      cat: i18n.cat,
      dog: i18n.dog,
      tips: i18n.tips,
      delete_it_or_not: i18n.delete_it_or_not,
      confirm: i18n.confirm,
      cancel: i18n.cancel,
    },
  })
}

Page({
  data: {
    errors: {
      contacts: [],
      pets: [],
    },
    pets: [],
    havePets: Boolean,
    _routes: {
      pet: app.routes.pet,
    },
  },

  onShow: async function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.your_pets
    })

    // Restart lottery popup
    app.globalData.pause_lottery_check = false;

    _setPageTranslation(self);

    // Get user info
    showLoading(true);
    let user = await app.sessionUtils.refreshUserInfo(self);

    getUserInfo(self);
    showLoading(false);
  },

  // Set input to data
  changeInput: function (e) {
    const self = this;
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;

    if (index >= 0) {
      key = key.replace('index', index);
    }

    let res = self.data[key];
    res = e.detail.value;

    self.setData({
      [key]: res
    })
  },

  addPetNavigate: function (event) {
    const self = this;
    const typechecked = event.currentTarget.dataset.typechecked;

    wx.navigateTo({
      url: `${self.data._routes.pet}?typechecked=${typechecked}`
    });
  },

  deletePet: function (e) {
    const self = this;

    wx.showModal({
      title: self.data._t.tips,
      content: self.data._t.delete_it_or_not,
      cancelText: self.data._t.cancel,
      confirmText: self.data._t.confirm,
      success(res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          let pets = self.data.pets;
          pets.splice(index, 1);

          self.setData({
            pets,
          })

          app.sessionUtils.updateUserInfo({
            pets
          });
        } else if (res.cancel) {
          console.log('Cancel')
        }
      }
    })
  }
})