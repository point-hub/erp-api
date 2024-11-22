import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateMachineOutput {
  inserted_id: string
}
export interface ICreateMachineRepository {
  handle(document: IDocument): Promise<ICreateMachineOutput>
}

export class CreateMachineRepository implements ICreateMachineRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateMachineOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
