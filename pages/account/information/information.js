const { change } = require("../../../utils/internationalize/translate");

const app = getApp();

const pet_pickers = {
  type: ['dogs', 'cats'],
  sizes: ['small', 'large']
}

Page({
  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.edit_my_info
    })

    // Format picker values based on langauge
    let type_picker = [];
    for (var type in pet_pickers.type) {
      let type_variable = pet_pickers.type[type];
      type_picker.push(i18n.pet_type[type_variable]);
    }

    let size_picker = [];
    for (var size in pet_pickers.size) {
      let size_variable = pet_pickers.size[size];
      size_picker.push(i18n.pet_size[size_variable]);
    }

    // Set page translation
    self.setData({
      _t: {
        add_pet: i18n.add_pet,
        contact_info: i18n.contact_info,
        name: i18n.name,
        pet: i18n.pet,
        pet_type: i18n.pet_type,
        pet_size: i18n.pet_size,
        save: i18n.save,
        size: i18n.size,
        type: i18n.type,
      },

      // Picker formated for selector
      _picker: {
        pet_type: type_picker,
        pet_size: size_picker,
      },

      // TEMP need to change to duplicatable variable
      // Defult selected value for pickers
      _picker_select: {
        type: "0",
        size: "0",
      },

      pets: [{
        _id: 1,
        type: 'dogs',
        size: 'small'
      }],
    })
  },

  // Change picker result
  petPickerChange: function(e) {
    const self = this;

    let pet = e.currentTarget.dataset.pet_index;
    let changing_key = e.currentTarget.dataset.key;
    let new_index = e.detail.value;

    let pets = self.data.pets;
    pets[pet][changing_key] = pet_pickers[changing_key][new_index];

    self.setData({
      [`_picker_select.${changing_key}`]: new_index,
      pets: pets
    })
  },
})