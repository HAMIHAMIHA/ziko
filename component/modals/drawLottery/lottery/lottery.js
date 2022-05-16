const app = getApp();

let lottery, lottery_winners;

Component({
  methods: {
    show: function(res) {
      const _showDraw = () => {
        this.selectComponent('#draw_modal').show(res[0]);
      }

      lottery = res[0];

      lottery_winners = [];
      if (!res[0].winner) {
        app.api.getLotteries(`offerDrawId=${res[0].offerDrawId}&offer=${res[0].offer.id}`).then( res => {
          lottery_winners = res[0].winners;
          _showDraw();
        })
      } else {
        _showDraw();
      }
    },

    showResult: function(e) {
      const self = this;

      if (lottery.winner) {
        self.selectComponent('#win_modal').showModal(lottery);
      } else {
        self.selectComponent('#sorry_modal').showModal(lottery, lottery_winners);
      }
    }
  }
})