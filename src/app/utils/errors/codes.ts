import type { FirestoreErrorCode } from 'firebase/firestore'
import type { StorageErrorCode } from '@firebase/storage'
import { AuthErrorCodes } from 'firebase/auth'
import type { AddPrefix, getValues } from '@/app/types/utils'

interface IErrorCodes {
  database: Partial<Record<FirestoreErrorCode, string>>
  storage: Partial<Record<AddPrefix<'storage', `${StorageErrorCode}`>, string>>
  auth: Partial<Record<getValues<typeof AuthErrorCodes>, string>>
}

export const errorCodes: IErrorCodes = {
  database: {
    'permission-denied': 'You do not have permission to access the document or collection.',
    'not-found': 'The document or collection was not found.',
    'invalid-argument': 'One or more arguments in the request are invalid.',
    'aborted': 'The operation was aborted, often due to a conflict.',
    'unauthenticated': 'Authentication is required to perform the operation.',
    'out-of-range': 'The value is outside the allowed range.',
    'failed-precondition': 'The operation cannot be performed due to the current state of the system.',
    'unavailable': 'Слабое интернет соединение',
    'unknown': 'An unknown error occurred.'
  },
  storage: {
    'storage/retry-limit-exceeded': 'The maximum time limit on an operation has been excceded. Try uploading again.',
    'storage/unauthorized':
      'User is not authorized to perform the desired action, check your security rules to ensure they are correct.',
    'storage/canceled': 'User canceled the operation.',
    'storage/unknown': 'An unknown error occurred.',
    'storage/object-not-found': 'No object exists at the desired reference.',
  },
  auth: {
    'auth/email-already-in-use': 'The email address is already in use by another account.',
    'auth/operation-not-allowed': 'Password sign-in is disabled for this project.',
    'auth/too-many-requests': 'We have blocked all requests from this device due to unusual activity. Try again later.',
    'auth/wrong-password': 'The password is invalid or the user does not have a password.',
    'auth/user-disabled': 'The user account has been disabled by an administrator.',
    'auth/invalid-credential': 'Invalid login credentials. Please check your email and password and try again.',
  },
}

errorCodes.database.aborted = 'sdfsdfsdf'
