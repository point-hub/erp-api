import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateCustomerGroupOutput extends IUpdateOutput {}
export interface IUpdateCustomerGroupRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateCustomerGroupOutput>
}

export class UpdateRepository implements IUpdateCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateCustomerGroupOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
