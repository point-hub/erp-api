export const updateValidation = {
  _id: ['required', 'string'],
  'data.code': ['required', 'string', 'max:4'],
  'data.name': ['required', 'string'],
  'data.notes': ['string'],
}
