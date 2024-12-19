export const createValidation = {
  'purchase_order._id': ['required'],
  required_date: ['required'],
  'supplier._id': ['required'],
  'branch._id': ['required'],
  'warehouse._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.quantity': ['required', 'numeric'],
  notes: ['string'],
}
