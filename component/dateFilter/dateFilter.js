Component({
  properties: {
    days: Array,
    week_days: Array,
  },

  data: {
    date: '',
    dateArray: [],
    new_days: ""
  },

  options: {
    addGlobalClass: true
  },
  lifetimes: {
    attached: function () {
      this.getWeekDay();
    },

  },
  ready: function () {
    this.getWeekDay();
  },
  pageLifeTime: {
    show: function () {
      const self = this;
      self.setData({
        _t: {
          all: app.globalData.i18n.all
        }
      })
    }
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
    // dateset
    paddingZero: function (n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return n;
      }
    },
    getWeekDay: function () {
      let self = this;
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let date = myDate.getDate();
      let week = self.properties;
      myDate.setDate(myDate.getDate());
      let timestemp = new Date().getTime();
      let times = [];
      let dateArray = [];
      times.push(myDate, month, date, week, timestemp)
      // console.log(times)
      for (let i = 0; i < 14; i++) {
        dateArray.push({
          "date": myDate.getDate(),
          "date_str": "not set",
          "day": week.week_days[myDate.getDay()],
          "month": self.paddingZero((myDate.getMonth() + 1)),
          "time": "not set",
          "timestamp": myDate.getTime(),
        })
        myDate.setDate(myDate.getDate() + 1)
      }
      // console.log(dateArray);
      self.setData({
        dateArray
      })
    }
  }
})