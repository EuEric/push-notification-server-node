import express from 'express';
import { getMessaging } from 'firebase-admin/messaging'; // Ensure this is imported correctly based on your Firebase setup
import { knex } from '../../db/db.js'

const router = express.Router();

router.post('/send', async (req, res) => {
    const identifier = req.body['identifier'];
      // Verify identifier
    if (!identifier) {
      return res.status(400).json({
          success: false,
          message: 'Identifier is required and cannot be empty.',
      });
    }
    //TODO: parse in the same way as with moby
    //TODO: verify cid
    const cid = req.body['cid'];
    console.log(`cid ${cid}`);
    if (!cid) {
      return res.status(400).json({
          success: false,
          message: 'CID is required and cannot be empty.',
      });
    }
    const device =  await knex('devices').where('identifier', identifier).first();
    if(!device) {
      return res.status(400)
      .json({
        success: false,
        message: 'No device matching identifier found.',
      });
    }
    const token = device['token'];

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
        token: token,
    };
    console.log(`cid: ${cid}`);
    console.log(message);

    try {
        await getMessaging().send(message);
        res.json({success: true, mmessage: 'Successfully sent message'});
    } catch (e) {
        //console.error('Error sending message:', e);
        if (e.code === 'messaging/invalid-argument') {
          return res.status(400)
            .json({
              success: false,
              message: 'Invalid FCM registration token provided. Please check the token.',
            });
        }
      
        res.status(500)
          .json({
            success: false,
            message: 'An unexpected error occurred while sending the notification.',
            error: e.message,
          });
    }
});

export default router;
