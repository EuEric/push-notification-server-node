import express from 'express';
import { getMessaging } from 'firebase-admin/messaging'; // Ensure this is imported correctly based on your Firebase setup

const router = express.Router();

router.post('/send', async (req, res) => {
    const receivedToken = req.body['fCM_token'];
    console.log('Received token:', receivedToken);

    const message = {
        notification: {
            title: 'Notification',
            body: 'This is a Test Notification',
        },
        android: {
            notification: {
                icon: 'stock_ticker_update',
                color: '#7e55c3',
            },
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

export default router;
