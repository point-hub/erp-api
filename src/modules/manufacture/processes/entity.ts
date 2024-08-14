import { IProcessEntity } from './interface'

export const collectionName = 'machines'

export class ProcessEntity {
  constructor(public data: IProcessEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
