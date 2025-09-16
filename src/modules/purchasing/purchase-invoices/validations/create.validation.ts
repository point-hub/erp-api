export const createValidation = {
  // 'purchase_order._id': ['required'],
  due_date: ['required'],
  'supplier._id': ['required'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.quantity': ['required', 'numeric'],
  'details.*.price': ['required', 'numeric'],
  notes: ['string'],
}
