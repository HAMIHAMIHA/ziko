Component({
  properties: {
    days: Array,
    week_days: Array,
  },

  data: {
    date: '',
    dateArray: [],
    new_days:""
  },

  options: {
    addGlobalClass: true
  },
  lifetimes: {
    attached: function() {
      console.log(this)
      // 在组件实例进入页面节点树时执行
      this.getWeekDay();
    },
    
  },
  ready: function() { 
    this.getWeekDay();
    console.log(this.data.dateArray)
  },
  pageLifeTime: {
    show: function() {
      const self = this;
      self.setData({
        _t: {
          all: app.globalData.i18n.all
        }
      })
    }
  },
  
  methods: {
    resetDateFilter: function() {
      const self = this;
      self.setData({
        date: ''
      })
    },

    filterByDate: function(e) {
      const self = this;
      let new_date = e.currentTarget.dataset.date;
      self.setData({
        date: new_date
      })

      self.triggerEvent('filterOffers', { date: new_date, change_date: true });
    },
    // dateset
    paddingZero: function (n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return n;
      }
    },
    getWeekDay:function(){
      let that=this;
      let myDate=new Date();
      let month=myDate.getMonth()+1;
      let date=myDate.getDate();
      let week=that.properties;
      myDate.setDate(myDate.getDate());
      let timestemp=new Date().getTime();
      let times=[];
      let dateArray=[];
      times.push(myDate,month,date,week,timestemp)
      // console.log(times)
      for(let i=0;i<14;i++){
        dateArray.push({
          "date":myDate.getDate(),
          "date_str":"not set",
          "day":week.week_days[myDate.getDay()],
          "month":that.paddingZero((myDate.getMonth() + 1)),
          "time":"not set",
          "timestamp":myDate.getTime(),
        })
        myDate.setDate(myDate.getDate()+1)
      }
      console.log(dateArray);
      this.setData({dateArray})
    }


  }
})
