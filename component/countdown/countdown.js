const { formatTimer } = require("../../utils/util");

const countDownTimer = (page, end) => {
  let now = new Date();

  let end_time = new Date(end);
  let remaining = end_time - now;

  let time = "event ended";
  if (remaining > 0) {
    time = formatTimer(new Date(remaining));
  }

  page.setData({
    time: time
  })
}

Component({
  properties: {
    endTime: String
  },

  lifetimes: {
    attached: function() {
      const self = this;

      
      setInterval(() => {
        countDownTimer(self, '2021-12-20T20:00:00.000Z')
      }, 1000);
    }
  }
})
