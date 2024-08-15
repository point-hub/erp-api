export const updateValidation = {
  _id: ['required', 'string'],
  'data.code': ['required', 'string'],
  'data.name': ['required', 'string'],
  'data.permission': ['required'],
  'data.notes': ['string'],
}
