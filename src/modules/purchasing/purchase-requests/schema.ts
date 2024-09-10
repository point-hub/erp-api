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
    unique: [['form_number', 'rev']],
    uniqueIfExists: [[]],
    schema: {
      bsonType: 'object',
      required: ['form_number', 'rev', 'allocation._id'],
      properties: {
        form_number: {
          bsonType: 'string',
          description: 'The form_number for the purchase request',
        },
        rev: {
          bsonType: 'number',
          description: 'The number of revisiion for the purchase request start with 0 for no revision',
        },
        notes: {
          bsonType: 'string',
          description: 'The notes for the purchase request',
        },
      },
    },
  },
]
