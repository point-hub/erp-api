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
      required: ['code', 'name', 'permission'],
      properties: {
        code: {
          bsonType: 'string',
          description: 'The code for the role',
        },
        name: {
          bsonType: 'string',
          description: 'The name for the role',
        },
        permission: {
          bsonType: 'object',
          description: 'The permission for the role',
        },
        notes: {
          bsonType: 'string',
          description: 'The notes for the role',
        },
      },
    },
  },
]
