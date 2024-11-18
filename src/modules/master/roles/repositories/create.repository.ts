import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateRoleOutput {
  inserted_id: string
}
export interface ICreateRoleRepository {
  handle(document: IDocument): Promise<ICreateRoleOutput>
}

export class CreateRoleRepository implements ICreateRoleRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateRoleOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
