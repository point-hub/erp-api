export const signupValidation = {
  role_id: ['required', 'string'],
  code: ['required', 'string'],
  name: ['required', 'string', 'min:5'],
  username: ['required', 'string', 'min:5'],
  email: ['required', 'string', 'email'],
  password: ['required', 'string', 'min:5', 'password'],
}
