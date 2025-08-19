export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactWhatsapp?: string
  contactPhone?: string
  createdAt: number
  salaryFrom?: number | null
  salaryTo?: number | null
  stages?: IStage[]
  result?: 'Refusal' | 'Offer'
}

export interface IStage {
  name: string
  date: Date | null
  description: string
}
