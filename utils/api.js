const { showLoading } = require('./common.js');
const db = require('./db.config.js');
const config = require('./properties.js');

// Generate header and url
const _unifyHeaders = (path) => {
  let header = {};
  const token = db.get("userInfo").token;
  // console.log("token", token);
  if (token) {
    header = {'Authorization': `Bearer ${token}`};
  }

  return [header, `${config.api_url}${path}`];
}

// Normal Request
const request = (method, path, data) => {
  let [header, url] = _unifyHeaders(path);
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      header,
      data,
      method,
      success: function(res) {
        if (res.data?.success === false) {
          showLoading(false);
          if (reject) {
            reject(res.data.message)
          }
        } else {
          resolve(res.data);
        }
      },
      fail: function(res) {
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
        console.log(res)
        if (res.statusCode != 200) {
          showLoading(false);
          console.debug(res.data.message);
          reject(res.data.message);
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
    return request('POST', `orders/purchase/${id}`, data);
  },

  // Get deliverable address areas
  getAreas: () => {
    return request('GET', 'delivery-areas');
  },

  // Get orders
  getOrders: (filter) => {
    let suffix = `mine?sort=["createdAt","DESC"]&${filter.filter_str}`;
    if (filter.id) suffix = `${filter.id}/mine`;
    return request('GET', `orders/${suffix}`);
  },

  // Get offer with product details
  getOffers: (suffix) => {
    return request('GET', `offers/details${suffix}`);
  },

  // Get buyers for offer
  getOfferBuyers: id => {
    return request('GET', `offers/${id}/buyers?channel=miniprogram`);
  },

  // Get lottery
  getLotteries: (filter) => {
    let url = filter ? `lottery-draws/details?${filter}` : 'lottery-draws/details';
    return request('GET', url);
  },

  // Get lottery notifications
  getLotteryNotifications: () => {
    return request('GET', 'lottery-notifications/mine?channel=miniprogram');
  },

  // Get recipe tags
  getRecipeTags: () => {
    return request('GET', 'recipe-tags/details');
  },

  // Get recipes detail
  getRecipes: (filter) => {
    let suffix = '';
    if (filter.id) {
      suffix = `/${filter.id}/details`;
    } else {
      suffix = `/details${filter.detail}`;
    }
    return request('GET', `recipes${suffix}`);
  },

  // Get recipe offers
  getRecipeLikes: (filter) => {
    let url = filter.id ? `recipes/${filter.id}/like` : `recipe-likes/mine${filter.detail}`;
    return request('GET', url);
  },

  // Get recipe offers
  getRecipeOffers: (id) => {
    return request('GET', `recipes/${id}/related-offers`)
  },

  // Get user information
  getProfile: () => {
    return request('GET', 'customers/mine');
  },

  // Get user vouchers
  getVouchers: (status="validated", filter = `&filter={"expirationDate":{"$gt":"${new Date()}"}}`) => {
    // let filter = check_available ? `&filter={"expirationDate":{"$gt":"${new Date()}"}}` : '';
    return request('GET', `vouchers/mine?status=${status}${filter}&sort=["createdAt","ASC"]`);
  },

  // Get prepay id for wechat pay
  orderPrePay: (id) => {
    return request('GET', `orders/${id}/prepay`);
  },

  // Set wechat notification for future offers
  setNotificationOffer: id => {
    return request('POST', `offers/${id}/watch`, { watch: true })
  },

  // Set view for offer
  setOfferView: (id) => {
    return request('GET', `offers/${id}/viewed`);
  },

  // Set recipe likes
  setRecipeLikes: (id, like) => {
    return request('POST', `recipes/${id}/like`, { watch: like });
  },

  // Update lottery notification
  updateLotteryNotification: (id) => {
    return request('POST', `lottery-notifications/${id}/read`, {});
  },

  // Update order
  updateOrder: (id) => {
    return request('POST', `orders/${id}/received`, {});
  },

  // Update user info
  updateProfile: (data) => {
    return request('PUT', `customers/mine`, data);
  },

  // Upload profile picture
  uploadProfilePicture: (file) => {
    return upload('customer-picture', file);
  },

  // Wechat login with mobile
  wxLogin: (data) => {
    return request('POST', 'wechat/login', data);
  },

  // Wechat get openid, and user info (if exist)
  wxOpenid: (data) => {
    return request('POST', 'wechat/openid', data);
  },

  // Refresh user login token
  refreshToken: (data) => {
    return request('POST', 'wechat/refresh', data)
  },
}