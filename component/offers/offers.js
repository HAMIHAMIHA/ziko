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
    updateCards: function(_t, startTimer) {
      const self = this;

      // Set offer card contents
      self.setData({
        _folders: {
          offer_banner: app.folders.offer_banner,
        },
        _t: _t,
        _cart: app.db.get('cart')
      })

      console.log(startTimer);
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
      if (communities[data.community] === "cellar" && data.type && data.type !== "regular") {
        if (data.type == "bourse") {
          url = routes.offer_bourse;
        } else {
          url = routes.offer_cellar;
        }
      }

      self.triggerEvent('navigatePage', { navigating: true });  

      wx.navigateTo({
        url: url + '?id=' + data.offerId,
      })
    }
  }
})
