import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateDownPaymentOutput {
  inserted_id: string
}
export interface ICreateDownPaymentRepository {
  handle(document: IDocument): Promise<ICreateDownPaymentOutput>
}

export class CreateDownPaymentRepository implements ICreateDownPaymentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateDownPaymentOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
