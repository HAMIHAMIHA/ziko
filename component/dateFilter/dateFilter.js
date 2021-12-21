const { showLoading } = require("../../utils/common");
const { findIndex } = require("../../utils/util");

Component({
  data: {
    dates: []
  },

  options: {
    addGlobalClass: true
  },

  pageLifeTime: {
    show: function() {
      const self = this;
      self.setData({
        _t: {
          all: app.globalData.i18n.all,
          week_days: app.globalData.i18n.week_days
        }
      })
    }
  },
  
  methods: {
    updateFilter: function(offers, filter_date) {
      const self = this;
      // TODO show loading
      // showLoading(true);

      let offer_dates = [{
        date: 0,
        day: 'All',
        week: ''
      }];
    
      for (var item in offers) {
        let d = new Date(offers[item].startTime).setHours(0, 0, 0, 0);
        let date = new Date(d);

        if (findIndex(offer_dates, date, 'date') == -1) {
          offer_dates.push({
            date: date,
            day: date.getDate(),
            week: date.getDay()
          })
        }
        
        self.setData({
          selected: filter_date ? new Date(filter_date).setHours(0, 0, 0, 0) : 0
        })

        console.log(offer_dates);

        if (JSON.stringify(self.data.dates) == JSON.stringify(offer_dates)) {
          self.setData({
            dates: offer_dates
          })
        }
      }
      // TODO end loading
      // showLoading(false);
    },

    filterByDate: function(e) {
      const self = this;
      self.triggerEvent('filterOffers', {date: self.data.date});
    }
  }
})
