export const createValidation = {
  category_id: ['required', 'string'],
  chart_of_account_id: ['required', 'string'],
  code: ['required', 'string'],
  name: ['required', 'string'],
  unit: ['required', 'string'],
  have_production_number: ['boolean'],
  have_an_expiry_date: ['boolean'],
}
