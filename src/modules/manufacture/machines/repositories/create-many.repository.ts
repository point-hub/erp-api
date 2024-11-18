import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyMachineOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyMachineRepository {
  handle(documents: IDocument[]): Promise<ICreateManyMachineOutput>
}

export class CreateManyMachineRepository implements ICreateManyMachineRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyMachineOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
