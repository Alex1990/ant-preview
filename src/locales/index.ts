import { isObject } from 'lodash'
import enUS from './en-US.json'
import zhCN from './zh-CN.json'

export type Locale = 'en-US' | 'zh-CN'

type LocaleData = typeof enUS

type AllLocaleData = Record<Locale, unknown>

interface LocaleOption {
  value: string
  label: string
}

export const locales: AllLocaleData = {
  'en-US': enUS,
  'zh-CN': zhCN
}

export const localeOptions: LocaleOption[] = []

Object.keys(locales).forEach((localeName)=> {
  localeOptions.push({
    value: localeName as string,
    label: (locales[localeName as keyof AllLocaleData] as LocaleData).name,
  })
})

export const defaultLocale = 'en-US'

function assign<T>(dest: T, src: T) {
  for (const p of Object.keys(src) as Array<keyof T>) {
    if (isObject(dest[p])) {
      assign(dest[p], src[p])
    } else if (dest[p] === undefined) {
      dest[p] = src[p]
    }
  }
}

export function getLocaleData(locale: Locale): LocaleData {
  const defaultLocaleData = locales[defaultLocale] as LocaleData
  const localeData = (locales[locale] || {}) as LocaleData 
  assign<LocaleData>(localeData, defaultLocaleData)
  return localeData
}
