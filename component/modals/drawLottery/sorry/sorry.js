const app = getApp();
Component({
  data: {
    _t: {
      back_to_order: app.globalData.i18n.back_to_order,
      better_luck_next_time: app.globalData.i18n.better_luck_next_time,
      has_won_the_lottery: app.globalData.i18n.has_won_the_lottery,
      not_this_time: app.globalData.i18n.not_this_time,
      sorry: app.globalData.i18n.sorry,
    }
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    showModal: function(winners) {
      const self = this;

      let winner_message = `${ winners[0].order.customer.name }${ app.globalData.i18n.has_won_the_lottery }`;
      self.setData({
        winner_message
      })

      self.selectComponent('#modal_template').showModal();
    },

    closeCheck: function() {
      this.triggerEvent('closeModal');
    },

    toOrder: function() {
      wx.switchTab({
        url: app.routes.orders
      })
    }
  }
})
