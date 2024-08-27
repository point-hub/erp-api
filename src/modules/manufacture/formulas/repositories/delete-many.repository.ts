import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyFormulaOutput {
  deleted_count: number
}
export interface IDeleteManyFormulaRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyFormulaOutput>
}

export class DeleteManyFormulaRepository implements IDeleteManyFormulaRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyFormulaOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
