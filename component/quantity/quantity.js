Component({
  properties: {
    community: String,
    amount: Number
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    changeAmount: function(e) {
      const self = this;

      // Calculate new amount
      let new_amount = self.data.amount - 1;
      if (e.currentTarget.dataset.action == 'add') {
        new_amount = self.data.amount + 1
      }

      // Change amount displaying
      self.setData({
        amount: new_amount
      })

      // Update cart amount
      self.triggerEvent('changeAmount', { amount: new_amount });
    }
  }
})
