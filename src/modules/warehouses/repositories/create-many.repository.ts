import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyWarehouseOutput extends ICreateManyOutput {}
export interface ICreateManyWarehouseRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyWarehouseOutput>
}

export class CreateManyWarehouseRepository implements ICreateManyWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyWarehouseOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
