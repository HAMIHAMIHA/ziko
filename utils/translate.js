const db = require('db.config.js');

const checkLanguage = () => {
  wx.getSystemInfo({
    success(res) {
      if (res.language == "zh_CN") {
        db.set('language', res.language);
      }
    }
  })

  // db.set('language', "en"); // If no language, set to en
  db.set('language', "zh_CN"); // TEMP if no language, set to en
  // on app load if user logged in => set user language as lang
  // else set wechat setting language as lang

  // on user login => check if language was set, if not empty and not equals to current change to user setting language
  // if empty set user language to lang
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
