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
    updatePage: function(products_translation) {
      const self = this;

      self.setData({
        _t: products_translation
      })
    }
  }
})
