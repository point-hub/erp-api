export interface IUserEntity {
  _id?: string
  role_id?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  role?: { [key: string]: any }
  code?: string
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
}

export interface IUserToken {
  application_id?: string
  user_id?: string
  access_token?: string
  refresh_token?: string
}
