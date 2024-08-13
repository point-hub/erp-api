import { IPermissionEntity } from './interface'

export const collectionName = 'permissions'

export class PermissionEntity {
  constructor(public data: IPermissionEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
