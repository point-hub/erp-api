import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateSupplierGroupOutput extends IUpdateOutput {}
export interface IUpdateSupplierGroupRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateSupplierGroupOutput>
}

export class UpdateRepository implements IUpdateSupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateSupplierGroupOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
