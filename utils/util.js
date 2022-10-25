const app = getApp();

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`
}

export const findIndex = (list, find, key) => {
  return list.findIndex(item => item[key] == find);
}

export const formatDate = (format, date) => {
  let date_str = format;
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = formatNumber(date.getDate())

  let new_date = date_str.replace('yyyy', year)
                    .replace('mth', getApp().globalData.i18n.month[month])
                    .replace('mm', formatNumber(month))
                    .replace('dd', day);

  return new_date;
}

// Output time to hh:mm format
export const formatTime = dateLong => {
  const date = new Date(dateLong)
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

export const formatCountDown = dateLong => {
  console.log("datelong", dateLong)
  const date = new Date(dateLong) - new Date();
  const _i18n = app.globalData.i18n.timer;
  console.log('date', date)
  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor(date / (1000 * 60 * 60 * 24));
  const year = Math.floor(days/365);
  const months = Math.floor(days/30);
  const hours = Math.floor((date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((date % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((date % (1000 * 60)) / 1000);
  console.log(year, months, days, hours, minutes, seconds, 'format countdown',)

  if (year > 0) {
    if (year === 1) return `${_i18n.in} ${year} ${_i18n.years}`;
    return `${_i18n.in} ${year} ${_i18n.long_years}`
  }
  if (months > 0) {
    if (months === 1) return `${_i18n.in} ${months} ${_i18n.months}`;
    return `${_i18n.in} ${months} ${_i18n.long_months}`
  }
  if (days > 0) {
    if (days === 1) return _i18n.tomorrow;
    return `${_i18n.in} ${days} ${_i18n.long_days}`;
  }
  if (hours > 0) {
    return `${_i18n.in} ${hours} ${_i18n.long_hours}`;
  }
  // if (days || hours) time.push(`${formatNumber(hours)}:${formatNumber(minutes)}`);
// if (days || hours) time.push(`${formatNumber(hours)}${_i18n.hours}`);
//   if ((days && hours) || minutes) time.push(`${formatNumber(minutes)}`);
// if ((days && hours) || minutes) time.push(`${formatNumber(minutes)}${_i18n.minutes}`);
  // time.push(`${formatNumber(seconds)}${_i18n.seconds}`);


}

export const formatTimer = dateLong => {
  const _i18n = app.globalData.i18n.timer;
  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor(dateLong / (1000 * 60 * 60 * 24));
  const hours = Math.floor((dateLong % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((dateLong % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((dateLong % (1000 * 60)) / 1000);

  let time = [];
  if (days) {
    if (days == 1) {
      time.push(`${days}${_i18n.days}`);
    } else {
      time.push(`${days}${_i18n.long_days}`);
    }
  }
  if (days || hours) time.push(`${hours}${_i18n.hours}`);
  if ((days && hours) || minutes) time.push(`${minutes}${_i18n.minutes}`);
    
  return time.join(" ");
}

export const formatWeekDate = dateLong => {
  const date = new Date(dateLong);
  const i18n = getApp().globalData.i18n;

  // Month, date, and day of week
  const day = i18n.days[date.getDay()];
  const mth = i18n.month[date.getMonth() + 1];
  const date_val = formatNumber(date.getDate());

  // Time in 12 hours format
  const hour = date.getHours();
  const hour_12 = hour % 12 || 12;
  const time = [hour_12, date.getMinutes()].map(formatNumber).join(':');
  const unit = hour >= 12 ? i18n.pm : i18n.am;

  return {
    day: day,
    month: mth,
    date: date_val,
    time: getApp().db.get('language') == 'zh' ?  `${unit} ${time}` : `${time} ${unit}`,
    date_str: getApp().db.get('language') == 'zh' ? `${day} ${mth}${date_val}日` : `${day} ${date_val} ${mth},` ,
    timestamp: date.setHours(0, 0, 0, 0)
  }
}

export const mapDeliveryDates = dates => {
  let current_month = '';

  dates = dates.sort();
  return dates.map( date => {
    let res = '';

    let d = new Date(date);
    let mth = d.getMonth() + 1;
    if (mth != current_month) {
      res += `${ app.globalData.i18n.month[mth] }${ (app.db.get('language') == 'en') ? ' ' : '' }`;
      current_month = mth;
    }

    let day = d.getDate();
    res += `${ day }${ app.globalData.i18n.date_suffix[`${day}`[`${day}`.length - 1]] }`
    return res;
  }).join(', ');
}

// Check Media type
export const _checkMediaType = type => {
  if (type.match(/^image/ig)) {
    return "image";
  } else if (type.match(/^video/ig)) {
    return "video";
  }
}
export const truncateText =  (str, format, length) => {
  if (typeof str !== "string") return;
  let index = 0;
  for (let i = 0; i < length; i++) {
    const nextIndex = str?.indexOf( format, index + 1);
    if (nextIndex === -1) return str;
    index = nextIndex;
  }
  return str.substring(0, index).padEnd(index + 3, ".");
}

