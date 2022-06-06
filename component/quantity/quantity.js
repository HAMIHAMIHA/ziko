const { showToast } = require("../../utils/common.js");

const app = getApp();

Component({
  properties: {
    community: String,
    amount: Number,
    stock: Number,
    product_id: String,
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

      // Prevent users from adding above the available amount
      if (new_amount > self.data.stock) return;

      // Prevent users from removing the last item in cart
      let pages = getCurrentPages();
      let current_page = pages[pages.length - 1];
      if (!self.data.community && e.currentTarget.dataset.action == 'remove' && current_page.data.cart.count == 1) {
        showToast(app.globalData.i18n.minimum_in_cart);
        return;
      } 

      // Change amount displaying
      self.setData({
        amount: new_amount
      })

      // Update cart amount
      self.triggerEvent('changeAmount', { amount: new_amount });
    },

    updateData: function(cart, product) {
      const self = this;

      self.setData({
        amount: cart ? cart.products[self.data.product_id] ? cart.products[self.data.product_id].amount : 0 : 0,
        stock: product.actualStock,
      })
    }
  }
})
