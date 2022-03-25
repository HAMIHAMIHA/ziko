const app = getApp();

Component({
  properties: {
    _offer: Object,
    _product_names: Object,
    _t: Object
  },

  data: {
    _routes: {
      terms: app.routes.terms
    }
  },

  options: {
    addGlobalClass: true
  },

  methods: {

  }
})
