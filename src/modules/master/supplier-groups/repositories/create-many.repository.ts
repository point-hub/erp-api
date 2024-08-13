import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManySupplierGroupOutput extends ICreateManyOutput {}
export interface ICreateManySupplierGroupRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManySupplierGroupOutput>
}

export class CreateManySupplierGroupRepository implements ICreateManySupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManySupplierGroupOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
