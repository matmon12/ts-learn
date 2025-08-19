import type { IInterview, IStage } from './interfaces'

export const isInterview = (data: unknown): data is IInterview => {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>

  return (
    typeof obj.id === 'string' &&
    typeof obj.company === 'string' &&
    typeof obj.vacancyLink === 'string' &&
    typeof obj.hrName === 'string' &&
    (obj.contactTelegram === undefined || typeof obj.contactTelegram === 'string') &&
    (obj.contactWhatsapp === undefined || typeof obj.contactWhatsapp === 'string') &&
    (obj.contactPhone === undefined || typeof obj.contactPhone === 'string') &&
    (obj.salaryFrom === undefined || obj.salaryFrom === null || typeof obj.salaryFrom === 'number') &&
    (obj.salaryTo === undefined || obj.salaryTo === null || typeof obj.salaryTo === 'number') &&
    (obj.stages === undefined || (Array.isArray(obj.stages) && obj.stages.every(isStage))) &&
    (obj.result === undefined || obj.result === 'Refusal' || obj.result === 'Offer') &&
    typeof obj.createdAt === 'number'
  )
}

export const isStage = (data: unknown): data is IStage => {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>

  return (
    typeof obj.name === 'string' &&
    (obj.date instanceof Date || obj.date === null) &&
    typeof obj.description === 'string'
  )
}
