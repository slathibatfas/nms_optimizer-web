import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
	.use(HttpApi) // Loads translations from /public/locales
	.use(LanguageDetector) // Detects user language
	.use(initReactI18next) // Passes i18n instance to react-i18next
	.init({
		supportedLngs: ["en", "dev"], // 'dev' can be used to easily spot untranslated strings
		fallbackLng: "en",
		debug: process.env.NODE_ENV === "development",
		detection: {
			order: ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"],
			caches: ["localStorage", "cookie"],
		},
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to your translation files
		},
		interpolation: {
			escapeValue: false, // React already protects from XSS
		},
		ns: ["translation"], // Default namespace
		defaultNS: "translation",
	});

export default i18n;
