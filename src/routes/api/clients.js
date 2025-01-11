import express from 'express';
import { verifyToken } from '../../middleware/token_verify.js';
import { Client } from '../../models/client.js'
import { Account } from '../../models/account.js'
import {createOwnershipMiddleware} from '../../middleware/ownership.js';
import isInt from 'validator/lib/isInt.js';
import constants  from '../../constants/api_constants.js';
const router = express.Router();

const verifyClientOwnership = createOwnershipMiddleware({
  model: Client,
  ownershipField: 'account_id',
});

router.post('', verifyToken, async (req, res) => {
  try {
    const account_name = req.body.account_name;
    const number = req.body.number;
    
    //Validate input fields
    if(!account_name || !number || !isInt(number)) {
      return res.status(400).json({success: false, message: constants.inputFieldError});
    }

    const account = await Account.query().findOne({ email: req.account.email }).withGraphFetched('clients');
    for (const client of account.clients) {
      if (client.number == number || client.account_name == account_name) {
        return res.status(400).json({ success: false, message: constants.duplicateFoundError });
      }
    }
   
    const client = await Client.query().insert({ account_name, number, account_id: account.id});
    return res.json({ success: true, client });
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
    Account.query().findOne({ email: req.account.email }).withGraphFetched('clients').then((account) => res.json({success: true, clients: account.clients ? account.clients : []}));
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.get('/:id', verifyToken, verifyClientOwnership, (req, res) => {
  try {
    Client.query().findOne({id: req.params.id}).then((client) => res.json({success: true, client: client ? client : 
      'No client found'
    }));
  } catch(e) {
    res.status(500).json({success: false, message: constants.internalServerError});
  }
});

router.put('/:id', verifyToken, verifyClientOwnership, async (req, res) => {
  var id = req.params.id;
  const account_name = req.body.account_name;
  const number = req.body.number;

  //Validate input fields
  if(!account_name || !number || !isInt(number)) {
    return res.status(400).json({success: false, message: constants.inputFieldError});
  }

  const account = await Account.query().findOne({ email: req.account.email }).withGraphFetched('clients');

  //Check if client with same (account_name, number) already exists
  for (const client of account.clients) {
    if (client.id != id && (client.number == number || client.account_name == account_name)) {
      return res.status(400).json({ success: false, message: constants.duplicateFoundError });
    }
  }

  Client.query()
    .findById(id)
    .patch({account_name, number})
    .then((count) => {
      if(count === 0) {
        return res.status(404).json({success: false, message: constants.clientNotFoundError});
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

router.delete('/:id', verifyToken, verifyClientOwnership, (req, res) => {
  Client.query().deleteById(req.params.id)
    .then((count) => {
      if (count === 0) {
        return res.status(404).json({success: false, message: constants.clientNotFoundError});
      }
      res.json({success: true, message: constants.clientDeletionSuccess});
    })
    .catch((e) => {
      if (e.code === 'ER_TRUNCATED_WRONG_VALUE') {
        return res.status(400).json({success: false, message: constants.inputFieldError});
      }

      res.status(500).json({success: false, message: constants.internalServerError});
    });
});

export default router;
