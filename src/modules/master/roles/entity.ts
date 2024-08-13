import { IRoleEntity } from './interface'

export const collectionName = 'roles'

export class RoleEntity {
  constructor(public data: IRoleEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
