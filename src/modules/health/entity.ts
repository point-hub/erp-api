import { IHealthEntity } from './interface'

export const collectionName = 'healths'

export class HealthEntity {
  constructor(public data: IHealthEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
