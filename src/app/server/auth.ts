import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth'

export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const auth = getAuth()
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)

    return userCredential.user
  } catch (e: unknown) {
    const message: string = e instanceof Error ? e.message : 'An unknown error occurred during sign-up'
    throw new Error(message)
  }
}

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const auth = getAuth()
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)

    return userCredential.user
  } catch (e: unknown) {
    const message: string = e instanceof Error ? e.message : 'An unknown error occurred during sign-ip'
    throw new Error(message)
  }
}

export const logOut = async (): Promise<void> => {
  try {
    const auth = getAuth()
    await signOut(auth)
  } catch (e: unknown) {
    const message: string = e instanceof Error ? e.message : 'An unknown error occurred during log-out'
    throw new Error(message)
  }
}
