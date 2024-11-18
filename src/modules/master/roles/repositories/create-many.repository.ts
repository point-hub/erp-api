import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyRoleOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyRoleRepository {
  handle(documents: IDocument[]): Promise<ICreateManyRoleOutput>
}

export class CreateManyRoleRepository implements ICreateManyRoleRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyRoleOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
