import { Model } from 'objection';
import { Account }  from './account.js';

export class Client extends Model {
  // Specify the table name
  static get tableName() {
    return 'clients';
  }

  // Define the JSON schema for validation (optional but recommended)
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['account_name', 'number'],
      properties: {
        id: { type: 'integer' },
        account_name: { type: 'string', maxLength: 255 },
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
          from: 'clients.account_id',
          to: 'accounts.id',
        },
      },
    };
  }
}