import enUS from './en-US.json'
import zhCN from './zh-CN.json'

export const locales = {
  'en-US': enUS,
  'zh-CN': zhCN
}

export type Locale = 'en-US' | 'zh-CN'

export const defaultLocale = 'en-US'

export function getLocaleData(locale: Locale): typeof locales['en-US'] {
  return locales[locale] ? locales[locale] : locales[defaultLocale]
}
