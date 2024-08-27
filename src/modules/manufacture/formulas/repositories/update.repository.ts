import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateFormulaOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateFormulaRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateFormulaOutput>
}

export class UpdateFormulaRepository implements IUpdateFormulaRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateFormulaOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
