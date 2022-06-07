const { showLoading } = require('./common.js');
const db = require('./db.config.js');
const config = require('./properties.js');

// Generate header and url
const _unifyHeaders = (path) => {
  let header = {};
  if (db.get('userInfo').token) {
    header = {'Authorization': `Bearer ${db.get('userInfo').token}`};
  }

  return [header, `${config.api_url}${path}`];
}

//get请求
const get = (path) => {
  let [header, url] = _unifyHeaders(path);
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      header,
      success: function (res) {
        if (res.data?.success === false) {
          showLoading(false);
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
      url,
      header,
      data,
      method: 'POST',
      success: function (res) {
        if (res.data?.success === false) {
          showLoading(false);
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
const put = (path, data) => {
  let [header, url] = _unifyHeaders(path);
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      header,
      data,
      method: 'PUT',
      success: function (res) {
        if (res.data?.success === false) {
          showLoading(false);
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
      url,
      filePath: file,
      header,
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

  // Get buyers for offer
  getOfferBuyers: id => {
    return get(`offers/${id}/buyers?channel=miniprogram`);
  },

  // Get lottery
  getLotteries: (filter) => {
    let url = filter ? `lottery-draws/details?${filter}` : 'lottery-draws/details';
    return get(url);
  },

  // Get lottery notifications
  getLotteryNotifications: () => {
    return get('lottery-notifications/mine?channel=miniprogram');
  },

  // Get recipe tags
  getRecipeTags: () => {
    return get('recipe-tags/details');
  },

  // Get recipes detail
  getRecipes: (filter) => {
    let suffix = '';
    if (filter.id) {
      suffix = `/${filter.id}/details`;
    } else {
      suffix = `/details${filter.detail}`;
    }
    return get(`recipes${suffix}`);
  },

  // Get recipe offers
  getRecipeLikes: (filter) => {
    let url = filter.id ? `recipes/${filter.id}/like` : `recipe-likes/mine${filter.detail}`;
    return get(url);
  },

  // Get recipe offers
  getRecipeOffers: (id) => {
    return get(`recipes/${id}/related-offers`)
  },

  // Get user information
  getProfile: () => {
    return get('customers/mine');
  },

  // Get user vouchers
  getVouchers: (status, check_available) => {
    let filter = check_available ? `&filter={"expirationDate":{"$gt":"${new Date()}"}}` : '';
    return get(`vouchers/mine?status=${status}${filter}&sort=["createdAt","ASC"]`);
  },

  // Get prepay id for wechat pay
  orderPrePay: (id) => {
    return get(`orders/${id}/prepay`);
  },

  // Set wechat notification for future offers
  setNotificationOffer: id => {
    return post(`offers/${id}/watch`, { watch: true })
  },

  // Set view for offer
  setOfferView: (id) => {
    return get(`offers/${id}/viewed`);
  },

  // Set recipe likes
  setRecipeLikes: (id, like) => {
    return post(`recipes/${id}/like`, { watch: like });
  },

  // Update lottery notification
  updateLotteryNotification: (id) => {
    return post(`lottery-notifications/${id}/read`, {});
  },

  // Update order
  updateOrder: (id) => {
    return post(`orders/${id}/received`, {});
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

  // Refresh user login token
  refreshToken: (data) => {
    return post('wechat/refresh', data)
  },
}