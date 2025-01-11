import express from 'express';
import cors from 'cors';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import dotenv from 'dotenv'
import {Model} from 'objection'
import { knex } from './db/db.js'
//Needed to specify multiple paths, because by default, config will look for a file called .env in the current working directory.
//For migrations the cwd will be src/db, and generally for running the main app, the cwd will be /src
dotenv.config({ path: ['../../.env', '../.env'] })

// Initialize Firebase app
initializeApp({
    credential: applicationDefault(),
});

const port = 3000;
// Initialize express app
const app = express();
// Middleware
app.use(express.json());
// CORS
app.use(cors());
// Tie ORM to knex
Model.knex(knex);

// Import notifications routes
import notificationsRoutes from './routes/api/notifications.js';
// Import devices routes
import devicesRoutes from './routes/api/devices.js';
// Import accounts routes
import accountsRoutes from './routes/api/accounts.js'
//Import zones routes
import zonesRoutes from './routes/api/zones.js';
//Import clients routes
import clientsRoutes from './routes/api/clients.js';
//Import paritions routes
import partitionsRoutes from './routes/api/partitions.js';

// Determine the prefix based on the environment
const devPrefix = process.env.NODE_ENV === 'development' ? '/dev/' : '/';

// Mount the notifications routes
app.use(`${devPrefix}api/notifications`, notificationsRoutes);
//Mount the devices routes
app.use(`${devPrefix}api/devices`, devicesRoutes);
// Mount the accounts routes
app.use(`${devPrefix}api`, accountsRoutes);
//Mount the zones routes
app.use(`${devPrefix}api/zones`, zonesRoutes);
//Mount the clients routes
app.use(`${devPrefix}api/clients`, clientsRoutes);
//Mount the partitions routes
app.use(`${devPrefix}api/partitions`, partitionsRoutes);

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
  });
