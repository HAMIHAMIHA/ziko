const {changeFocus, navigateBack, showLoading} = require("../../../utils/common.js");
const app = getApp();
const validateKeys = {
  size: {
    small: "small",
    middle: "middle",
    large: "large",
  }
}

// Get user profile
async function getUserInfo(page) {
  showLoading(true);
  let user = await app.sessionUtils.refreshUserInfo(null);
  console.log("user,", user)

  // Set default address info
  let count = user.pets ? user.pets.length : 0;
  page.setData({_count: count, pets: user.pets})


  showLoading(false);

}
async function getPetFromId (page, id) {
  const pets = page.data.pets;
  const pet = pets.find(item => item._id === id);
  if (pet) page.setData({pet});
}

async function _addPet(page, pet) {
  const pets = page.data.pets;
  console.log(pets, "pets")
  console.log(pet, "new pet ")
  const pet_list = [...pets, pet];
  app.sessionUtils.updateUserInfo({pets: pet_list});
};
Page({
  data: {},
  serviceSelection(event) {
    this.setData({
      typechecked: event.target.dataset.info
    })
  },

  onLoad(options) {
    console.log(options, "[addPets] options");
    this.setData({...options, validateKeys})
    getUserInfo(this).then(
      () => {
        if (options.id) getPetFromId(this, options.id);
      }
    );
  },

  onShow: async function () {
    // Change page nav title
    let i18n = app.globalData.i18n;
    this.setData({
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
    console.log("addPet", e)
    showLoading(true);
    if (!this.data.typechecked) return;
    const type = this.data.typechecked.toLowerCase();
    const {name, size} = e.detail.value;
    const newPet = {name, type, size};
    _addPet(this, newPet).then(() => {
      showLoading(false)
      wx.navigateBack();
    });
  }
})