export const updateValidation = {
  _id: ['required', 'string'],
  'data.supplier_group_id': ['required', 'string'],
  'data.code': ['required', 'string'],
  'data.name': ['required', 'string'],
  'data.email': ['email'],
  'data.notes': ['string'],
}
