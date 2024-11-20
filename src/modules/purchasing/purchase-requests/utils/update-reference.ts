/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IDetail } from '../interface'

export interface IUpdatePurchaseRequestReference {
  handle(_id: string, document: IDocument, details: IDetail): Promise<void>
}

export interface IPurchaseRequestReference {
  ref_name: string
  ref_id: string
  details: {
    _id: string
    quantity: number
  }[]
}

export class UpdatePurchaseRequestReference implements IUpdatePurchaseRequestReference {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IPurchaseRequestReference, details: IDetail): Promise<void> {
    //
  }
}
