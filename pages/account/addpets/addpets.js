const app = getApp();

Page({
  data: {},
  serviceSelection(event) {
    this.setData({
      typechecked: event.target.dataset.info
    })
  },

  onLoad(options) {

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
      typechecked: "",
    });
  },
})