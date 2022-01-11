const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`
}

module.exports = {
  findIndex: (list, find, key) => {
    return list.findIndex(item => item[key] == find);
  },

  formatDate: dateLong => {
    // Output date to yyyy-mm-dd format
    const date = new Date(dateLong);
    const year = date.getFullYear();
    const month = date.getMonth() + 1
    const day = date.getDate();
  
    return [year, month, day].map(formatNumber).join('-')
  },

  // Output time to hh:mm format
  formatTime: dateLong => {
    const date = new Date(dateLong)
    const hour = date.getHours()
    const minute = date.getMinutes()
    const seconds = date.getSeconds()
  
    return [hour, minute, seconds].map(formatNumber).join(':')
  },

  formatTimer: dateLong => {
    let time = dateLong / 1000;
  
    // let day = parseInt(time / (60 * 60 * 24));
    let hour = parseInt(time % (60 * 60 * 24) / 3600);
    let minute = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let seconds = parseInt(time % (60 * 60 * 24) % 3600 % 60);
  
    return [hour, minute, seconds].map(formatNumber).join(':')
  },

  formatWeekDate: dateLong => {
    const date = new Date(dateLong);
    // const hour = date.getHours()
    // const minute = date.getMinutes()
    // const seconds = date.getSeconds()
  
    // return [hour, minute, seconds].map(formatNumber).join(':')
  },
}