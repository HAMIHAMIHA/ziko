Component({
  properties: {
    community: String,
    quantity: Number
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    changeQuantity: function(e) {
      const self = this;
      let new_quantity = self.data.quantity - 1;
      if (e.currentTarget.dataset.action == 'add') {
        new_quantity = self.data.quantity + 1
      }

      self.setData({
        quantity: new_quantity
      })

      self.triggerEvent('changeQty', {data: new_quantity});
    }
  }
})
