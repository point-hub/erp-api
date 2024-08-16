export interface INestedBoolean {
  [key: string]: boolean | { [key: string]: boolean }
}

export interface IPermissionEntity {
  master: INestedBoolean
  purchasing: INestedBoolean
  sales: INestedBoolean
  finance: INestedBoolean
  manufacture: INestedBoolean
  inventory: INestedBoolean
  accounting: INestedBoolean
}
