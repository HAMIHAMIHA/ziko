const app = getApp();
const routes = app.routes;

let timer_intervals = [];

Component({
  options: {
    addGlobalClass: true
  },

  data: {
    offers: [{
      id: '01',
      community: "kitchen",
      lottery: true,
      specials: true,
      started: true,
      startTime: "2021-09-21 14:00",
      endTime: "2021-12-20 13:00",
      items: 2
    }, {
      id: '02',
      community: "cellar",
      lottery: true,
      specials: false,
      started: true,
      priceRule: "regular",
      startTime: "2021-09-21 14:00",
      endTime: "2021-12-20 16:00",
      items: 1
    // }, {
    //   id: '03',
    //   community: "cellar",
    //   lottery: false,
    //   specials: true,
    //   started: true,
    //   priceRule: "bourse",
    //   startTime: "2021-09-21 14:00",
    //   endTime: "2021-12-20 19:00",
    //   items: 2
    // }, {
    //   id: '04',
    //   community: "cellar",
    //   lottery: true,
    //   specials: true,
    //   started: true,
    //   priceRule: "freeFall",
    //   startTime: "2021-09-21 14:00",
    //   endTime: "2021-12-20 19:00",
    //   items: 2
    // }, {
    //   id: '05',
    //   community: "cellar",
    //   lottery: false,
    //   specials: true,
    //   started: true,
    //   priceRule: "multiple",
    //   startTime: "2021-09-21 14:00",
    //   endTime: "2021-12-20 19:00",
    //   items: 2
    }, {
      id: '06',
      community: "pet",
      lottery: true,
      specials: true,
      started: true,
      startTime: "2021-09-21 14:00",
      endTime: "2021-12-20 19:30",
      items: 2
    }, {
      id: '07',
      community: "garden",
      lottery: false,
      specials: true,
      started: true,
      startTime: "2021-09-21 14:00",
      endTime: "2021-12-20 19:00",
      items: 2
    }, {
      id: '3',
      community: "kitchen",
      lottery: false,
      started: true,
      specials: true,
      startTime: "2021-10-21 14:00",
      endTime: "2021-12-20 19:00"
    }, {
      id: '4',
      community: "cellar",
      lottery: true,
      specials: true,
      started: true,
      startTime: "2021-10-21 14:00",
      endTime: "2021-12-20 19:00"
    }]
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
