export interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

export type Direction = 'up' | 'down'

export interface Position {
  top?: string
  bottom?: string
}