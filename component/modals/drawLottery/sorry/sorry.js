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

  }
})
