const API_URL = 'https://api-ziko.dev.mediasia.cn/';
const FILE_URL = `${API_URL}storage/`;

module.exports = {
  api_url: API_URL,
  folders: {
    customer_picture: `${FILE_URL}customer-picture/`,
    asset: `${FILE_URL}asset/`,
    offer_banner: `${FILE_URL}offer-banner/`,
    offer_media: `${FILE_URL}offer-media/`,
    product_picture: `${FILE_URL}product-cover/`,
    // category: `${FILE_URL}product-category/`,
    // product_main: `${FILE_URL}product-main-picture/`,
  }
}
