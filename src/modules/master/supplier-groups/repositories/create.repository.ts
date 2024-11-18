import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateSupplierGroupOutput {
  inserted_id: string
}
export interface ICreateSupplierGroupRepository {
  handle(document: IDocument): Promise<ICreateSupplierGroupOutput>
}

export class CreateSupplierGroupRepository implements ICreateSupplierGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateSupplierGroupOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
