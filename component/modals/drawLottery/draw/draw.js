const { communities } = require("../../../../utils/constants.js");

const app = getApp();

Component({
  data: {
    lottery_content: ["/assets/icons/bottle.svg", "/assets/icons/cheese.svg", "/assets/icons/fruit.svg", "/assets/icons/noodle.svg", "/assets/icons/fish.svg"],
  },

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

          new_lottery: app.globalData.i18n.new_lottery,
          spin_to: app.globalData.i18n.spin_to,
          discover_the: app.globalData.i18n.discover_the,
        },

        column1: "i0",
        column2: "i0",
        column3: "i0",
        hander_ball_move: "",
        hander_move: "",
        hander_top_move: ""
      })
      self.selectComponent('#modal_template').showModal();
    },

    makeDraw: function() {
      const self = this;

      setTimeout(() => {
        self.selectComponent('#modal_template').closeModal(false);
        self.triggerEvent('showResult');
      }, 500);
    },

    closeCheck: function() {
      app.api.updateLotteryNotification(this.data.lottery.id).then( () => {
        app.globalData.pause_lottery_check = false;
      })
    },

    startSlotMachine: function () {
      const self = this;
      self.setData({
        hander_ball_move: "hander_ball_move",
        hander_move: "hander_move",
        hander_top_move: "hander_top_move"
      })
      // let time=2;
      // let arr=['column1','column2','column3']
      // let timer =setInterval(function() {
      //   console.log(time)
      //   self.setData({
      //     [arr[time-2]]: self.data.lottery.winner ? 'i4' : `i${time}`
      //   })
      //   time++
      // }, 300)   
      // setTimeout(() => {
      //   clearInterval(timer)
      // }, 1200)
      setTimeout(() => {
        self.setData({
          column1: self.data.lottery.winner ? 'i4' : 'i2'
        })
      }, 300)
      setTimeout(() => {
        self.setData({
          column2: self.data.lottery.winner ? 'i4' : 'i3'
        })
      }, 600)
      setTimeout(() => {
        self.setData({
          column3: self.data.lottery.winner ? 'i4' : 'i4'
        })
      }, 900)
    },
  }
})