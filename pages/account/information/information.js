const { navigateBack } = require("../../../utils/common");

const app = getApp();

const pet_pickers = {
  type: ['dogs', 'cats'],
  size: ['small', 'large']
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
      }
    })

    // TODO get user info
    let user = app.db.get('userInfo').user; // TEMP

    // Get pet picker locations
    let _picker_select = [];
    for (var i in user.pets) {
      let type = pet_pickers.type.indexOf(user.pets[i].type);
      let size = pet_pickers.size.indexOf(user.pets[i].size);

      _picker_select.push({
        type: `${type}`,
        size: `${size}`
      })
    }

    self.setData({
      name: user.name,
      pets: user.pets,
      _picker_select: _picker_select
    })
  },

  // Set input to data
  changeInput: function(e) {
    const self = this;
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;

    if (index >= 0) {
      key = key.replace('index', index);
    }
    console.log(key);
  
    let res = self.data[key];
    res = e.detail.value;
    
    self.setData({
      [key]: res
    })
  },

  // Add data and selector for pet
  addPet: function() {
    const self = this;
    let pets = self.data.pets;
    let _picker_select = self.data._picker_select;
  
    if (pets) {
      pets.push({});
      _picker_select.push({});
    } else {
      pets = [{}];
      _picker_select = [{}];
    }

    self.setData({
      pets: pets,
      _picker_select: _picker_select
    })
  },

  // Change picker result
  petPickerChange: function(e) {
    const self = this;

    let pet = e.mark.index;
    let changing_key = e.currentTarget.dataset.key;
    let new_index = e.detail.value;

    let pets = self.data.pets;
    pets[pet][changing_key] = pet_pickers[changing_key][new_index];

    self.setData({
      pets: pets,
      [`_picker_select[${pet}].${changing_key}`]: new_index
    })
  },

  // Remove data and selector for pet
  removePet: function(e) {
    const self = this;
    let pets = self.data.pets;
    let _picker_select = self.data._picker_select;

    pets.splice(e.mark.index, 1);
    _picker_select.splice(e.mark.index, 1);
  
    self.setData({
      pets: pets,
      _picker_select: _picker_select
    })
  },

  // Save data
  saveInformation: function(e) {
    const self = this;
    let data = {
      name: self.data.name,
      pets: self.data.pets
    }

    const callback = {
      success: res => {
        // TEMP
        app.db.set('userInfo', {user: data})

        // TODO update storage
        navigateBack(app.routes.account, true);
      }
    }

    callback.success('');
    // TODO api
  }
})