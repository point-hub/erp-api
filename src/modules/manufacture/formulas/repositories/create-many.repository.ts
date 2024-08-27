import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyFormulaOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyFormulaRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyFormulaOutput>
}

export class CreateManyFormulaRepository implements ICreateManyFormulaRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyFormulaOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
