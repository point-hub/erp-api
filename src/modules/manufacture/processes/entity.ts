import { IProcessEntity } from './interface'

export const collectionName = 'processes'

export class ProcessEntity {
  constructor(public data: IProcessEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
