import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateChartOfAccountOutput extends IUpdateOutput {}
export interface IUpdateChartOfAccountRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountOutput>
}

export class UpdateChartOfAccountRepository implements IUpdateChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
