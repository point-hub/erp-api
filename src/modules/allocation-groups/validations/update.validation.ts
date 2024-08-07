export const updateValidation = {
  _id: ['required', 'string'],
  'data.code': ['string', 'max:4'],
  'data.name': ['string'],
}
