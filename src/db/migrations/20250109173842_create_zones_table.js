/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('zones', (table) => {
    table.increments('id').primary(); // id INTEGER PRIMARY KEY AUTOINCREMENT
    table.integer('number').notNullable(); // number INTEGER NOT NULL
    table.string('name').notNullable(); // name TEXT NOT NULL
    table
      .integer('account_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('accounts')
      .onDelete('CASCADE'); // FOREIGN KEY(account_id) REFERENCES accounts(id)
    // table.timestamps(true, true); // Created at and updated at timestamps
  });
};
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists('zones'); // Drop table if it exists
};
