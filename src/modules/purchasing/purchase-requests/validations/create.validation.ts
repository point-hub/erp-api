export const createValidation = {
  required_date: ['required'],
  'branch._id': ['required'],
  'items.*.item._id': ['required'],
  'items.*.notes': ['required'],
  'items.*.quantity': ['required', 'integer', 'min:1'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
