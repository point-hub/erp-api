import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateSettingJournalOutput extends ICreateOutput {}
export interface ICreateSettingJournalRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateSettingJournalOutput>
}

export class CreateSettingJournalRepository implements ICreateSettingJournalRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateSettingJournalOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
