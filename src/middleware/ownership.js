import { Account }  from '../models/account.js';
const accountNotFoundError = 'Account not found';
const resourceNotFoundError = 'Resource not found';
const forbiddenResourceError = 'Forbidden: You do not own this resource';
const ownershipVerifyError = 'Error in ownership verification middleware:';
const internalServerError = 'Internal server error';

export function createOwnershipMiddleware({ model, ownershipField = 'account_id' }) {
    return async function verifyOwnership(req, res, next) {
      try {
        const { id } = req.params;
        const userEmail = req.account.email;
  
        // Fetch the account of the user making the request
        const account = await Account.query().findOne({ email: userEmail });
        if (!account) {
          return res.status(404).json({ success: false, message: accountNotFoundError });
        }
  
        // Fetch the resource and verify ownership
        const resource = await model.query().findById(id);
        if (!resource) {
          return res.status(404).json({ success: false, message: resourceNotFoundError });
        }
  
        if (resource[ownershipField] !== account.id) {
          return res.status(403).json({ success: false, message: forbiddenResourceError });
        }
  
        // Ownership verified, attach resource to request for later use if needed
        req.resource = resource;
  
        next();
      } catch (e) {
        console.error(ownershipVerifyError, e);
        res.status(500).json({ success: false, message: internalServerError });
      }
    };
  }
  