export * as Wallet from './wallet';

import { ulid } from 'ulid';
import { SQL } from './sql';

export async function create(value: number, userID: string) {
  const [result] = await SQL.DB.insertInto('wallets')
    .values({ walletID: ulid(), value, userID })
    .returningAll()
    .execute();
  return result;
}

export function getByUserID(userID: string) {
  return SQL.DB.selectFrom('wallets')
    .selectAll()
    .where('userID', '=', userID)
    .execute();
}

export function list() {
  return SQL.DB.selectFrom('wallets')
    .selectAll()
    .orderBy('created', 'desc')
    .execute();
}
