import { Kysely, sql } from 'kysely';

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable('transactions')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('amount', 'float', (col) => col.notNull())
    .addColumn('type', 'text', (col) =>
      col.notNull().check(sql`type in ('INCOME', 'EXPENSE')`)
    )
    .addColumn('created', 'timestamp', (col) =>
      col.notNull().defaultTo(`now()`)
    )
    .execute();

  await db.schema
    .createIndex('idx_transactions_created')
    .on('transactions')
    .column('created')
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropIndex('idx_transactions_created').execute();
  await db.schema.dropTable('transactions').execute();
}
