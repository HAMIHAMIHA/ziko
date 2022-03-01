let db = require('db.config.js');
let config = require('properties.js');
let { showLoading } = require('./common');

// Generate header and url
const _unifyHeaders = (path) => {
  let header = {};
  if (db.get('userInfo').token) {
    header = {'Authorization': `Bearer ${db.get('userInfo').token}`};
  }

  return [header, config.api_url + path];
}

//get请求
const get = (path) => {
  let [header, url] = _unifyHeaders(path);
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: header,
      success: function (res) {
        showLoading(false);
        if (res.data.success === false) {
          console.debug(res.data.message);
          if (reject) {
            reject(res.data.message);
          }
        } else {
          resolve(res.data);
        }
      },
      fail: function (res) {
        showLoading(false);
        console.debug('err', res);
      }
    });
  });
}

// post请求
const post = (path, data) => {
  let [header, url] = _unifyHeaders(path);
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: header,
      data: data,
      method: 'POST',
      success: function (res) {
        showLoading(false);
        if (res.data.success === false) {
          console.debug(res.data.message);
          if (reject) {
            reject(res.data.message);
          }
        } else {
          resolve(res.data);
        }
      },
      fail: function (res) {
        showLoading(false);
        console.debug('err', res);
      }
    });
  });
}

// put请求
const put = (path, data, callback) => {
  let [header, url] = _unifyHeaders(path);
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: header,
      data: data,
      method: 'PUT',
      success: function (res) {
        showLoading(false);
        if (res.data.success === false) {
          console.debug(res.data.message);
          if (reject) {
            reject(res.data.message);
          }
        } else {
          resolve(res.data);
        }
      },
      fail: function (res) {
        showLoading(false);
        console.debug('err', res);
      }
    });
  });
}

// Upload Request
const upload = (folder_path, file) => {
  let path = `files/${folder_path}`;
  let [header, url] = _unifyHeaders(path);
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: url,
      filePath: file,
      header: header,
      name: folder_path,
      success: function (res) {
        if (res.statusCode != 200) {
          showLoading(false);
          console.debug(res.data.message);
          if (reject) {
            reject(res.data.message);
          }
          return;
        }
        resolve(JSON.parse(res.data));
      },
      fail: function (res) {
        showLoading(false);
        console.debug('err', res);
      }
    })
  });
}

module.exports = {
  // Create order for payment
  createOrder: (id, data) => {
    return post(`orders/purchase/${id}`, data);
  },

  // Get deliverable address areas
  getAreas: () => {
    return get('delivery-areas');
  },

  // Get orders
  getOrders: (filter) => {
    let suffix = `mine?sort=["createdAt","DESC"]&${filter.filter_str}`;
    if (filter.id) suffix = `${filter.id}/mine`;
    return get(`orders/${suffix}`);
  },

  // Get offer with product details
  getOffers: (suffix) => {
    return get(`offers/details${suffix}`);
  },

  // Get product detail
  // getProduct: (id, callback) => {
  //   get(`products/${id}`, data);
  // },

  // Get user information
  getProfile: () => {
    return get('customers/mine');
  },

  // Get prepay id for wechat pay
  orderPrePay: (id) => {
    return get(`orders/${id}/prepay`);
  },

  // Set view for offer
  setOfferView: (id) => {
    return get(`offers/${id}/viewed`);
  },

  // Update user info
  updateProfile: (data) => {
    return put(`customers/mine`, data);
  },

  // Upload profile picture
  uploadProfilePicture: (file) => {
    return upload('customer-picture', file);
  },

  // Wechat login with mobile
  wxLogin: (data) => {
    return post('wechat/login', data);
  },

  // Wechat get openid, and user info (if exist)
  wxOpenid: (data) => {
    return post('wechat/openid', data);
  },
}