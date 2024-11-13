export const createValidation = {
  required_date: ['required'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.notes': ['required'],
  'details.*.quantity': ['required', 'integer', 'min:1'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
