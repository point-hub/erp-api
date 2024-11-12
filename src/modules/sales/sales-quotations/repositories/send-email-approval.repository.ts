import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ISendEmailApprovalOutput {
  matched_count: number
  modified_count: number
}
export interface ISendEmailApprovalRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<ISendEmailApprovalOutput>
}

export class SendEmailApprovalRepository implements ISendEmailApprovalRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<ISendEmailApprovalOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
