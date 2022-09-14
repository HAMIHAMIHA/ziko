
const app = getApp();


// pages/account/addpets/addpets.js
Page({

  /**
   * Page initial data
   */
  data: {
  },
  serviceSelection(event){
    this.setData({
      typechecked:event.target.dataset.info
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow:async function () {
    // Change page nav title
    console.log("data:",this.data)
    let i18n = app.globalData.i18n;
    this.setData({
      _t: {
        name:i18n.name,
        add_new_pet:i18n.add_new_pet,
        pet_name:i18n.pet_name,
        please_enter_pets_name:i18n.please_enter_pets_name,
        type_of_pet:i18n.type_of_pet,
        cat:i18n.cat,
        dog:i18n.dog,
        size_of_pet:i18n.size_of_pet,
        pet_size: i18n.pet_size,
        cancel:i18n.cancel,
        save:i18n.save
      },
      typechecked:"",
    });
    
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

})

