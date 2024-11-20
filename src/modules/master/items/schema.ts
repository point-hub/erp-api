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
      required: ['category._id', 'chart_of_account._id', 'code', 'name'],
      properties: {
        'category._id': {
          bsonType: 'objectId',
          description: 'The category for the item',
        },
        'chart_of_account._id': {
          bsonType: 'objectId',
          description: 'The chart of account for the item',
        },
        code: {
          bsonType: 'string',
          description: 'The code for the item',
        },
        name: {
          bsonType: 'string',
          description: 'The name for the item',
        },
        unit: {
          bsonType: 'string',
          description: 'The unit for the item',
        },
        notes: {
          bsonType: 'string',
          description: 'The notes for the item',
        },
      },
    },
  },
]
