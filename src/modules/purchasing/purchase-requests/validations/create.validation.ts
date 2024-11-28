export const createValidation = {
  required_date: ['required'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.quantity': ['required', 'numeric', 'min:1'],
  'details.*.notes': ['required'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
