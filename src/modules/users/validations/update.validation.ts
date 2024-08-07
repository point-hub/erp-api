export const updateValidation = {
  _id: ['required', 'string'],
  'data.role_id': ['required', 'string'],
  'data.code': ['required', 'string'],
  'data.name': ['required', 'string', 'min:5'],
  'data.username': ['required', 'string', 'min:5'],
  'data.email': ['required', 'string', 'email'],
  'data.password': ['required', 'string', 'min:5', 'password'],
}
