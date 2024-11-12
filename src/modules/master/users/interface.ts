export interface IUserEntity {
  _id?: string
  role_id?: string
  role?: { _id: string; code: string; name: string }
  default_branch?: string
  branches?: string[]
  default_warehouse?: string
  warehouses?: string[]
  name?: string
  username?: string
  trimmed_username?: string // for checking unique username by ignoring spaces
  email?: string
  trimmed_email?: string // for checking unique email by ignoring dot and +
  email_verification_code?: string
  is_email_verified?: boolean
  password?: string
  created_date?: Date
  updated_date?: Date
}

export interface IAuthBy {
  lookup_from?: string
  _id: string
  label?: string
  email: string
  name?: string
  username?: string
}

export interface IAuth {
  _id: string
  name: string
  username: string
  email: string
  role: {
    _id: string
    code: string
    name: string
    permission: {
      [key: string]: boolean | { [key: string]: boolean }
    }
  }
  default_branch: string
  branches: string[]
  default_warehouse: string
  warehouses: string[]
}

export interface IUserToken {
  application_id?: string
  user_id?: string
  access_token?: string
  refresh_token?: string
}
