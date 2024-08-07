import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyUserOutput extends ICreateManyOutput {}
export interface ICreateManyUserRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyUserOutput>
}

export class CreateManyUserRepository implements ICreateManyUserRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyUserOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
