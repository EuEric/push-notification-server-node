/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.alterTable('devices', (table) => {
      table.dropColumn('phone_number');
      table.string('identifier').notNullable().unique();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = function (knex) {
    return knex.schema.alterTable('devices', (table) => {
      table.dropColumn('identifier');
      table.string('phone_number').notNullable().unique();
    });
  };
  