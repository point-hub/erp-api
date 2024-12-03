export const createValidation = {
  'purchase_order._id': ['required'],
  'supplier._id': ['required'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.quantity': ['required', 'numeric'],
  'details.*.price': ['required', 'numeric'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
