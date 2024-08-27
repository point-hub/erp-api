import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteFormulaOutput {
  deleted_count: number
}
export interface IDeleteFormulaRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteFormulaOutput>
}

export class DeleteFormulaRepository implements IDeleteFormulaRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteFormulaOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
