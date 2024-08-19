export const createValidation = {
  category_id: ['required', 'string'],
  code: ['required', 'string'],
  name: ['required', 'string'],
  email: ['email'],
  notes: ['string'],
}
