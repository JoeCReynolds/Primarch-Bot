require('dotenv').config();
const languages = require('./languages.json');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({
    version: process.env.IBM_VERSION,
    authenticator: new IamAuthenticator({
      apikey: process.env.IBM_API_KEY,
    }),
    serviceUrl: process.env.IBM_URL
});

/**
 * 
 * @param {String} toTranslate The text to be translated
 * @param {String} targetLanguage The target language to translate to
 * @returns {String} translation Returns the translated text
 */
async function translate(toTranslate, targetLanguage) {

    targetLanguage = targetLanguage.toLowerCase();
    let targetId = "";

    for (let [key, value] of Object.entries(languages)) {
        if (targetLanguage === key) {
            targetId = value;
            break;
        }
    }

    // Break out of the function
    if (targetId === "") {
        return "The target language could not be found";
    }

    translateParams = {
        text: toTranslate,
        target: targetId
    }

    try {
        let translation = await languageTranslator.translate(translateParams);
        console.log(translation.result.translations[0].translation);
        return translation.result.translations[0].translation;
    } catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = {
    translate
}