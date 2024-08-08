import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyCustomerOutput extends ICreateManyOutput {}
export interface ICreateManyCustomerRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyCustomerOutput>
}

export class CreateManyCustomerRepository implements ICreateManyCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyCustomerOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
