export const updateValidation = {
  _id: ['required', 'string'],
  'data.category_id': ['required', 'string'],
  'data.chart_of_account_id': ['required', 'string'],
  'data.code': ['required', 'string'],
  'data.name': ['required', 'string'],
  'data.unit': ['string'],
  'data.have_production_number': ['boolean'],
  'data.have_an_expiry_date': ['boolean'],
}
