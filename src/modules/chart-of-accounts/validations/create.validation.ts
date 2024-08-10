// https://www.npmjs.com/package/validatorjs

export const createValidation = {
  type_id: ['required', 'string'],
  category_id: ['required', 'string'],
  number: ['required', 'integer'],
  name: ['required', 'string'],
  subledger: ['string'],
  increasing_in: ['string'],
}
