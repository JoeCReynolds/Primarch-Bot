const {translate} = require('../src/translator/language_translator');

module.exports = {
    name: "translate",
    execute(toTranslate, targetLanguage) {
        return translate(toTranslate, targetLanguage);
    }
}