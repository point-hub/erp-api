import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateSalesQuotationOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateSalesQuotationRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateSalesQuotationOutput>
}

export class UpdateSalesQuotationRepository implements IUpdateSalesQuotationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateSalesQuotationOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
