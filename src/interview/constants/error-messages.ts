export const ERROR_MESSAGES = {
  interviews: {
    notFound: (id: string) => `Собеседование с ID ${id} не найдено`,
    invalidData: 'Некорректные данные собеседования',
    unknown: 'Произошла неизвестная ошибка во время выполнения операции'
  }
} as const
