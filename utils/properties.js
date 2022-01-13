const API_URL = 'https://api-ziko.dev.mediasia.cn/';
const FILE_URL = `${API_URL}storage/`;

module.exports = {
  api_url: API_URL,
  folders: {
    product_picture: `${FILE_URL}product-cover/`,
    offer_banner: `${FILE_URL}offer-banner/`,
    offer_media: `${FILE_URL}offer-media/`,
    // category: `${FILE_URL}product-category/`,
    // product_main: `${FILE_URL}product-main-picture/`,
    // product_others: `${FILE_URL}product-other-picture/`
  }
}
