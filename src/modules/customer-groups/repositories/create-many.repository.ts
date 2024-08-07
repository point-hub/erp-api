import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyCustomerGroupOutput extends ICreateManyOutput {}
export interface ICreateManyCustomerGroupRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyCustomerGroupOutput>
}

export class CreateManyCustomerGroupRepository implements ICreateManyCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyCustomerGroupOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
