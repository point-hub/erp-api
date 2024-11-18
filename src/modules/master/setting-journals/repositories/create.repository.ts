import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateSettingJournalOutput extends ICreateOutput {}
export interface ICreateSettingJournalRepository extends ICreateRepository {
  handle(document: IDocument): Promise<ICreateSettingJournalOutput>
}

export class CreateSettingJournalRepository implements ICreateSettingJournalRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateSettingJournalOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
