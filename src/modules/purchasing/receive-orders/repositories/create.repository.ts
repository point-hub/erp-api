import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateReceiveOrderOutput {
  inserted_id: string
}
export interface ICreateReceiveOrderRepository {
  handle(document: IDocument): Promise<ICreateReceiveOrderOutput>
}

export class CreateReceiveOrderRepository implements ICreateReceiveOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateReceiveOrderOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
