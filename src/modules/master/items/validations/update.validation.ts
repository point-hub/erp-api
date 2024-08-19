export const updateValidation = {
  _id: ['required', 'string'],
  'data.chart_of_account_id': ['required', 'string'],
  'data.category_id': ['required', 'string'],
  'data.code': ['required', 'string'],
  'data.name': ['required', 'string'],
  'data.unit': ['required', 'string'],
  'data.notes': ['string'],
}
