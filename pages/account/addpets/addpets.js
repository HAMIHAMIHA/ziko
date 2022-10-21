// Add or edit pet
const {
  showLoading
} = require("../../../utils/common.js");
const app = getApp();
const petInfo = {
  type: {
    cat: "cat",
    dog: "dog",
  },
  size: {
    small: "small",
    middle: "middle",
    large: "large",
  }
}
const validate_keys = ['name', 'type', 'size']

// Get user profile
async function getUserInfo(page) {
  showLoading(true);
  let user = await app.sessionUtils.refreshUserInfo(null);
  console.log("user,", user)

  page.setData({
    pets: user.pets
  })

  showLoading(false);
}

async function getPetFromId(page, id) {
  const pets = page.data.pets;
  const pet = pets.find(item => item._id === id);
  if (pet) {
    page.setData({
      pet,
      typechecked: pet.type
    });
  }
}

async function _addPet(page, pet) {
  const pets = page.data.pets;
  let pet_list = [];
  if (page.options.id) { // Edit the old pet
    for (const i in pets) {
      if (pets[i]._id == page.options.id) {
        pets[i] = pet;
        pets[i]._id = page.options.id;
      }
    }
    pet_list = pets;
  } else { // Add new pet
    pet_list = [...pets, pet];
  }

  app.sessionUtils.updateUserInfo({
    pets: pet_list
  });
};

// Check if input empty
const _validateInputs = (page, data) => {
  let error = '';
  for (var i in validate_keys) {
    (data[validate_keys[i]] == null || data[validate_keys[i]] === '') ? error += `error-field-${i} `: '';
  }

  page.setData({
    error: error
  })

  return error;
}

Page({
  data: {},

  onLoad(options) {
    const self = this;

    self.setData({
      // ...options,
      petInfo
    })
    if (options.typechecked) {
      self.setData({
        typechecked: options.typechecked.toLowerCase(),
      })
    }

    getUserInfo(self).then(() => {
      if (options.id) getPetFromId(self, options.id);
    });
  },

  onShow: async function () {
    const self = this;
    const i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: self.options.id ? i18n.edit : i18n.add_new_pet,
    })

    self.setData({
      _t: {
        name: i18n.name,
        add_new_pet: i18n.add_new_pet,
        pet_name: i18n.pet_name,
        please_enter_pets_name: i18n.please_enter_pets_name,
        type_of_pet: i18n.type_of_pet,
        cat: i18n.cat,
        dog: i18n.dog,
        size_of_pet: i18n.size_of_pet,
        pet_size: i18n.pet_size,
        cancel: i18n.cancel,
        save: i18n.save
      },
      // typechecked: "",
    });
  },

  addPet: function (e) {
    const self = this;
  
    // if (!self.data.typechecked) return;


    const newPet = {
      name: e.detail.value.name,
      type: self.data.typechecked?.toLowerCase(),
      size: e.detail.value.size,
    };

    if (_validateInputs(self, newPet)) return;

    showLoading(true);


    _addPet(self, newPet).then(() => {
      showLoading(false);
      // wx.navigateBack({
      //   delta: 1,
      // });
      wx.navigateTo({
        url: app.routes.pets
      })
    });
  },

  serviceSelection(event) {
    const type = event.currentTarget.dataset.type;
    this.setData({
      typechecked: type
    })
  },
})