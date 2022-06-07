//取值
export const get = (key) => {
  try {
    return wx.getStorageSync(key);
  } catch (e) {
    return false;
  }
}

//赋值
export const set = (key, value) => {
  try {
    return wx.setStorageSync(key, value);
  } catch (e) {
    return false;
  }
}

//移除
export const del = (key) => {
  try {
    return wx.removeStorageSync(key);
  } catch (e) {
    return false;
  }
}

//清空
export const clear = (sync = false) => {
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