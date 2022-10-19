const app = getApp();

Component({
  properties: {
    _current_user: String,
    // _offer: Object,
    _offer: {
      type: Object,
      observer: function (newVal, oldVal, changePath) {
        const self = this;
        const lotteryDraws = newVal.miniprogram?.lottery?.draws;

        lotteryDraws?.map(draw => {
          if (draw?.winners?.length > 0) {
            draw.winners.map(winner => {
              let winnerNameSplit = winner.name.split('');
              for (const i in winnerNameSplit) {
                if (i != 0) {
                  winnerNameSplit[i] = '*';
                }
              }
              winner.name = winnerNameSplit.join('');
            })
          }
        })

        self.setData({
          '_offer.miniprogram.lottery.draws': lotteryDraws,
        })
      }
    },
    _product_names: Object,
    _t: Object,
    offer_page: Boolean,
  },

  data: {
    _folders: {
      custom_image: app.folders.custom_image,
      profile_picture: app.folders.customer_picture
    },
    _routes: {
      terms: app.routes.terms
    },
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    refresh: function (_offer) {
      this.setData({
        _offer
      })
    }
  }
})