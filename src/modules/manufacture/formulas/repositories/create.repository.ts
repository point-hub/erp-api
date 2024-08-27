import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateFormulaOutput {
  inserted_id: string
}
export interface ICreateFormulaRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateFormulaOutput>
}

export class CreateFormulaRepository implements ICreateFormulaRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateFormulaOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
