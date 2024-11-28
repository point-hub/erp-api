export const updateValidation = {
  required_date: ['required'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.notes': ['required'],
  'details.*.quantity': ['required', 'numeric', 'min:1'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
