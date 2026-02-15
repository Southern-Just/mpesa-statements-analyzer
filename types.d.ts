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


export type MpesaTransaction = {
  date: string;
  description: string;
  reference: string;
  debit: number | null;
  credit: number | null;
  balance: number;
};

export type ParsedStatement = {
  account: string;
  period: string;
  transactions: MpesaTransaction[];
};
