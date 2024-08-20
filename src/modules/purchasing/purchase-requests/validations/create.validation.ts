export const createValidation = {
  branch: ['required'],
  required_date: ['required'],
  'items.*.item': ['required'],
  'items.*.quantity': ['required', 'integer'],
  approval_to: ['required'],
  notes: ['string'],
}
