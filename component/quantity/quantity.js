Component({
  properties: {
    quantity: Number
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    addItem: function() {
      const self = this;
      self.triggerEvent('changeQty', {data: self.data.quantity + 1});
    },

    removeItem: function() {
      const self = this;
      self.triggerEvent('changeQty', {data: self.data.quantity - 1});
    }
  }
})
