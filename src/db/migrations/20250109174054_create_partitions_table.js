/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable('partitions', (table) => {
      table.increments('id').primary(); // id INTEGER PRIMARY KEY AUTOINCREMENT
      table.integer('number').notNullable().unique(); // number INTEGER NOT NULL UNIQUE
      table.string('account_name').notNullable().unique(); // name TEXT NOT NULL UNIQUE
      table
        .integer('account_id')
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
    return knex.schema.dropTableIfExists('partitions'); // Drop table if it exists
  };
  