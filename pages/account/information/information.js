const app = getApp();

Page({
  onShow: function () {
    const self = this;
    let i18n = app.globalData.i18n;

    // Change page nav title
    wx.setNavigationBarTitle({
      title: i18n.edit_my_info
    })

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
        type: i18n.type,
      }
    })
  },
})