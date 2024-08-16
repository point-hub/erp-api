import { IPermissionEntity } from './interface'

export const collectionName = 'permissions'

export class PermissionEntity {
  constructor(public data: IPermissionEntity) {}
}
