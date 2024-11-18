import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteSettingJournalOutput extends IDeleteOutput {}
export interface IDeleteSettingJournalRepository extends IDeleteRepository {
  handle(_id: string): Promise<IDeleteSettingJournalOutput>
}

export class DeleteSettingJournalRepository implements IDeleteSettingJournalRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteSettingJournalOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
