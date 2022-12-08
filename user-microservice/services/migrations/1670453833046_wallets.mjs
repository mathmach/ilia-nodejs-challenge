import { Kysely } from 'kysely';

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable('wallets')
    .addColumn('walletID', 'text', (col) => col.primaryKey())
    .addColumn('value', 'float4', (col) => col.notNull())
    .addColumn('userID', 'text', (col) => col.notNull())
    .addColumn('created', 'timestamp', (col) =>
      col.notNull().defaultTo(`now()`)
    )
    .execute();

  await db.schema
    .createIndex('idx_wallet_created')
    .on('wallets')
    .column('created')
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropIndex('idx_wallet_created').execute();
  await db.schema.dropTable('wallets').execute();
}
