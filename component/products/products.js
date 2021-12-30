const app = getApp();

Component({
  properties: {
    community: String,
    pack: Boolean,
    products: Array,
    targets: Array,
    targetType: String,
    units: String
  },

  data: {
    _routes: {
      product: app.routes.product
    }
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    updatePage: function(language) {
      // TODO on page show, change product language
    }
  }
})
