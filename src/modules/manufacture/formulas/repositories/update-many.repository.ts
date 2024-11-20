import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyFormulaOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyFormulaRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyFormulaOutput>
}

export class UpdateManyFormulaRepository implements IUpdateManyFormulaRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyFormulaOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
