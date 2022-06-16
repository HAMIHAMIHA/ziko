const API_URL = 'https://api-ziko.dev.mediasia.cn/';
const FILE_URL = `${API_URL}storage/`;
const SUBSCRIBE_DELIVERED = "kx6MC4envuMzJTdfq-ys36L4Q5BMu9HsEHsK2W612bo";
const SUBSCRIBE_OFFER_START = "64_0Po5jJe7NuLPVzC3V_4HZ-4MgXbY-4y9-mRBNcl4";
const SUBSCRIBE_LOTTERY_DRAW = "YWhLHqNqQokYM_5oGm90K8K0XidbkxTlZK59zla-6iA";
const SUBSCRIBE_SPECIAL_GIFT = "ngdzPAw-FqzVyPgwmaQRk5AITV69LEhYtoT4n5KC_6o";

module.exports = {
  api_url: API_URL,
  folders: {
    custom_image: `${FILE_URL}gift-image/`,
    customer_picture: `${FILE_URL}customer-picture/`,
    asset: `${FILE_URL}asset/`,
    fapiao_image: `${FILE_URL}fapiao-image/`,
    offer_banner: `${FILE_URL}offer-banner/`,
    offer_media: `${FILE_URL}offer-media/`,
    product_picture: `${FILE_URL}product-cover/`,
    pack_picture: `${FILE_URL}pack-illustration/`,
    recipe_picture: `${FILE_URL}recipe-cover/`,
    recipe_media: `${FILE_URL}recipe-other-media/`,
  },
  subscribe: {
    delivered: SUBSCRIBE_DELIVERED,
    offer: SUBSCRIBE_OFFER_START,
    special_gift: SUBSCRIBE_SPECIAL_GIFT,
    lottery_draw: SUBSCRIBE_LOTTERY_DRAW,
  },
  tabbars: ["home", "orders", "explore", "lottery", "account"],
}