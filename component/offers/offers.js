const {
  communities
} = require("../../utils/constants.js");
const {
  showToast
} = require("../../utils/common.js")

const app = getApp();
const routes = app.routes;

let timer_intervals = [];
let now_timer;

Component({
  properties: {
    offers: Array,
  },

  data: {
    _communities: communities,
    // _language: app.db.get('language'),
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    updateCards: function (_t, startTimer) {
      const self = this;

      // Set offer card contents
      self.setData({
        now: new Date().getTime(),
        _folders: {
          offer_banner: app.folders.offer_banner,
        },
        _t: _t,
        _cart: app.db.get('cart'),
        _language: app.db.get('language'),
      })
      // Start or end timers
      let timer = self.selectAllComponents('.timer');
      if (startTimer) {
        timer_intervals = [];
        for (var i in timer) {
          timer_intervals.push(timer[i].setTimer([], startTimer));
        }

        now_timer = setInterval(() => {
          let new_timers = self.selectAllComponents('.timer');
          if (timer.length < new_timers.length) {
            new_timers.slice(timer.length, new_timers.length).forEach(t => {
              timer_intervals.push(t.setTimer([], startTimer));
            })
            timer = new_timers;
          }

          self.setData({
            now: new Date().getTime(),
          })
        }, 1000)
      } else {
        if (!timer.length) return;

        timer[0].setTimer(timer_intervals, startTimer);
        clearInterval(now_timer);
        timer_intervals = [];
      }

      let offers = self.data.offers;
      for (const i in offers) {
        if (offers[i].community.id) {
          offers[i].community = communities[offers[i].community.id];
        }
      }
      self.setData({
        offers: offers
      })
    },

    swiperChange: function (e) {
      const self = this;
      let offers = self.data.offers;
      offers[e.currentTarget.dataset.offer_idx].banners.index = e.detail.current

      self.setData({
        offers
      })
    },

    // Navigate to offer page
    toOffer: function (e) {
      const self = this;
      let data = e.currentTarget.dataset;

      // if (!data.started || new Date(data.end_time).getTime() <= new Date().getTime()) return;

      var url = routes.offer_regular;
      // if (communities[data.community] === "cellar" && data.type && data.type !== "regular") {
      if (data.community === "cellar" && data.type && data.type !== "regular") {
        if (data.type == "bourse") {
          url = routes.offer_bourse;
        } else {
          url = routes.offer_cellar;
        }
      }

      self.triggerEvent('navigatePage', {
        navigating: true
      });

      wx.navigateTo({
        url: url + '?id=' + data.offerId,
      })
    },

    getReminder: function (e) {
      const self = this;
      const watch = e.currentTarget.dataset.watch;

      if (!app.db.get('userInfo') || !app.db.get('userInfo').token) {
        showToast(app.globalData.i18n.need_login);
        return;
      }

      if (watch == 'true') {
        showToast(app.globalData.i18n.already_got_you);
      } else {
        // Request subscription before checkout if lottery / special included
        wx.requestSubscribeMessage({
          tmplIds: [app.subscribe.offer],
          complete: (res) => {
            // Get subscription
            if (res[app.subscribe.offer] === "accept") {
              app.api.setNotificationOffer(e.currentTarget.dataset.offer_id).then(res => {
                // Change the subscription button status
                let offers = self.data.offers;
                for (const i in offers) {
                  if (offers[i].id == e.currentTarget.dataset.offer_id) {
                    offers[i].watch = res.watch;
                    break;
                  }
                }

                self.setData({
                  offers: offers,
                })
              });
            }
          }
        })
      }
    }
  }
})