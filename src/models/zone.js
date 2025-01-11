import { Model } from 'objection';
import { Account }  from './account.js';

export class Zone extends Model {
  // Specify the table name
  static get tableName() {
    return 'zones';
  }

  // Define the JSON schema for validation (optional but recommended)
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'number'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', maxLength: 255 },
        number: { type: 'string', maxLength: 255 },
        account_id: { type: 'integer' },
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
          from: 'zones.account_id',
          to: 'accounts.id',
        },
      },
    };
  }
}