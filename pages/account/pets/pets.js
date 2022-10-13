const { showLoading } = require("../../../utils/common.js");

const app = getApp();

const _setPageTranslation = page => {
  let i18n = app.globalData.i18n;

  // Format picker values based on langauge
  let type_picker = [];
  pet_pickers.type.forEach( type => {
    type_picker.push(i18n.pet_type[type]);
  })

  let size_picker = [];
  pet_pickers.size.forEach( size => {
    size_picker.push(i18n.pet_size[size]);
  })
  
  // Set page translation
  page.setData({
    _t: {
      add_contact: i18n.add_contact,
      add_pet: i18n.add_pet,
      contact_info: i18n.contact_info,
      name: i18n.name,
      pet: i18n.pet,
      pet_type: i18n.pet_type,
      pet_size: i18n.pet_size,
      phone_no: i18n.phone_no,
      profile_info: i18n.profile_info,
      save: i18n.save,
      size: i18n.size,
      type: i18n.type,
      add_new_pet:i18n.add_new_pet,
      pet_name:i18n.pet_name,
      there_is_no_pet:i18n.there_is_no_pet,
      you_can:i18n.you_can,
      add_a_cat:i18n.add_a_cat,
      add_a_dog:i18n.add_a_dog,
      cat: i18n.cat,
      dog: i18n.dog,

    },

    // Picker formated for selector
    _picker: {
      pet_type: type_picker,
      pet_size: size_picker,
    }
  })
}

const pet_pickers = {
  type: ["cat", "dog", "bird", "rabbit", "other"],
  size: ["small", "middle", "large"]
}

// Check if all pet fields filled
const _validatePets = (page, pets) => {
  let errors = [];
  let valid = true;

  for (var p in pets) {
    let error = '';
    let pet = pets[p];

    if (!pet.name) error += 'error-field-1 ';
    if (!pet.type) error += 'error-field-2 ';
    if (!pet.size) error += 'error-field-3 ';

    if (error != '') valid = false;

    errors.push(error);
  }
  page.setData({
    'errors.pets': errors
  })

  return valid;
}

Page({
  data:{
    errors: {
      contacts: [],
      pets: [],
    },
    _routes: {
      addpets: app.routes.addpets,
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

    // Get pet picker locations
    let _picker_select = [];
    let testpets=[{type:"cat",size:"small"}]
    testpets.forEach( pet => {
      // user.pets.forEach( pet => {
      let type = pet_pickers.type.indexOf(pet.type);
      let size = pet_pickers.size.indexOf(pet.size);

      _picker_select.push({
        type: `${type}`,
        size: `${size}`
      })
    })

    self.setData({
      //Original code
      // name: user.name,
      // pets: user.pets,
      // _picker_select: _picker_select
      name:"david",
      havepets:true,
      pets:[
        {name:"Minion Lee",
        type:"cat",
        size:"middle"},
        {
        name:"Peanit Dun",
        type:"dog",
        size:"small"},
      ],
      _picker_select: _picker_select
    })
    

    showLoading(false);
  },

  // Set input to data
  changeInput: function(e) {
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

    // Validate if name filled
    if (!self.data.name) {
      self.setData({
        error_name: 'error-field-0'
      })
    }

    if (!_validatePets(self, self.data.pets) || !self.data.name) return;

    showLoading(true);

    let data = {
      name: self.data.name,
      pets: self.data.pets
    }
    app.sessionUtils.updateUserInfo(data, app.routes.account, true);
  },
  addPetNavigate: function (event) {
    const {typechecked} = event.currentTarget.dataset;
    const {addpets: url} = this.data._routes;
    wx.navigateTo({url: `${url}?typechecked=${typechecked}`});
  }
})


