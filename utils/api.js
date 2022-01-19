const db = require('db.config.js');
const config = require('properties.js');

let header = {};

//接口统一封装
const api = (apiMethod, path, data, callback) => {
  if (db.get('userInfo').token) {
    header = {'Authorization': `Bearer ${db.get('userInfo').token}`};
  }
  path = config.api_url + path;

  switch (apiMethod) {
    case "post":
      post(path, data, callback);
      break;
    case "put":
      put(path, data, callback);
      break;
    default:
      get(path, callback)
      break;
  }
}

//get请求
const get = (path, callback) => {
  wx.request({
    url: path,
    header: header,
    success: function (res) {
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
      console.debug('err', err);
    }
  });
}

//post请求
const post = (path, data, callback) => {
  wx.request({
    url: path,
    header: header,
    data: data,
    method: 'POST',
    success: function (res) {
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
      console.debug('err', err);
    }
  });
}

//put请求
const put = (path, data, callback) => {
  wx.request({
    url: path,
    header: header,
    data: data,
    method: 'PUT',
    success: function (res) {
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
      console.debug('err', err);
    }
  });
}

module.exports = {
  // Create order for payment
  createOrder: (id, data, callback) => {
    api('post', `orders/purchase/${id}`, data, callback);
  },

  // Get deliverable address areas
  getAreas: (callback) => {
    api('get', 'delivery-areas', null, callback);
  },

  // Get orders
  getOrders: (filter, callback) => {
    let suffix = `mine?sort=["createdAt","DESC"]&${filter.filter_str}`;
    if (filter.id) suffix = `${filter.id}/mine`;
    api('get', `orders/${suffix}`, null, callback);
  },

  // Get offer with product details
  getOffers: (suffix, callback) => {
    api('get', `offers/details${suffix}`, null, callback);
  },

  getProduct: (id, callback) => {
    api('get', `products/${id}`, data, callback);
  },

  getProfile: (callback) => {
    api('get', 'customers/mine', null, callback);
  },

  // Update user info
  updateProfile: (data, callback) => {
    api('put', `customers/mine`, data, callback);
  },

  // Wechat login with mobile
  wxLogin: (data, callback) => {
    api('post', 'wechat/login', data, callback);
  },

  // Wechat get openid, and user info (if exist)
  wxOpenid: (data, callback) => {
    api('post', 'wechat/openid', data, callback);
  },
}