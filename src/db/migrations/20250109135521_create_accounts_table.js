/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('accounts', (table) => {
      table.increments('id').primary(); // Auto-incrementing ID
      table.string('email').notNullable().unique(); // Email field, must be unique
      table.string('password').notNullable(); // Password field
      table.timestamps(true, true); // Created at and updated at timestamps
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('accounts'); // Drop the accounts table
  };
  