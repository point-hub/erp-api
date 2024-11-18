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
      required: ['supplier_group_id', 'code', 'name'],
      properties: {
        supplier_group_id: {
          bsonType: 'objectId',
          description: 'The code for the supplier',
        },
        code: {
          bsonType: 'string',
          description: 'The code for the supplier',
        },
        name: {
          bsonType: 'string',
          description: 'The name for the supplier',
        },
        notes: {
          bsonType: 'string',
          description: 'The notes for the supplier',
        },
      },
    },
  },
]
