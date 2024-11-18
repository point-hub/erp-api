import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateSalesQuotationOutput {
  inserted_id: string
}
export interface ICreateSalesQuotationRepository {
  handle(document: IDocument): Promise<ICreateSalesQuotationOutput>
}

export class CreateSalesQuotationRepository implements ICreateSalesQuotationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateSalesQuotationOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
