import express from 'express';
import { verifyToken } from '../../middleware/token_verify.js';
import { Partition } from '../../models/partition.js'
import { Account } from '../../models/account.js'
import {createOwnershipMiddleware} from '../../middleware/ownership.js';
import isInt from 'validator/lib/isInt.js';
import constants  from '../../constants/api_constants.js';
const router = express.Router();

const verifyPartitionOwnership = createOwnershipMiddleware({
  model: Partition,
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

    const account = await Account.query().findOne({ email: req.account.email }).withGraphFetched('partitions');
    for (const partition of account.partitions) {
      if (partition.number == number || partition.name == name) {
        return res.status(400).json({ success: false, message: constants.duplicateFoundError });
      }
    }
   
    const partition = await Partition.query().insert({ name, number, account_id: account.id});
    return res.json({ success: true, partition });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(500).json({success: false, message: constants.duplicateFoundError});
    }
    console.log(e);
    return res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.get('', verifyToken, async (req, res) => {
  try {
    Account.query().findOne({ email: req.account.email }).withGraphFetched('partitions').then((account) => res.json({success: true, partitions: account.partitions ? account.partitions : []}));
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.get('/:id', verifyToken, verifyPartitionOwnership, (req, res) => {
  try {
    Partition.query().findOne({id: req.params.id}).then((partition) => res.json({success: true, partition: partition ? partition : 
      'No partition found'
    }));
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.put('/:id', verifyToken, verifyPartitionOwnership, async (req, res) => {
  var id = req.params.id;
  const name = req.body.name;
  const number = req.body.number;

  //Validate input fields
  if(!name || !number || !isInt(number)) {
    return res.status(400).json({success: false, message: constants.inputFieldError});
  }

  const account = await Account.query().findOne({ email: req.account.email }).withGraphFetched('partitions');

  //Check if partition with same (name, number) already exists
  for (const partition of account.partitions) {
    if (partition.id != id && (partition.number == number || partition.name == name)) {
      return res.status(400).json({ success: false, message: constants.duplicateFoundError });
    }
  }

  Partition.query()
    .findById(id)
    .patch({name, number})
    .then((count) => {
      if(count === 0) {
        return res.status(404).json({success: false, message: constants.partitionNotFoundError});
      }
      res.json({ success: true, id });
    })
    .catch((e) => {
      console.log(e);
      if (e.code === 'ER_DUP_ENTRY') {
        return res.json({success: false, message: constants.duplicateFoundError});
      }
      res.json({success: false, message: constants.internalServerError});
    })
});

router.delete('/:id', verifyToken, verifyPartitionOwnership, (req, res) => {
  Partition.query().deleteById(req.params.id)
    .then((count) => {
      if (count === 0) {
        return res.status(404).json({success: false, message: constants.partitionNotFoundError});
      }
      res.json({success: true, message: constants.partitionDeletionSuccess});
    })
    .catch((e) => {
      if (e.code === 'ER_TRUNCATED_WRONG_VALUE') {
        return res.status(400).json({success: false, message: constants.inputFieldError});
      }

      res.status(500).json({success: false, message: constants.internalServerError});
    });
});

export default router;
