import { IBranchEntity } from './interface'

export const collectionName = 'branches'

export class BranchEntity {
  constructor(public data: IBranchEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
