import { getLocaleData, Locale } from '../locales'

export function getBrowserLocaleData(locale?: Locale) {
  const browserLocale = navigator.language as Locale
  return getLocaleData(locale || browserLocale)
}
