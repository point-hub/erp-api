// https://www.npmjs.com/package/validatorjs

export const updateValidation = {
  _id: ['required', 'string'],
  'data.type_id': ['required', 'string'],
  'data.category_id': ['required', 'string'],
  'data.number': ['required', 'integer'],
  'data.name': ['required', 'string'],
  'data.subledger': ['string'],
  'data.notes': ['string'],
}
