export enum Strategy {
  File = 'FILE',
  Introspection = 'INTROSPECTION',
  Url = 'URL',
}

export enum TaskStatus {
  Idle = 'IDLE',
  Started = 'STARTED',
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Skipped = 'SKIPPED',
}

export enum LogLevel {
  Trace = 'trace',
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}

export enum Locale {
  German = 'de',
  English = 'en',
  Dutch = 'nl',
  Spanish = 'es',
}
