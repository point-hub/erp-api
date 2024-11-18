import { IProcessEntity } from './interface'

export const collectionName = 'processes'

export class ProcessEntity {
  constructor(public data: IProcessEntity) {}

  public generateDate('created_date') {
    this.data.created_date = new Date()
  }

  public generateDate('updated_date') {
    this.data.updated_date = new Date()
  }
}
