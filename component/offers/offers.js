import { communities } from "../../utils/constants";

const app = getApp();
const routes = app.routes;

let timer_intervals = [];

Component({
  properties: {
    offers: Array,
  },

  data: {
    _communities: communities,
    _language: app.db.get('language'),
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    // Toggle timer invervals
    changeTimers: function(startTimer, _t) {
      const self = this;

      // Set offer card translation
      self.setData({
        _t: _t
      })

      // Start or end timers
      let timer = self.selectAllComponents('.timer');
      if (startTimer) {
        for (var i in timer) {
          timer_intervals.push(timer[i].setTimer([], startTimer));
        }
      } else {
        if (timer.length == 0) return;

        timer[0].setTimer(timer_intervals, startTimer);
        timer_intervals = [];
      }
    },

    // Navigate to offer page
    toOffer: function(e) {
      const self = this;
      let data = e.currentTarget.dataset;

      if (!data.started) return;

      var url = routes.offer_regular;
      if (data.community == "cellar") {
        if (data.priceRule == "bourse") {
          url = routes.offer_bourse;
        } else if (data.priceRule != "regular") {
          url = routes.offer_cellar;
        }
      }

      self.triggerEvent('navigatePage', { navigating: true });  

      wx.navigateTo({
        // url: url + '?id=' + id,
        url: url + '?id=' + data.offerId + '&community=' + data.community + '&rule=' + data.priceRule,
      })
    }
  }
})
