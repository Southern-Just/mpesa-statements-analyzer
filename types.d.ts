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
export interface Transaction {
  date: string;
  amount: number;
  name: string;
  description?: string;
}

export interface ProcessedData {
  sortedByName: Record<string, Transaction[]>;
  rawText?: string;
}