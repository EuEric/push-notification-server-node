/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.alterTable('devices', (table) => {
      table.dropColumn('token');
      table.string('identifier').notNullable().alter();
    });
  };
  
  export const down = function (knex) {
    return knex.schema.alterTable('devices', (table) => {
      table.string('token').notNullable().unique();
      table.string('identifier').nullable().alter();
    });
  };
  