const app = getApp();
const _routes = app.routes;

Component({
  options: {
    addGlobalClass: true
  },

  properties: {

  },

  data: {
    offers: [
      {
        id: 1,
        type: "kitchen",
        lottery: true,
        specials: true,
        started: true,
        startTime: "2021-09-21 14:00",
        endTime: "2021-10-21 16:00",
        items: 2
      },
      {
        id: 11,
        type: "cellar",
        lottery: true,
        specials: false,
        started: true,
        startTime: "2021-09-21 14:00",
        endTime: "2021-10-21 16:00",
        items: 1
      },
      {
        id: 2,
        type: "pet",
        lottery: false,
        specials: false,
        started: true,
        startTime: "2021-09-21 14:00",
        endTime: "2021-10-21 16:00",
        items: 0
      },
      {
        id: 3,
        type: "kitchen",
        lottery: true,
        specials: true,
        started: false,
        startTime: "2021-10-21 14:00",
        endTime: "2021-10-21 16:00"
      },
      {
        id: 3,
        type: "kitchen",
        lottery: false,
        specials: false,
        started: false,
        startTime: "2021-10-21 14:00",
        endTime: "2021-10-21 16:00"
      },
      {
        id: 3,
        type: "kitchen",
        lottery: false,
        started: false,
        specials: true,
        startTime: "2021-10-21 14:00",
        endTime: "2021-10-21 16:00"
      },
      {
        id: 4,
        type: "cellar",
        lottery: true,
        specials: true,
        started: false,
        startTime: "2021-10-21 14:00",
        endTime: "2021-10-21 16:00"
      }
    ]
  },

  methods: {
    toOffer: function(e) {
      console.log(e);
      let started = e.currentTarget.dataset.started;
      let id = e.currentTarget.dataset.offerId;

      if (started)
      wx.navigateTo({
        url: _routes.offer + '?id=' + id,
      })
    }
  }
})
