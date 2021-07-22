import extensions from './extensions'

export default function isSupportExtension(ext: string): boolean {
  return extensions.includes(ext)
}