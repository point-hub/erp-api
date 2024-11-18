import { IAllocationGroupEntity } from './interface'

export const collectionName = 'allocation_groups'

export type TypeFieldDate = 'created_date' | 'updated_date'

export class AllocationGroupEntity {
  constructor(public data: IAllocationGroupEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
