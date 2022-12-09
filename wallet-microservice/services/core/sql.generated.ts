import { ColumnType,  RawBuilder } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date | RawBuilder, Date | string | RawBuilder, Date | string | RawBuilder>;

export interface Transactions {
  amount: number;
  created: Generated<Timestamp>;
  id: string;
  type: string;
  user_id: string;
}

export interface Database {
  transactions: Transactions;
}
