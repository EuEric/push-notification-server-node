import { Model } from 'objection';
import { Device }  from './device.js';

export class User extends Model {
  // Specify the table name
  static get tableName() {
    return 'users';
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
        device_id: { type: 'integer' },
      },
    };
  }

  // Define any relationships (if needed)
  static get relationMappings() {

    return {
      device: {
        relation: Model.BelongsToOneRelation,
        modelClass: Device,
        join: {
          from: 'users.device_id',
          to: 'devices.id',
        },
      },
    };
  }
}