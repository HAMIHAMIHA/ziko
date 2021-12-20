const { formatTimer } = require("../../utils/util");

const countDownTimer = (page, end_time) => {
  let now = new Date();
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
        countDownTimer(self, new Date(self.data.endTime))
      }, 1000);
    }
  }
})
