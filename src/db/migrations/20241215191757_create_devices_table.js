/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('devices', (table) => {
    table.increments('id');
    table.string('token').notNullable().unique();
    table.string('phone_number').notNullable().unique();
    // table.timestamp('created_at').defaultTo(knex.fn.now());
    // table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('devices');
};
