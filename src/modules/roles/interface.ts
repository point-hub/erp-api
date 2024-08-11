export interface IRoleEntity {
  _id?: string
  code?: string
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permission?: { [key: string]: any }
  created_by?: string
  updated_by?: string
  created_date?: Date
  updated_date?: Date
}
