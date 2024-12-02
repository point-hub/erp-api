export const updateValidation = {
  'purchase_order._id': ['required'],
  required_date: ['required'],
  'supplier._id': ['required'],
  'branch._id': ['required'],
  'warehouse._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.quantity': ['required', 'numeric'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
