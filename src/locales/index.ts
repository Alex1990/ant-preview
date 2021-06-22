import enUS from './en-US.json'
import zhCN from './zh-CN.json'

const locales = {
  'en-US': enUS,
  'zh-CN': zhCN
}

export type Locale = 'en-US' | 'zh-CN'

export {
  locales
}
