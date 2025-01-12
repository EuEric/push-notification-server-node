import { Account }  from '../models/account.js';
import constants  from '../constants/api_constants.js';

export function createOwnershipMiddleware({ model, ownershipField = 'account_id', paramField = 'id' }) {
    return async function verifyOwnership(req, res, next) {
      try {
        const resourceId = req.params[paramField];
        const userEmail = req.account.email;

        console.log(resourceId);

        if(!resourceId || !Number.isInteger(Number(resourceId))) {
          return res.status(400).json({ success: false, message: constants.inputFieldError});
        }
  
        // Fetch the account of the user making the request
        const account = await Account.query().findOne({ email: userEmail });
        if (!account) {
          return res.status(404).json({ success: false, message: constants.accountNotFoundError });
        }
  
        // Fetch the resource and verify ownership
        const resource = await model.query().findById(resourceId);
        if (!resource) {
          return res.status(404).json({ success: false, message: constants.resourceNotFoundError });
        }

        console.log(account);
        console.log(resource);
  
        if (resource[ownershipField] !== account.id) {
          return res.status(403).json({ success: false, message: constants.forbiddenResourceError });
        }
  
        // Ownership verified, attach resource to request for later use if needed
        req.resource = resource;
  
        next();
      } catch (e) {
        res.status(500).json({ success: false, message: constants.internalServerError });
      }
    };
  }
  