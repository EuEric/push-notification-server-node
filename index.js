import express from 'express';
import cors from 'cors';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase app

initializeApp({
    credential: applicationDefault(),
});

// Define the `/send` endpoint
app.post('/send', async (req, res) => {
	const receivedToken = req.body['fCM_token'];
	console.log('received token: ', receivedToken);
	const message = {
		notification: {
			title: 'Notification',
			body: 'This is a Test Notification',
		},
		android: {
			notification: {
				icon: 'stock_ticker_update',
				color: '#7e55c3'
			}
		},
		token: receivedToken,
	};

  try {
	const response = await getMessaging().send(message);
    res.status(200).json({
    	message: 'Successfully sent message',
    	token: receivedToken,
    });
    console.log('Successfully sent message:', response);
  } catch (error) {
		res.status(400).send(error);
    	console.error('Error sending message:', error);
  }
});

// Start the server
app.listen(3000, () => {
	console.log('Server started on port 3000');
});
