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
    unique: [],
    uniqueIfExists: [[]],
    schema: {
      bsonType: 'object',
      required: ['master', 'purchasing'],
      properties: {
        master: {
          bsonType: 'object',
          description: 'The master for the permission',
        },
        purchasing: {
          bsonType: 'object',
          description: 'The purchasing for the permission',
        },
      },
    },
  },
]
