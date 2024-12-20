import { development } from './knexfile.js'; // Import the 'development' configuration
import Knex from 'knex';

const knex = Knex(development);

export { knex }; // Export the knex instance
