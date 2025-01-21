/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // id INTEGER PRIMARY KEY AUTOINCREMENT
    table.integer('number').notNullable(); // number INTEGER NOT NULL
    table.string('name').notNullable(); // name TEXT NOT NULL
    table
      .integer('device_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('devices')
      .onDelete('CASCADE'); // FOREIGN KEY(device_id) REFERENCES devices(id)
    // table.timestamps(true, true); // Created at and updated at timestamps
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists('users'); // Drop table if it exists
};
  