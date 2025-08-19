import {
  doc,
  setDoc,
  getDocs,
  Query,
  deleteDoc,
  getDoc,
  updateDoc,
  FirestoreErrorCode,
  Timestamp,
  deleteField,
  FieldValue,
} from 'firebase/firestore'
import { FirebaseError } from '@firebase/util'
import { db } from '@/app/firebase/firebase.config'
import type { IInterview, IStage } from '@/interview/types/interfaces'
import { isInterview } from '@/interview/types/guards'
import { NotFoundError, ValidationError, FirestoreError } from '@/app/utils/errors'
import { ERROR_MESSAGES } from '@/interview/constants/error-messages'

const convertStagesTimestamps = (stages: IStage[]): IStage[] => {
  if (!stages.length) return stages
  return stages.map((stage) => ({
    ...stage,
    date: stage.date instanceof Timestamp ? stage.date.toDate() : stage.date,
  }))
}

export const writeToDB = async (userId: string, data: IInterview): Promise<void> => {
  try {
    await setDoc(doc(db, `users/${userId}/interviews`, data.id), data)
  } catch (e: unknown) {
    const message: string =
      e instanceof Error ? e.message : 'Произошла неизвестная ошибка во время записи нового собеседования.'
    throw new Error(message)
  }
}

export const readToDB = async (query: Query): Promise<IInterview[]> => {
  try {
    const querySnapshot = await getDocs(query)
    const docs: Partial<IInterview>[] = querySnapshot.docs.map((doc) => doc.data())

    docs.forEach((doc) => {
      if (doc.stages) doc.stages = convertStagesTimestamps(doc.stages)
    })

    return docs.filter(isInterview)
  } catch (e) {
    const message: string =
      e instanceof Error ? e.message : 'Произошла неизвестная ошибка во время получения собеседований.'
    throw new Error(message)
  }
}

export const deleteFromDB = async (userId: string, interviewId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, `users/${userId}/interviews`, interviewId))
  } catch (e: unknown) {
    const message: string =
      e instanceof Error ? e.message : 'Произошла неизвестная ошибка во время удаления собеседования'
    throw new Error(message)
  }
}

export const getDocFromDB = async (userId: string, interviewId: string): Promise<IInterview> => {
  try {
    const docRef = doc(db, `users/${userId}/interviews`, interviewId)
    const document = await getDoc(docRef)

    if (!document.exists()) {
      throw new NotFoundError(ERROR_MESSAGES.interviews.notFound(interviewId))
    }

    const data: Partial<IInterview> = document.data()

    if (data.stages) data.stages = convertStagesTimestamps(data.stages)

    if (!isInterview(data)) {
      throw new ValidationError(ERROR_MESSAGES.interviews.invalidData)
    }

    return data
  } catch (e: unknown) {
    if (e instanceof NotFoundError || e instanceof ValidationError) {
      console.warn(e.message)
      throw e
    }
    if (e instanceof FirebaseError) {
      console.error(e.message)
      throw new FirestoreError(e.code as FirestoreErrorCode)
    }
    console.error(e)
    throw new Error(ERROR_MESSAGES.interviews.unknown)
  }
}

export const updateToDB = async (userId: string, interviewId: string, data: IInterview): Promise<void> => {
  try {
    const docRef = doc(db, `users/${userId}/interviews`, interviewId)

    // удаление пустых полей
    data.stages = data?.stages?.filter((stage) => stage.date || stage.description || stage.name)

    const updateData: { [key in keyof IInterview]: IInterview[key] | FieldValue } = {
      ...data,
      contactPhone: data.contactPhone || deleteField(),
      contactTelegram: data.contactTelegram || deleteField(),
      contactWhatsapp: data.contactWhatsapp || deleteField(),
      salaryFrom: data.salaryFrom ?? deleteField(),
      salaryTo: data.salaryTo ?? deleteField(),
      result: data.result || deleteField(),
      stages: data.stages?.length ? data.stages : deleteField(),
    }

    await updateDoc(docRef, updateData)
  } catch (e: unknown) {
    const message: string =
      e instanceof Error ? e.message : 'Произошла неизвестная ошибка во время обновления собеседования'
    throw new Error(message)
  }
}
