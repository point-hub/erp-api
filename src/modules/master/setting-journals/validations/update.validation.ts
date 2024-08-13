export const updateValidation = {
  _id: ['required', 'string'],
  'data.name': ['required', 'string'],
  'data.journals.*.chart_of_account_id': ['required', 'string'],
  'data.journals.*.position': ['required', 'string'],
}
