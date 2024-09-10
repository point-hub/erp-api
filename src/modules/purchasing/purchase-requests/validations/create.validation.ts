export const createValidation = {
  required_date: ['required'],
  branch: ['required'],
  'items.*.item._id': ['required'],
  'items.*.item.label': ['required'],
  'items.*.item.code': ['required'],
  'items.*.item.name': ['required'],
  'items.*.item.unit': ['required'],
  'items.*.quantity': ['required', 'integer'],
  approval_to: ['required'],
  notes: ['string'],
}
