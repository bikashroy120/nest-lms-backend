/* eslint-disable prettier/prettier */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Partial<T> => {
  const output: Partial<T> = {}

  keys.forEach(key => {
    if (obj && obj[key] !== undefined && obj[key] !== '') {
      output[key] = obj[key]
    }
  })

  return output
}