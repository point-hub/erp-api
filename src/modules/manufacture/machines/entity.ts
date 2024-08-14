import { IMachineEntity } from './interface'

export const collectionName = 'machines'

export class MachineEntity {
  constructor(public data: IMachineEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
