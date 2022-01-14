Component({
  properties: {
    community: String,
    quantity: Number
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    changeAmount: function(e) {
      const self = this;

      // Calculate new amount
      let new_quantity = self.data.quantity - 1;
      if (e.currentTarget.dataset.action == 'add') {
        new_quantity = self.data.quantity + 1
      }

      // Change amount displaying
      self.setData({
        quantity: new_quantity
      })

      // Update cart amount
      self.triggerEvent('changeAmount', { amount: new_quantity });
    }
  }
})
