import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyFormulaOutput {
  deleted_count: number
}
export interface IDeleteManyFormulaRepository {
  handle(_ids: string[]): Promise<IDeleteManyFormulaOutput>
}

export class DeleteManyFormulaRepository implements IDeleteManyFormulaRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyFormulaOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
