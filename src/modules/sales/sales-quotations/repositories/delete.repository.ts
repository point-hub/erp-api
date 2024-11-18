import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteSalesQuotationOutput {
  deleted_count: number
}
export interface IDeleteSalesQuotationRepository {
  handle(_id: string): Promise<IDeleteSalesQuotationOutput>
}

export class DeleteSalesQuotationRepository implements IDeleteSalesQuotationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteSalesQuotationOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
