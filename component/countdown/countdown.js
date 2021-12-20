const { formatTimer } = require("../../utils/util");

const countDownTimer = (page, end_time) => {
  const changeTimer = () => {
    let now = new Date();
    let remaining = end_time - now;

    page.setData({
      time: formatTimer(new Date(remaining))
    })
  }

  setInterval(changeTimer , 1000)
}

Component({
  properties: {
    endTime: String
  },

  lifetimes: {
    attached: function() {
      const self = this;
      countDownTimer(self, new Date(self.data.endTime));
    }
  }
})
