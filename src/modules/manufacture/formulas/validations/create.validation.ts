export const createValidation = {
  name: ['required', 'string'],
  process: ['required'],
  raw_materials: ['required'],
  'raw_materials.*.item._id': ['required'],
  'raw_materials.*.quantity': ['required', 'min:1'],
  finished_goods: ['required'],
  'finished_goods.*.item._id': ['required'],
  'finished_goods.*.quantity': ['required', 'min:1'],
  approval_to: ['required'],
  notes: ['string'],
}
