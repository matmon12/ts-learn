import type { FirestoreErrorCode } from 'firebase/firestore'
import { errorCodes } from './codes'
export * from "./codes"

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class FirestoreError extends Error {
  constructor(code: FirestoreErrorCode, message?: string) {
    super(message || FirestoreError.getMessageByCode(code))
    this.name = 'FirestoreError'
  }

  static getMessageByCode(code: FirestoreErrorCode): string {
    return errorCodes.database[code] || 'Произошла неизвестная ошибка во время работы с базой данных'
  }
}
