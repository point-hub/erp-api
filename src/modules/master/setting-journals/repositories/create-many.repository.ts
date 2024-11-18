import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManySettingJournalOutput extends ICreateManyOutput {}
export interface ICreateManySettingJournalRepository extends ICreateManyRepository {
  handle(documents: IDocument[]): Promise<ICreateManySettingJournalOutput>
}

export class CreateManySettingJournalRepository implements ICreateManySettingJournalRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManySettingJournalOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
