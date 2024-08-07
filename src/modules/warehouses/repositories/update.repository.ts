import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateWarehouseOutput extends IUpdateOutput {}
export interface IUpdateWarehouseRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateWarehouseOutput>
}

export class UpdateWarehouseRepository implements IUpdateWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateWarehouseOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
