import { IReceiveOrderEntity } from './interface'

export const collectionName = 'receive_orders'

export const formNumberPrefix = 'PRE'

export class ReceiveOrderEntity {
  constructor(public data: IReceiveOrderEntity) {}
}
