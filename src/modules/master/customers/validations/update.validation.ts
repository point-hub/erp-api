export const updateValidation = {
  customer_group_id: ['required', 'string'],
  code: ['required', 'string'],
  name: ['required', 'string'],
  email: ['email'],
  notes: ['string'],
}
