import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyRoleOutput extends ICreateManyOutput {}
export interface ICreateManyRoleRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyRoleOutput>
}

export class CreateManyRoleRepository implements ICreateManyRoleRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyRoleOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
