import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyReceiveOrderOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyReceiveOrderRepository {
  handle(documents: IDocument[]): Promise<ICreateManyReceiveOrderOutput>
}

export class CreateManyReceiveOrderRepository implements ICreateManyReceiveOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyReceiveOrderOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
