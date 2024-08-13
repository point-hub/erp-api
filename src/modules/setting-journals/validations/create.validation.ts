export const createValidation = {
  name: ['required', 'string'],
  'journals.*.chart_of_account_id': ['required', 'string'],
  'journals.*.position': ['required', 'string'],
}
