import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManySettingJournalOutput extends IDeleteManyOutput {}
export interface IDeleteManySettingJournalRepository extends IDeleteManyRepository {
  handle(_ids: string[]): Promise<IDeleteManySettingJournalOutput>
}

export class DeleteManySettingJournalRepository implements IDeleteManySettingJournalRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManySettingJournalOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
