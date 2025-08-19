export type AddPrefix<Prefix extends string, T extends string> = `${Prefix}/${T}`
export type getValues<T extends object> = T[keyof T]
