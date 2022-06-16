const app = getApp();

Component({
  properties: {
    _current_user: String,
    _offer: Object,
    _product_names: Object,
    _t: Object,
    offer_page: Boolean,
  },

  data: {
    _folders: {
      custom_image: app.folders.custom_image,
      profile_picture: app.folders.customer_picture
    },
    _routes: {
      terms: app.routes.terms
    },
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    refresh: function(_offer) {
      this.setData({
        _offer
      })
    }
  }
})
