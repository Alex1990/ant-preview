import { Locale } from '../locales';

export type SortBy = 'fileName' | 'size' | 'ctime' | 'mtime' | 'atime'

export type SortType = 'asc' | 'desc'

export interface Settings {
  locale?: Locale
  canvasBackgroundColor?: string
  sortBy: SortBy
  sortType: SortType
}