import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyAllocationGroupOutput extends ICreateManyOutput {}
export interface ICreateManyAllocationGroupRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyAllocationGroupOutput>
}

export class CreateManyRepository implements ICreateManyAllocationGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyAllocationGroupOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
