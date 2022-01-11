const { formatTimer } = require("../../utils/util");

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
    setTimer: function(pageTimers, startTimer) {
      const self = this;

      // Stop timer
      if (!startTimer) {
        for(var i in pageTimers) {
          clearInterval(pageTimers[i]);
        }
        return;
      }

      // Start timer
      let t = setInterval(() => {
        countDownTimer(self, self.data.endTime);
        // countDownTimer(self, '2022-01-27T20:00:00.000Z') // TEMP data
      }, 1000)
      return t;
    }
  }
})