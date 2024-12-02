import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyDownPaymentOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyDownPaymentRepository {
  handle(documents: IDocument[]): Promise<ICreateManyDownPaymentOutput>
}

export class CreateManyDownPaymentRepository implements ICreateManyDownPaymentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyDownPaymentOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
