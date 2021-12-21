const db = require('db.config.js');

const checkLanguage = () => {
  if (!db.get('language')) {
    db.set('language', "en");
    wx.getSystemInfo({
      success(res) {
        if (res.language == "zh_CN") {
          db.set('language', "zh_CN");
        }
      }
    })
  }
}

const changeLanguage = (language) => {
  db.set('language', language)
  return translate();
}

// get translation file
const translate = () => {
  console.log(db.get('language'));
  return require('../i18n/' + db.get('language') + '.js').languageMap;
}

module.exports = {
  check: checkLanguage,
  change: changeLanguage,
  translate: translate
}
