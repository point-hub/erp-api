// https://www.npmjs.com/package/validatorjs

export const updateValidation = {
  type_id: ['required', 'string'],
  category_id: ['required', 'string'],
  number: ['required', 'string'],
  name: ['required', 'string'],
  subledger: ['string'],
  notes: ['string'],
}
