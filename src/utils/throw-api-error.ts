import { BaseErrorHandler, type TypeCodeStatus } from '@point-hub/papi'

export interface IOptions {
  message?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, any>
}

export interface IThrowApiError {
  (codeStatus: TypeCodeStatus, options?: object): void
}

export const throwApiError: IThrowApiError = (codeStatus, options) => {
  throw new BaseErrorHandler.ApiError(codeStatus, options)
}
