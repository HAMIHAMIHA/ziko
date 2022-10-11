const API_URL = 'http://localhost:8081/';
// const API_URL = 'https://api-ziko.dev.mediasia.cn/';
// const API_URL = 'https://api.zikoland.com/'; // PROD
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
  tabbars: ["home",  "explore",  "account"],
  fonts: [
    { family: "gilroy", source: `${FILE_URL}fonts/Gilroy-Regular.otf`, weight: "400" },
    { family: "gilroy", source: `${FILE_URL}fonts/Gilroy-Medium.otf`, weight: "500" },
    { family: "gilroy", source: `${FILE_URL}fonts/Gilroy-Bold.otf`, weight: "700" },
    { family: "gilroy", source: `${FILE_URL}fonts/Gilroy-ExtraBold.otf`, weight: "800" },
    { family: "gilroy", source: `${FILE_URL}fonts/Gilroy-Black.otf`, weight: "900" },
    { family: "gilroy", source: `${FILE_URL}fonts/Gilroy-Heavy.otf`, weight: "900" },
    { family: "nunito", source: `${FILE_URL}fonts/Nunito-Light.ttf`, weight: "300" },
    { family: "nunito", source: `${FILE_URL}fonts/Nunito-Regular.ttf`, weight: "400" },
    { family: "nunito", source: `${FILE_URL}fonts/Nunito-SemiBold.ttf`, weight: "600" },
    { family: "nunito", source: `${FILE_URL}fonts/Nunito-Bold.ttf`, weight: "700" },
    { family: "nunito", source: `${FILE_URL}fonts/Nunito-ExtraBold.ttf`, weight: "800" },
    { family: "nunito", source: `${FILE_URL}fonts/Nunito-Black.ttf`, weight: "900" },
  ]
}