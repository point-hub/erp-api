import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateSalesQuotationOutput {
  inserted_id: string
}
export interface ICreateSalesQuotationRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateSalesQuotationOutput>
}

export class CreateSalesQuotationRepository implements ICreateSalesQuotationRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateSalesQuotationOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
