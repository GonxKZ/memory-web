import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    translation: {
      "home": "Home",
      "glossary": "Glossary",
      "cache": "Cache",
      "tlb": "TLB",
      "dram": "DRAM",
      "coherence": "Coherence",
      "consistency": "Consistency",
      "allocators": "Allocators",
      "settings": "Settings",
      "profile": "Profile",
      "terms": "Terms",
      "privacy": "Privacy"
    }
  },
  es: {
    translation: {
      "home": "Inicio",
      "glossary": "Glosario",
      "cache": "Caché",
      "tlb": "TLB",
      "dram": "DRAM",
      "coherence": "Coherencia",
      "consistency": "Consistencia",
      "allocators": "Asignadores",
      "settings": "Configuración",
      "profile": "Perfil",
      "terms": "Términos",
      "privacy": "Privacidad"
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    interpolation: {
      escapeValue: false
    }
  })

export default i18n