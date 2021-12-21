const db = require('db.config.js');
const config = require('properties.js');

let header = {};

const loadingModal = (show, text) => {
  if (text && show) {
    wx.showLoading({
      title: text
    });
  } else if (text && !show) {
    wx.hideLoading();
  }
}

//接口统一封装
const api = (apiMethod, path, data, callback, loadingText) => {
  if (db.get('userInfo').token) {
    header = {'Authorization': `Bearer ${db.get('userInfo').token}`};
  }
  path = config.api_url + path;

  switch (apiMethod) {
    case "post":
      post(path, data, callback, loadingText);
      break;
    case "put":
      put(path, data, callback, loadingText);
      break;
    default:
      get(path, callback, loadingText)
      break;
  }
}

//get请求
const get = (path, callback, loadingText) => {
  loadingModal(true, loadingText);

  wx.request({
    url: path,
    header: header,
    success: function (res) {
      loadingModal(false, loadingText);

      if (res.data.success === false) {
        console.debug(res.data.message);
        if (callback.error) {
          callback.error(res.data.message);
        }
      } else {
        callback.success(res.data);
      }
    },
    fail: function (res) {
      loadingModal(false, loadingText);
      console.debug('err', err);
    }
  });
}

//post请求
const post = (path, data, callback, loadingText) => {
  loadingModal(true, loadingText);

  wx.request({
    url: path,
    header: header,
    data: data,
    method: 'POST',
    success: function (res) {
      loadingModal(false, loadingText);
      if (res.data.success === false) {
        console.debug(res.data.message);
        if (callback.error) {
          callback.error(res.data.message);
        }
      } else {
        callback.success(res.data);
      }
    },
    fail: function (res) {
      loadingModal(false, loadingText);
      console.debug('err', err);
    }
  });
}
//put请求
const put = (path, data, callback, loadingText) => {
  loadingModal(true, loadingText);

  wx.request({
    url: path,
    header: header,
    data: data,
    method: 'PUT',
    success: function (res) {
      loadingModal(false, loadingText);
      if (res.data.success === false) {
        console.debug(res.data.message);
        if (callback.error) {
          callback.error(res.data.message);
        }
      } else {
        callback.success(res.data);
      }
    },
    fail: function (res) {
      loadingModal(false, loadingText);
      console.debug('err', err);
    }
  });
}


module.exports = {
  login: (data, callback) => {
    api('post', 'wechat/login', data, callback, null)
  },

  productCategoriesGet: (callback) => {
    api('get', 'product-categories', null, callback, null)
  },

  productTypesGet: (callback) => {
    api('get', 'product-types', null, callback, null)
  }
}