// component/product/product.js
Component({
  properties: {
    products: Array,
    pack: Boolean,
    cellar: Boolean,
    targets: Array,
    targetType: String
  },

  data: {
    units: 'g'
  },
  methods: {

  },
  ready: function() { 
    const self = this;
    console.log(self.data.products);
    if (self.data.cellar) {
      self.setData({
        units: "cl"
      })
    }
  }
})
