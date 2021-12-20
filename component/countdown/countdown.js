const { formatTimer } = require("../../utils/util");

let timer = [];

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
    endTime: String,
    timer: Boolean
  },

  methods: {
    setTimer: function(startTimer) {
      const self = this;

      if (!startTimer) {
        for(var i in timer) {
          clearInterval(timer[i]);
        }
        return;
      }

      timer.push(setInterval(() => {
        countDownTimer(self, '2021-12-20T20:00:00.000Z')
      }, 1000));
    }
  }
})