export type FilterType =
  | 'name'
  | 'transactionCode'
  | 'amount'
  | 'date'
  | 'dateRange'

export interface FilterOption {
  label: string
  value: FilterType
}
