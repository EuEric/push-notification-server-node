import { Model } from 'objection';
import { Account }  from './account.js';

export class Device extends Model {
  // Specify the table name
  static get tableName() {
    return 'devices';
  }

  // Define the JSON schema for validation (optional but recommended)
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['identifier', 'account_id'],
      properties: {
        id: { type: 'integer' },
        identifier: { type: 'string', maxLength: 255 },
        account_id: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  // Define any relationships (if needed)
  static get relationMappings() {
    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'devices.account_id',
          to: 'accounts.id',
        },
      },
    };
  }
}