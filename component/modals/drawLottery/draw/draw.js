const { communities } = require("../../../../utils/constants.js");

const app = getApp();

Component({
  options: {
    addGlobalClass: true
  },

  methods: {
    show: function(lottery) {
      const self = this;

      self.setData({
        lottery,
        _communities: communities,
        _language: app.db.get('language'),
        _t: {
          lets_go: app.globalData.i18n.lets_go,
          new_lottery_drawn: app.globalData.i18n.new_lottery_drawn,
          participants: app.globalData.i18n.participants,
        },
      })
      self.selectComponent('#modal_template').showModal();
    },

    makeDraw: function() {
      const self = this;
      self.selectComponent('#modal_template').closeModal(false);
      self.triggerEvent('showResult');
    },

    closeCheck: function() {
      app.api.updateLotteryNotification(this.data.lottery.id).then( () => {
        app.globalData.pause_lottery_check = false;
      })
    },
  }
})