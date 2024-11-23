export const updateValidation = {
  'supplier_group._id': ['required', 'string'],
  code: ['required', 'string'],
  name: ['required', 'string'],
  email: ['email'],
  notes: ['string'],
}
