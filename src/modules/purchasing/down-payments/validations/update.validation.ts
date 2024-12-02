export const updateValidation = {
  'purchase_order._id': ['required'],
  required_date: ['required'],
  'supplier._id': ['required'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.notes': ['required'],
  'details.*.quantity': ['required', 'numeric'],
  'details.*.price': ['required', 'numeric'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
