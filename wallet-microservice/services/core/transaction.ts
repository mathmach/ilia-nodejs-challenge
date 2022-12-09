export * as Transaction from './transaction';

import { ulid } from 'ulid';
import { SQL } from './sql';
import type { Transactions as TransactionType } from './sql.generated';

export async function create(transaction: TransactionType) {
  return SQL.DB.insertInto('transactions')
    .values({ id: ulid(), ...transaction })
    .returningAll()
    .executeTakeFirst();
}

export async function update(id: string, transaction: TransactionType) {
  return SQL.DB.updateTable('transactions')
    .set({ id, ...transaction })
    .returningAll()
    .executeTakeFirst();
}

export function getById(id: string) {
  return SQL.DB.selectFrom('transactions')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
}

export function getByUserId(userId: string) {
  return SQL.DB.selectFrom('transactions')
    .selectAll()
    .where('user_id', '=', userId)
    .executeTakeFirst();
}

export function getBalanceByUserId(userId: string) {
  const { sum } = SQL.DB.fn
  return SQL.DB.selectFrom('transactions')
    .select([
      (qb) => qb.selectFrom('transactions')
        .select(sum<number>('amount').as('total_expense'))
        .where('user_id', '=', userId)
        .where('type', '=', 'EXPENSE')
        .as('total_expense'),
      (qb) => qb.selectFrom('transactions')
        .select(sum<number>('amount').as('total_income'))
        .where('user_id', '=', userId)
        .where('type', '=', 'INCOME')
        .as('total_income')
    ])
    .executeTakeFirst();
}

export function deleteById(id: string) {
  return SQL.DB.deleteFrom('transactions')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
}

export function list() {
  return SQL.DB.selectFrom('transactions')
    .selectAll()
    .orderBy('created', 'desc')
    .execute();
}
