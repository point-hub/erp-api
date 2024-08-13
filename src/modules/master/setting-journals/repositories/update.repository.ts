import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateSettingJournalOutput extends IUpdateOutput {}
export interface IUpdateSettingJournalRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateSettingJournalOutput>
}

export class UpdateSettingJournalRepository implements IUpdateSettingJournalRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateSettingJournalOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
