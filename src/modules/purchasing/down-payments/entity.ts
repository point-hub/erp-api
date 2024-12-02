import { IDownPaymentEntity } from './interface'

export const collectionName = 'down_payments'

export const formNumberPrefix = 'PD'

export class DownPaymentEntity {
  constructor(public data: IDownPaymentEntity) {}
}
