import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateFormulaOutput {
  inserted_id: string
}
export interface ICreateFormulaRepository {
  handle(document: IDocument): Promise<ICreateFormulaOutput>
}

export class CreateFormulaRepository implements ICreateFormulaRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateFormulaOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
