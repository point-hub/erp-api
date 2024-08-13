export const createValidation = {
  customer_group_id: ['required', 'string'],
  code: ['required', 'string'],
  name: ['required', 'string'],
  email: ['email', 'string'],
}
