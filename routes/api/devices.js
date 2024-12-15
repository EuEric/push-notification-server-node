import express from 'express';
import knex from '../../knexfile.js'; // Adjust file extension for ESM
const router = express.Router();

router.post('', (req, res) => {
  // TODO: Implementation
  knex('devices')
    .insert({
      token: req.body['token'],
      phone_number: req.body['phone_number']
    })
    .then(() => res.send('Created device!'));
});

router.get('', (req, res) => {
  knex.select().from('devices').then((devices) => res.send(devices));
});

router.get('/:id', (req, res) => {
  knex('devices')
    .where('id', req.params.id)
    .then((device) => res.send(device));
});

router.put('/:id', (req, res) => {
  knex('devices')
    .where('id', req.params.id)
    .update({
      token: req.body['token'],
      phone_number: req.body['phone_number']
    })
    .then(() => res.send('Updated device!'));
});

router.delete('/:id', (req, res) => {
  knex('devices')
    .where('id', req.params.id)
    .del()
    .then(() => res.send('Deleted device!'));
});

export default router;
