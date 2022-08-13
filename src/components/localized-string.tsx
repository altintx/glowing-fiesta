function translate(translations: any, language: string): string {
    if(language in translations) {
      return translations[language];
    }
    if(language.includes("-")) {
      const [generic] = language.split("-");
      if(generic in translations) {
          return translations[generic];
      }
    }
    throw new Error(
      "not translated error"
    );
}

export function LocalizedString({
  language,
  translations
}: {
  language: string,
  translations: any,
}): any {
  return translate(translations, language);
}