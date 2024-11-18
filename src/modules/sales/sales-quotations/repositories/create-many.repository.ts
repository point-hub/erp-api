import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManySalesQuotationOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManySalesQuotationRepository {
  handle(documents: IDocument[]): Promise<ICreateManySalesQuotationOutput>
}

export class CreateManySalesQuotationRepository implements ICreateManySalesQuotationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManySalesQuotationOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
