import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateCustomerOutput extends IUpdateOutput {}
export interface IUpdateCustomerRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateCustomerOutput>
}

export class UpdateCustomerRepository implements IUpdateCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateCustomerOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
