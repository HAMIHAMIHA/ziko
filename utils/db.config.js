//取值
const get = (key) => {
  try {
    return wx.getStorageSync(key);
  } catch (e) {
    return false;
  }
}

//赋值
const set = (key, value) => {
  try {
    return wx.setStorageSync(key, value);
  } catch (e) {
    return false;
  }
}

//移除
const del = (key) => {
  try {
    return wx.removeStorageSync(key);
  } catch (e) {
    return false;
  }
}

//清空
const clear = (sync = false) => {
  try {
    if (sync) {
      return wx.clearStorageSync();
    } else {
      wx.clearStorage();
    }
  } catch (e) {
    return false;
  }
}

module.exports = {
  get,
  set,
  del,
  clear
}