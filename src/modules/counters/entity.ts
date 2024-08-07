import { ICounterEntity } from './interface'

export const collectionName = 'counters'

export class CounterEntity {
  constructor(public data: ICounterEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
