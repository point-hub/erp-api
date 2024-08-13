import { IAllocationGroupEntity } from './interface'

export const collectionName = 'allocation_groups'

export class AllocationGroupEntity {
  constructor(public data: IAllocationGroupEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
