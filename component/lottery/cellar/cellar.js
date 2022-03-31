const app = getApp();

Component({
  properties: {
    _current_user: String,
    _offer: Object,
    _product_names: Object,
    _t: Object
  },

  data: {
    _folders: {
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

  }
})
