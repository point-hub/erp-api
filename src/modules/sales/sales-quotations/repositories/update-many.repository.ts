import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManySalesQuotationOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManySalesQuotationRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManySalesQuotationOutput>
}

export class UpdateManySalesQuotationRepository implements IUpdateManySalesQuotationRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManySalesQuotationOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
