import { IMachineEntity } from './interface'

export const collectionName = 'machines'

export class MachineEntity {
  constructor(public data: IMachineEntity) {}

  public generateDate('created_date') {
    this.data.created_date = new Date()
  }

  public generateDate('updated_date') {
    this.data.updated_date = new Date()
  }
}
