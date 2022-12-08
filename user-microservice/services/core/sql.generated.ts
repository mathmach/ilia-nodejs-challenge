import { ColumnType,  RawBuilder } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date | RawBuilder, Date | string | RawBuilder, Date | string | RawBuilder>;

export interface Wallets {
  created: Generated<Timestamp>;
  userID: string;
  value: number;
  walletID: string;
}

export interface Database {
  wallets: Wallets;
}
