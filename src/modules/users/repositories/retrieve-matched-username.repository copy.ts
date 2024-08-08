import type { IDatabase, IQuery, IRetrieveAllOutput, IRetrieveAllRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRetrieveMatchedUsernameRepository extends IRetrieveAllRepository {}

export class RetrieveMatchedUsernameRepository implements IRetrieveAllRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllOutput> {
    const response = await this.database.collection(collectionName).retrieveAll(
      {
        filter: {
          $or: [
            {
              trimmed_username: {
                $regex: `^${query.filter?.username}$`,
                $options: 'i',
              },
            },
            {
              trimmed_email: {
                $regex: `^${query.filter?.username}$`,
                $options: 'i',
              },
            },
          ],
        },
      },
      options,
    )
    return response
  }
}
