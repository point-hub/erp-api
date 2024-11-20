export const updateValidation = {
  'customer_group._id': ['required', 'string'],
  code: ['required', 'string'],
  name: ['required', 'string'],
  email: ['email'],
  notes: ['string'],
}
