/**
 * MongoDB Schema
 *
 * https://www.mongodb.com/docs/v6.0/core/schema-validation/update-schema-validation/
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
 * https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/
 */

import type { ISchema } from '@point-hub/papi'

import { collectionName } from './entity'

export const schema: ISchema[] = [
  {
    collection: collectionName,
    unique: [['number'], ['name']],
    uniqueIfExists: [[]],
    schema: {
      bsonType: 'object',
      required: ['category_id', 'number', 'name'],
      properties: {
        category_id: {
          bsonType: 'objectId',
          description: 'The category id for the chart of account',
        },
        number: {
          bsonType: 'number',
          description: 'The number for the chart of account',
        },
        name: {
          bsonType: 'string',
          description: 'The name for the chart of account',
        },
      },
    },
  },
]
