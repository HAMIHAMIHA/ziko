ttabconst countDownTimer = (self, end_time) => {
  console.log(end_time);

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
