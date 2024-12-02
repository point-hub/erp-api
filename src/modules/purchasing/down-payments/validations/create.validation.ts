export const createValidation = {
  'purchase_order._id': ['required'],
  required_date: ['required'],
  'supplier._id': ['required'],
  payment_type: ['required'],
  amount: ['required', 'numeric', 'min:1'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.quantity': ['required', 'numeric'],
  'details.*.price': ['required', 'numeric'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
