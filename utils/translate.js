const db = require('db.config.js');

const checkLanguage = () => {
  // Check if language in cache
  if (db.get('language')) return;

  // Default language is English
  db.set('language', "en");

  // If system language is in Chinese, switch language
  wx.getSystemInfo({
    success(res) {
      if (res.language == "zh_CN") {
        db.set('language', "zh_CN");
      }
    }
  })
}

const changeLanguage = (language) => {
  db.set('language', language)
  return translate();
}

// get translation file
const translate = () => {
  // TODO change langaue map
  console.log(db.get('language'));
  return require('../i18n/' + db.get('language') + '.js').languageMap;
}

module.exports = {
  check: checkLanguage,
  change: changeLanguage,
  translate: translate
}
