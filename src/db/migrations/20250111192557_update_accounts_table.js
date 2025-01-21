/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.alterTable('accounts', (table) => {
      table.string('token').notNullable();
    });
  };
  
  export const down = function (knex) {
    return knex.schema.alterTable('accounts', (table) => {
      table.dropColumn('token');
    });
  };
  