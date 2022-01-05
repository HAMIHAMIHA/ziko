const app = getApp();

let total = 0; // TEMP

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
    },

    changeQty: function(e) {
      const self = this;
      let new_qty = e.detail.data ? e.detail.data : 0;
      let target = e.currentTarget.dataset.idx;
      
      let products = self.data.products; // Product list used to show on page

      // TODO change storage quantity
      // let storage_list = app.db.get('cart'); // Product list saved in storage
      // let s_idx = page_list[target].storage_idx; // Index of product in storage

      if (new_qty == 0) {
        // products.splice(target, 1);
        // storage_list.splice(s_idx, 1);
      } else {
        products[target].qty = new_qty;
        // storage_list[s_idx].qty = new_qty;
      }

      // Set to page data
      self.setData({
        products: products
      })

      // TODO
      // Set to storage
      // app.db.set('cart', storage_list);

      // Update total for checkout
      // Get storage for this offer, find index of current product, find price of product, add/minus from total
      total += 100; // TEMP
      self.triggerEvent('updateTotal', { total: total });
    },
  }
})
