export const createValidation = {
  'purchase_request._id': ['required'],
  required_date: ['required'],
  'supplier._id': ['required'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.quantity': ['required', 'integer'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
