import express from 'express';
import { knex } from '../../db/db.js'
import constants  from '../../constants/api_constants.js';
const router = express.Router();

//TODO: modify this as well

router.post('', async (req, res) => {
  // TODO: Implementation
  try {
  const [id] = await  knex('devices')
  .insert({
    token: req.body['token'],
    identifier: req.body['identifier']
  });
  res.json({ success: true, id });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.json({success: false, message: constants.duplicateFoundError});
    }
    console.log(e);
    res.json({success: false, message: constants.internalServerError});
  }
});

router.get('', (req, res) => {
  try {
    knex.select().from('devices').then((devices) => res.json({success: true, devices}));
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.get('/:id', (req, res) => {
  try {
    knex('devices')
      .where('id', req.params.id)
      .then((device) => res.json({successs:true, device: device[0] ? device[0] : 'No device found'}));
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.put('/:id', (req, res) => {
  var id = req.params.id;
  //TODO: add some verification if input parameters are format and names they should

  knex('devices')
    .where('id', id)
    .update({
      token: req.body['token'],
      identifier: req.body['identifier']
    })
    .then((count) => {
      if(count === 0) {
        return res.status(404).json({success: false, message: constants.deviceNotFoundError});
      }
      res.json({ success: true, id });
    })
    .catch((e) => {
      if (e.code === 'ER_DUP_ENTRY') {
        return res.json({success: false, message: constants.duplicateFoundError});
      }
      res.json({success: false, message: constants.internalServerError});
    })
});

router.delete('/:id', (req, res) => {
  knex('devices')
    .where('id', req.params.id)
    .del()
    .then((count) => {
      if (count === 0) {
        return res.status(404).json({success: false, message: constants.deviceNotFoundError});
      }
      res.json({success: true, message: constants.deviceDeletionSuccess});
    })
    .catch((e) => {
      if (e.code === 'ER_TRUNCATED_WRONG_VALUE') {
        return res.status(400).json({success: false, message: constants.inputFieldError});
      }

      res.status(500).json({success: false, message: constants.internalServerError});
    });
});


export default router;
