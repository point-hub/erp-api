import { IRoleEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'roles'

export class RoleEntity {
  constructor(public data: IRoleEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
