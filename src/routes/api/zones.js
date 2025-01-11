import express from 'express';
import { verifyToken } from '../../middleware/token_verify.js';
import { Zone } from '../../models/zone.js'
import { Account } from '../../models/account.js'
import {createOwnershipMiddleware} from '../../middleware/ownership.js';
import isInt from 'validator/lib/isInt.js';
import constants  from '../../constants/api_constants.js';
const router = express.Router();

const verifyZoneOwnership = createOwnershipMiddleware({
  model: Zone,
  ownershipField: 'account_id',
});

router.post('', verifyToken, async (req, res) => {
  try {
    const name = req.body.name;
    const number = req.body.number;
    
    //Validate input fields
    if(!name || !number || !isInt(number)) {
      return res.status(400).json({success: false, message: constants.inputFieldError});
    }

    const account = await Account.query().findOne({ email: req.account.email }).withGraphFetched('zones');
    for (const zone of account.zones) {
      if (zone.number == number || zone.name == name) {
        return res.status(400).json({ success: false, message: constants.duplicateFoundError });
      }
    }
   
    const zone = await Zone.query().insert({ name, number, account_id: account.id});
    return res.json({ success: true, zone });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(500).json({success: false, message: constants.duplicate_device_error});
    }
    console.log(e);
    return res.status(500).json({success: false, message: constants.default_error_message});
  }
});

router.get('', verifyToken, async (req, res) => {
  try {
    Account.query().findOne({ email: req.account.email }).withGraphFetched('zones').then((account) => res.json({success: true, zones: account.zones ? account.zones : []}));
  } catch(e) {
    res.status(500).json({success: false, message: constants.default_error_message});
  }
});

router.get('/:id', verifyToken, verifyZoneOwnership, (req, res) => {
  try {
    Zone.query().findOne({id: req.params.id}).then((zone) => res.json({success: true, zone: zone ? zone : 
      'No zone found'
    }));
  } catch(e) {
    res.status(500).json({success: false, message: constants.default_error_message});
  }
});

router.put('/:id', verifyToken, verifyZoneOwnership, async (req, res) => {
  var id = req.params.id;
  const name = req.body.name;
  const number = req.body.number;

  //Validate input fields
  if(!name || !number || !isInt(number)) {
    return res.status(400).json({success: false, message: constants.inputFieldError});
  }

  const account = await Account.query().findOne({ email: req.account.email }).withGraphFetched('zones');

  //Check if zone with same (name, number) already exists
  for (const zone of account.zones) {
    if (zone.id != id && (zone.number == number || zone.name == name)) {
      return res.status(400).json({ success: false, message: constants.duplicateFoundError });
    }
  }

  Zone.query()
    .findById(id)
    .patch({name, number})
    .then((count) => {
      if(count === 0) {
        return res.status(404).json({success: false, message: constants.device_not_found});
      }
      res.json({ success: true, id });
    })
    .catch((e) => {
      console.log(e);
      if (e.code === 'ER_DUP_ENTRY') {
        return res.json({success: false, message: constants.duplicate_device_error});
      }
      res.json({success: false, message: constants.default_error_message});
    })
});

router.delete('/:id', verifyToken, verifyZoneOwnership, (req, res) => {
  Zone.query().deleteById(req.params.id)
    .then((count) => {
      if (count === 0) {
        return res.status(404).json({success: false, message: constants.device_not_found});
      }
      res.json({success: true, message: constants.deviceDeletionSuccess});
    })
    .catch((e) => {
      if (e.code === 'ER_TRUNCATED_WRONG_VALUE') {
        return res.status(400).json({success: false, message: constants.inputFieldError});
      }

      res.status(500).json({success: false, message: constants.default_error_message});
    });
});

export default router;