import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyBranchOutput extends ICreateManyOutput {}
export interface ICreateManyBranchRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyBranchOutput>
}

export class CreateManyRepository implements ICreateManyBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyBranchOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
