import express from 'express';
import { Device } from '../../models/device.js'
import { Account } from '../../models/account.js'
import { verifyToken } from '../../middleware/token_verify.js';
import {createOwnershipMiddleware} from '../../middleware/ownership.js';
import constants  from '../../constants/api_constants.js';
import isHexadecimal from 'validator/lib/isHexadecimal.js';
const router = express.Router();

const verifyDeviceOwnership = createOwnershipMiddleware({
  model: Device,
  ownershipField: 'account_id',
});

router.post('', verifyToken, async (req, res) => {
  try {
    const identifier = req.body.identifier;

    //Validate input fields
    if(!identifier || !isHexadecimal(identifier) || !identifier.length == 8) {
      return res.status(400).json({success: false, message: constants.inputFieldError});
    }
    const account = await Account.query().findOne({ email: req.account.email }).withGraphFetched('devices');

    for (const device of account.devices) {
      if (device.identifier == identifier) {
        return res.status(400).json({ success: false, message: constants.duplicateFoundError });
      }
    }
   
    const device = await Device.query().insert({ identifier, account_id: account.id});
    return res.json({ success: true, device });
  } catch(e) {
    // Dup entry will be skipped for some reason
    // However it's better to not expose this for device
    if (e.code == 'ER_DUP_ENTRY') {
      return res.json({success: false, message: constants.duplicateFoundError});
    }
    res.json({success: false, message: constants.internalServerError});
  }
});

router.get('', verifyToken, (req, res) => {
  try {
    Account.query().findOne({ email: req.account.email }).withGraphFetched('devices').then((account) => res.json({success: true, devices: account.devices ? account.devices : []}));
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.get('/:id', verifyToken, verifyDeviceOwnership, (req, res) => {
  try {
    Device.query().findOne({id: req.params.id}).then((device) => res.json({success: true, device: device ? device : 
      constants.noDeviceFound
    }));
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.put('/:id', verifyToken, verifyDeviceOwnership, async (req, res) => {
  try {
    var id = req.params.id;
    const identifier = req.body.identifier;

    //Validate input fields
    if(!identifier || !isHexadecimal(identifier) || !identifier.length == 8) {
      return res.status(400).json({success: false, message: constants.inputFieldError});
    }
    const account = await Account.query().findOne({ email: req.account.email }).withGraphFetched('devices');

    //Check if device with same identifier already exists
    for (const device of account.devices) {
      if (device.id != id && device.identifier == identifier) {
        return res.status(400).json({ success: false, message: constants.duplicateFoundError });
      }
    }

    const count = await Device.query().findById(id).patch({identifier});
    if(count == 0) {
      return res.status(404).json({success: false, message: constants.deviceNotFoundError});
    }
    res.json({ success: true, id });
  } catch(e)  {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.json({success: false, message: constants.duplicateFoundError});
    }
    res.json({success: false, message: constants.internalServerError});
  }
});

router.delete('/:id', verifyToken, verifyDeviceOwnership, async (req, res) => {
  try {
    const count = await Device.query().deleteById(req.params.id);
    if(count == 0) {
      return res.status(404).json({success: false, message: constants.deviceNotFoundError});
    }
    res.json({success: true, message: constants.deviceDeletionSuccess});
  } catch(e) {
    if (e.code === 'ER_TRUNCATED_WRONG_VALUE') {
      return res.status(400).json({success: false, message: constants.inputFieldError});
    }
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

export default router;
