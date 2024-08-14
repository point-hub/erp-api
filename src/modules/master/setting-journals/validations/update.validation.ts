export const updateValidation = {
  _id: ['required', 'string'],
  'data.module': ['required', 'string'],
  'data.feature': ['required', 'string'],
  'data.journals.*.chart_of_account_id': ['string'],
  'data.journals.*.position': ['required', 'string'],
}
