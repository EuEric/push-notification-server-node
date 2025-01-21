import express from 'express';
import { verifyToken } from '../../middleware/token_verify.js';
import { User } from '../../models/user.js'
import { Device } from '../../models/device.js'
import { extractDevice } from '../../middleware/extract_device.js';
import {createOwnershipMiddleware} from '../../middleware/ownership.js';
import isInt from 'validator/lib/isInt.js';
import constants  from '../../constants/api_constants.js';
const router = express.Router();

const verifyDeviceOwnership = createOwnershipMiddleware({
  model: Device,
  ownershipField: 'account_id',
  paramField: 'device_id',
});

router.use('/:device_id/users', verifyToken, verifyDeviceOwnership, extractDevice);

router.post('/:device_id/users', verifyToken, async (req, res) => {
  try {
    const name = req.body.name;
    const number = req.body.number;
    const device = req.device;  // Access the device extracted by the middleware
    
    //Validate input fields
    if(!name || !number || !isInt(number)) { 
      return res.status(400).json({success: false, message: constants.inputFieldError});
    }

    for (const user of device.users) {
      if (user.number == number || user.name == name) {
        return res.status(400).json({ success: false, message: constants.duplicateFoundError });
      }
    }
   
    const user = await User.query().insert({ name, number, device_id: device.id });
    return res.json({ success: true, user });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({success: false, message: constants.duplicateFoundError});
    }
    return res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.get('/:device_id/users', verifyToken, async (req, res) => {
  try {
    const device = req.device;
    res.json({success: true, users: device.users});
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.get('/:device_id/users/:id', verifyToken, verifyDeviceOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    const device = req.device;
    const user = device.users.find((user) => user.id == id);

    if (!user) {
      return res.status(404).json({ success: false, message: constants.noUserFound });
    }

    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: constants.internalServerError });
  }
});
  

router.put('/:device_id/users/:id', verifyToken, verifyDeviceOwnership, async (req, res) => {
  try {
    const { id, device_id } = req.params;
    const name = req.body.name;
    const number = req.body.number;
    const device = req.device;
    const user = await User.query().findOne({ id, device_id });

    if (!user) {
      return res.status(404).json({ success: false, message: constants.userNotFoundError });
    }

    //Validate input fields
    if(!name || !number || !isInt(number)) {
      return res.status(400).json({success: false, message: constants.inputFieldError});
    }

    //Check if user with same (name, number) already exists
    for (const user of device.users) {
      if (user.id != id && (user.number == number || user.name == name)) {
        return res.status(400).json({ success: false, message: constants.duplicateFoundError });
      }
    }

    const count = await User.query().findById(id).patch({name, number});
    if(count == 0) {
      return res.status(404).json({success: false, message: constants.userNotFoundError});
    }
    res.json({ success: true, id });
  } catch(e)  {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({success: false, message: constants.duplicateFoundError});
    }
    res.json({success: false, message: constants.internalServerError});
  }
});

router.delete('/:device_id/users/:id', verifyToken, verifyDeviceOwnership, async (req, res) => {
  try {
    const { device_id, id } = req.params;
    const user = await User.query().findOne({ id, device_id });

    if (!user) {
      return res.status(404).json({ success: false, message: constants.userNotFoundError });
    }

    const count = await User.query().deleteById(id);
    if (count === 0) {
      return res.status(404).json({ success: false, message: constants.userNotFoundError });
    }
    res.json({success: true, message: constants.userDeletionSuccess});
  } catch(e) {
    if (e.code === 'ER_TRUNCATED_WRONG_VALUE') {
      return res.status(400).json({success: false, message: constants.inputFieldError});
    }
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

export default router;
