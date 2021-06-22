import { getLocaleData, Locale } from '../locales'

export function getBrowserLocaleData() {
  const locale = navigator.language as Locale
  return getLocaleData(locale)
}
