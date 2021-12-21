const { formatTimer } = require("../../utils/util");

let timer = []; // Keep track of all intervals

// Set countdown time
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

  methods: {
    setTimer: function(startTimer) {
      const self = this;

      // Stop timer
      if (!startTimer) {
        for(var i in timer) {
          clearInterval(timer[i]);
        }
        return;
      }

      // Start timer
      timer.push(setInterval(() => {
        // countDownTimer(self, self.data.endTime);
        countDownTimer(self, '2021-12-21T20:00:00.000Z') // TEMP data
      }, 1000));
    }
  }
})