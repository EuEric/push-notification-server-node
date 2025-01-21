/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
  await knex.schema.alterTable('devices', (table) => {
    table
      .integer('account_id') // Foreign key linking to the accounts table
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('accounts')
      .onDelete('CASCADE'); // Deletes device records if the account is deleted
  //   table.timestamps(true, true); // Created at and updated at timestamps
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
  await knex.schema.alterTable('devices', (table) => {
    table.dropForeign('account_id');
    table.dropColumn('account_id'); // Removes the account_id column
  });
};
