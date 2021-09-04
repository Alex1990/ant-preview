import path from 'path'
import winston from 'winston'
import { settingsDir } from './settings'

const { createLogger, format, transports } = winston
const { combine, timestamp } = format

const logsDir = path.join(settingsDir, 'logs')

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 5MB
      maxFiles: 1,
    }),
    new transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 1,
    }),
  ]
})

if (process.env.NODE_ENV === 'development') {
  logger.add(new transports.Console({
    format: format.simple(),
  }))
}

export default logger;