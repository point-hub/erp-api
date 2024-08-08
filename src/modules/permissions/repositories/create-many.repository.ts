import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyPermissionOutput extends ICreateManyOutput {}
export interface ICreateManyPermissionRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyPermissionOutput>
}

export class CreateManyPermissionRepository implements ICreateManyPermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyPermissionOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
