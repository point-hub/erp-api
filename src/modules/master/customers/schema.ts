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
    unique: [['code'], ['name']],
    uniqueIfExists: [[]],
    schema: {
      bsonType: 'object',
      required: ['customer_group._id', 'code', 'name'],
      properties: {
        'customer_group._id': {
          bsonType: 'objectId',
          description: 'The code for the customer',
        },
        code: {
          bsonType: 'string',
          description: 'The code for the customer',
        },
        name: {
          bsonType: 'string',
          description: 'The name for the customer',
        },
        notes: {
          bsonType: 'string',
          description: 'The notes for the customer',
        },
      },
    },
  },
]
