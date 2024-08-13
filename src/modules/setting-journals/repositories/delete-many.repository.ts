import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManySettingJournalOutput extends IDeleteManyOutput {}
export interface IDeleteManySettingJournalRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManySettingJournalOutput>
}

export class DeleteManySettingJournalRepository implements IDeleteManySettingJournalRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManySettingJournalOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
