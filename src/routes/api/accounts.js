import dotenv from 'dotenv'
import express from 'express';
import isStrongPassword from 'validator/lib/isStrongPassword.js';
import isEmail from 'validator/lib/isEmail.js';
import { verifyToken } from '../../middleware/token_verify.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Account } from '../../models/account.js'
const router = express.Router();
//Needed to specify multiple paths, because by default, config will look for a file called .env in the current working directory.
//For migrations the cwd will be src/db, and generally for running the main app, the cwd will be /src
dotenv.config({ path: ['../../.env', '../.env'] })
const internalServerError = 'Internal server error';
const invalidCredentialsError = 'Invalid credentials';
const inputFieldMissingError = 'An input field missing';
const emailAlreadyExistsError = 'Email already exists';
const emailFormatInvalidError = 'Email format invalid';
const weakPasswordError = 'Password is not strong enough';
const accountNotFoundError = 'Account not found';

const accountRegistrationSuccess = 'Account registered successfully';

router.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //Check if values are empty or rnot
    if(!email || !password) {
      return res.status(400).json({error: inputFieldMissingError});
    }

    //Check if user already exists
    const account = await Account.query().findOne({ email });
    if(account) {
      return res.status(400).json({error: emailAlreadyExistsError});
    }

    if(!isEmail(email)) {
      return res.status(400).json({error: emailFormatInvalidError});
    }

    if(!isStrongPassword(password)) {
      return res.status(400).json({error: weakPasswordError});
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create a new account
    const accountInstance = new Account({
      email: email,
      password: hashedPassword,
    });

    // Now, insert the account instance into the database
    const newAccount = await Account.query().insert({
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(201).json({ message: accountRegistrationSuccess });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: internalServerError });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //Check if values are empty or rnot
    if(!email || !password) {
      return res.status(400).json({error: inputFieldMissingError});
    }

    // Check if the email exists
    const account = await Account.query().findOne({ email: req.body.email });
    if (!account) {
      return res.status(401).json({ error: invalidCredentialsError });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(req.body.password, account.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: invalidCredentialsError });
    }

    const secret = process.env.SECRET;

    // Generate JWT token
    //TODO: modify secret
    const token = jwt.sign({ email: account.email }, secret);
    res.status(200).json({ token });
    //TODO: do something with token? save it?
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: internalServerError }); 
  }
});

// Protected route to get account details
router.get('/account', verifyToken, async (req, res) => {
  try {
    // Fetch account details using decoded token
    const account = await Account.findOne({ email: req.account.email });
    if (!account) {
      return res.status(404).json({ error: accountNotFoundError });
    }
    res.status(200).json({ email: user.email });
  } catch (error) {
    res.status(500).json({ error: internalServerError });
  }
});

export default router;