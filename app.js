import express from 'express';
import cors from 'cors';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

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

// Import notifications routes
import notificationsRoutes from './routes/api/notifications.js';
// Import devices routes
import devicesRoutes from './routes/api/devices.js';

// Mount the notifications routes
app.use('/api/notifications', notificationsRoutes);
//Mount the devices routes
app.use('/api/devices', devicesRoutes);

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
  });
