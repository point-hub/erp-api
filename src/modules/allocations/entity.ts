import { IAllocationEntity } from './interface'

export const collectionName = 'allocations'

export class AllocationEntity {
  constructor(public data: IAllocationEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
