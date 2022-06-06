const app = getApp();

Component({
  data: {
    _t: {
      better_luck_next_time: app.globalData.i18n.better_luck_next_time,
      close_it: app.globalData.i18n.close_it,
      has_won_the_lottery: app.globalData.i18n.has_won_the_lottery,
      not_this_time: app.globalData.i18n.not_this_time,
      sorry: app.globalData.i18n.sorry,
    }
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    showModal: function(lottery, winners) {
      const self = this;

      let winner_names = '';
      winners.forEach((w, i) => {
        winner_names = i ? `${winner_names}, ${w.name}` : w.name;
      });

      let winner_message = `${ winners[0].order.customer.name }${ app.globalData.i18n.has_won_the_lottery }`;
      self.setData({
        lottery,
        winner_message
      })

      self.selectComponent('#modal_template').showModal();
    },

    closeCheck: function() {
      app.api.updateLotteryNotification(this.data.lottery.id).then( () => {
        app.globalData.pause_lottery_check = false;
      })
    },

    closeModal: function() {
      this.selectComponent('#modal_template').closeModal();
    }
  }
})
