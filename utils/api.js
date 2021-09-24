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
  if (db.get('token')) {
    header = {'Authorization': `Bearer ${db.get('token')}`};
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
  // loadingModal(true, loadingText);

  wx.request({
    url: path,
    header: header,
    success: function (res) {
      // loadingModal(false, loadingText);

      if (res.data.success === false) {
        callback.error(res.data);
      } else {
        callback.success(res.data);
      }
    },
    fail: function (res) {
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
        console.log(res);
      if (res.data.success === false) {
        callback.error(res.data.message);
      } else {
        callback.success(res.data);
      }
    },
    fail: function (res) {
      console.debug('err', err);
    }
  });
}
//put请求
const put = (path, data, callback, loadingText) => {
  // loadingModal(true, loadingText);

  wx.request({
    url: path,
    header: header,
    data: data,
    method: 'PUT',
    success: function (res) {
      // loadingModal(false, loadingText);

      // if (res.data.success) {
      //   callback.success();
      // } else {
      //   callback.error(res.data)
      // }
    },
    fail: function (res) {
      // loadingModal(false, loadingText);

      // return {
      //   status: false,
      //   data: res.data,
      //   msg: '接口调用失败',
      // };
    },
    complete: function (res) { }
  });
}


const login = (data, callback) => {
  api('post', 'customers/login', data, callback, null)
}

const productCategoriesGet = (callback) => {
  api('get', 'product-categories', null, callback, null)
}

const productTypesGet = (callback) => {
  api('get', 'product-types', null, callback, null)
}


module.exports = {
  // login: login,
  // productCategoriesGet: productCategoriesGet,
  // productTypesGet: productTypesGet
}