export * as User from './user';

import { ulid } from 'ulid';
import { SQL } from './sql';
import type { Users as UserType } from './sql.generated';

export async function create(user: UserType) {
  return SQL.DB.insertInto('users')
    .values({ id: ulid(), ...user })
    .returningAll()
    .executeTakeFirst();
}

export async function update(id: string, user: UserType) {
  return SQL.DB.updateTable('users')
    .set({ id, ...user })
    .returningAll()
    .executeTakeFirst();
}

export function getById(id: string) {
  return SQL.DB.selectFrom('users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
}

export function getByEmail(email: string) {
  return SQL.DB.selectFrom('users')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();
}

export function deleteById(id: string) {
  return SQL.DB.deleteFrom('users')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
}

export function list() {
  return SQL.DB.selectFrom('users')
    .selectAll()
    .orderBy('created', 'desc')
    .execute();
}
