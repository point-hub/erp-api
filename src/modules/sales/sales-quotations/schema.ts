/**
 * MongoDB Schema
 *
 * https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
 * https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/
 */

import type { ISchema } from '@point-hub/papi'

import { collectionName } from './entity'

export const schema: ISchema[] = [
  {
    collection: collectionName,
    unique: [['form_number', 'rev']],
    uniqueIfExists: [[]],
    schema: {
      bsonType: 'object',
      required: ['form_number', 'rev', 'branch._id', 'details.item._id', 'details.allocation._id'],
      properties: {
        form_number: {
          bsonType: 'string',
          description: 'The form_number for the sales quotation',
        },
        revised_count: {
          bsonType: 'number',
          description: 'The number of revision for the sales quotation start with 0 for no revision',
        },
        notes: {
          bsonType: 'string',
          description: 'The notes for the sales quotation',
        },
        created_by: {
          bsonType: 'object',
          description: 'Authenticated user who perform create form',
        },
        'created_by.label': {
          bsonType: 'string',
          description: 'xx',
        },
      },
    },
  },
]
