enum Language {
  English = 'en',
  中文_简体 = 'zh-CN',
  中文_繁體 = 'zh-TW',
  Português = 'pt',
  日本語 = 'ja',
  русский = 'ru',
  Español = 'es',
  Deutsche = 'de',
  français = 'fr',
  Italiano = 'it',
  한국어 = 'ko',
  العربية = 'ar',
  Polski = 'pl',
}

export const navigatorLanguage = (navigator: string): Language => {
  if (navigator.startsWith(Language.English)) return Language.English
  if (navigator.startsWith(Language.中文_繁體)) return Language.中文_繁體
  if (navigator.startsWith('zh')) return Language.中文_简体
  if (navigator.startsWith(Language.Português)) return Language.Português
  if (navigator.startsWith(Language.日本語)) return Language.日本語
  if (navigator.startsWith(Language.русский)) return Language.русский
  if (navigator.startsWith(Language.Español)) return Language.Español
  if (navigator.startsWith(Language.Deutsche)) return Language.Deutsche
  if (navigator.startsWith(Language.français)) return Language.français
  if (navigator.startsWith(Language.Italiano)) return Language.Italiano
  return Language.English
}

export default Language
