import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { ptBR } from "./locales/pt-BR";

const STORAGE_KEY = "fiscalflow-locale";

const saved = localStorage.getItem(STORAGE_KEY);
const initialLng =
  saved && ["pt-BR", "en", "es"].includes(saved) ? saved : "pt-BR";

void i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: ptBR },
    en: { translation: en },
    es: { translation: es },
  },
  lng: initialLng,
  fallbackLng: "pt-BR",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = initialLng;

export default i18n;
