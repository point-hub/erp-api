export const createValidation = {
  'purchase_request._id': ['required'],
  'supplier._id': ['required'],
  'branch._id': ['required'],
  'details.*.item._id': ['required'],
  'details.*.quantity': ['required', 'integer', 'min:1'],
  'approval_to._id': ['required'],
  notes: ['string'],
}
