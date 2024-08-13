import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManySupplierOutput extends ICreateManyOutput {}
export interface ICreateManySupplierRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManySupplierOutput>
}

export class CreateManySupplierRepository implements ICreateManySupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManySupplierOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
