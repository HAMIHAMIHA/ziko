const app = getApp();

let lotteries = [];
let current_index = 0;
let lottery_winners;

const _showDrawModal = page => {
  const _sePagetData = () => {
    page.setData({
      current_index: current_index
    })
    page.selectComponent('#draw_modal').show(lotteries[current_index]);
  }

  lottery_winners = [];
  if (!lotteries[current_index].winner) {
    app.api.getLotteries(`offerDrawId=${lotteries[current_index].offerDrawId}`).then( res => {
      lottery_winners = res[0].winners;
      _sePagetData();
    })
  } else {
    _sePagetData();
  }
}

Component({
  methods: {
    show: function(res) {
      const self = this;
      lotteries = res;
      _showDrawModal(self);
    },

    closeModal: function() {
      console.log('check before close');
      const self = this;
      if ((current_index + 1) < lotteries.length) {
        current_index++;
        _showDrawModal(self)
      } else {
        app.checkForLotteryNotification();
      }
    },

    showResult: function(e) {
      const self = this;

      let lottery = lotteries[self.data.current_index];

      app.api.updateLotteryNotification(lottery.id).then( () => {
        if (lottery.winner) {
          self.selectComponent('#win_modal').showModal(lottery);
        } else {
          self.selectComponent('#sorry_modal').showModal(lottery_winners);
        }
      })
    }
  }
})