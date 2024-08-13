import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateChartOfAccountTypeOutput extends IUpdateOutput {}
export interface IUpdateChartOfAccountTypeRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountTypeOutput>
}

export class UpdateChartOfAccountTypeRepository implements IUpdateChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
