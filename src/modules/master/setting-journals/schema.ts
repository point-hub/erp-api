/**
 * MongoDB Schema
 *
 * https://www.mongodb.com/docs/v7.0/core/schema-validation/update-schema-validation/
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
 * https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/
 */

import type { ISchema } from '@point-hub/papi'

import { collectionName } from './entity'

export const schema: ISchema[] = [
  {
    collection: collectionName,
    unique: [['module', 'feature']],
    uniqueIfExists: [[]],
    schema: {
      bsonType: 'object',
      required: ['module', 'feature'],
      properties: {
        module: {
          bsonType: 'string',
          description: 'The module name for the setting journal',
        },
        feature: {
          bsonType: 'string',
          description: 'The feature name for the setting journal',
        },
      },
    },
  },
]
