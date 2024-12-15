import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DEV_DATABASE_HOST,
            port: process.env.DEV_DATABASE_PORT,
            user: process.env.DEV_DATABASE_USER,
            password: process.env.DEV_DATABASE_PASSWORD,
            database: process.env.DEV_DATABASE_NAME,
        },
        migrations: {
            directory: path.join(__dirname, '/db/migrations'),
        },
        seeds: {
            directory: path.join(__dirname, '/db/seeds'),
        },
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: path.join(__dirname, '/db/migrations'),
        },
        seeds: {
            directory: path.join(__dirname, '/db/seeds/production'),
        },
    },
};

// Select environment
const environment = process.env.NODE_ENV || 'development';
const config = options[environment];

export default knex(config);
