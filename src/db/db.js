import { development } from './knexfile.js'; // Import the 'development' configuration
import Knex from 'knex';
import dotenv from 'dotenv'
//Needed to specify multiple paths, because by default, config will look for a file called .env in the current working directory.
//For migrations the cwd will be src/db, and generally for running the main app, the cwd will be /src
dotenv.config({ path: ['../../.env', '../.env'] })

const knex = Knex(process.env.NODE_ENV);

export { knex }; // Export the knex instance
