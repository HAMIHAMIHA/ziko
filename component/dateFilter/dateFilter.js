const { showLoading } = require("../../utils/common");
const { findIndex } = require("../../utils/util");

Component({
  data: {
    dates: []
  },

  options: {
    addGlobalClass: true
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
        let d = new Date(offers[item].startDate).setHours(0, 0, 0, 0);

        if (findIndex(offer_dates, d, 'date') == -1) {
          offer_dates.push({
            date: d,
            day: d.getDate(),
            week: d.getDayOfWeek()
          })
        }
        
        self.setData({
          selected: filter_date ? new Date(filter_date).setHours(0, 0, 0, 0) : 0
        })

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
