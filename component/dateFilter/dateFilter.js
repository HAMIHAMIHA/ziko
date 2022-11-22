const app = getApp();

Component({
  properties: {
    days: Array,
  },

  data: {
    date: '',
    dateArray: [],
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    resetDateFilter: function () {
      const self = this;
      self.setData({
        date: ''
      })
    },

    filterByDate: function (e) {
      const self = this;
      let new_date = e.currentTarget.dataset.date;
      self.setData({
        date: new_date
      })

      self.triggerEvent('filterOffers', {
        date: new_date,
        change_date: true
      });
    },

    getWeekDay: function () {
      const self = this;
      let date = new Date();
      let dateArray = [];

      self.setData({
        _t: {
          all: app.globalData.i18n.all,
          days: app.globalData.i18n.days,
        }
      })

      for (let i = 0; i < 14; i++) {
        dateArray.push({
          date: date.getDate(),
          day: self.data._t.days[date.getDay()],
          timestamp: date.setHours(0, 0, 0, 0),
        })
        date.setDate(date.getDate() + 1)
      }

      self.setData({
        dateArray
      })
    }
  }
})