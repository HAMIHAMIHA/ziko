const { showLoading } = require("../../utils/common");
const { findIndex } = require("../../utils/util");

Component({
  properties: {
    days: Array
  },

  data: {
    date: ''
  },

  options: {
    addGlobalClass: true
  },

  pageLifeTime: {
    show: function() {
      const self = this;
      self.setData({
        _t: {
          all: app.globalData.i18n.all
        }
      })
    }
  },
  
  methods: {
    resetDateFilter: function() {
      const self = this;
      self.setData({
        date: ''
      })
    },

    filterByDate: function(e) {
      const self = this;
      let new_date = e.currentTarget.dataset.date;
      self.setData({
        date: new_date
      })

      self.triggerEvent('filterOffers', { date: new_date, change_date: true });
    }
  }
})
