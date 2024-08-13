import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManySettingJournalOutput extends IUpdateManyOutput {}
export interface IUpdateManySettingJournalRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManySettingJournalOutput>
}

export class UpdateManySettingJournalRepository implements IUpdateManySettingJournalRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManySettingJournalOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
