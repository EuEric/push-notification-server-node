import { Model } from 'objection';
import { Device } from './device.js';
import { Zone } from './zone.js';
import { Client } from './client.js';
export class Account extends Model {
  // Specify the table name
  static get tableName() {
    return 'accounts';
  }

  // Define the JSON schema for validation (optional but recommended)
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email', maxLength: 255 },
        password: { type: 'string', maxLength: 255 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  // Define any relationships (if needed)
  static get relationMappings() {
    return {
      devices: {
        relation: Model.HasManyRelation,
        modelClass: Device,
        join: {
          from: 'accounts.id',
          to: 'devices.account_id',
        },
      },
      zones: {
        relation: Model.HasManyRelation,
        modelClass: Zone,
        join: {
          from: 'accounts.id',
          to: 'zones.account_id',
        }
      },
      clients: {
        relation: Model.HasManyRelation,
        modelClass: Client,
        join: {
          from: 'accounts.id',
          to: 'clients.account_id',
        }
      }
    };
  }
}