const { formatTimer } = require("../../utils/util.js");

// Set countdown time
const countDownTimer = (page, end) => {
  let now = new Date().getTime();

  let end_time = new Date(end).getTime();
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
      }, 1000)
      return t;
    }
  }
})