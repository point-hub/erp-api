export interface IReference {
  details: IReferenceDetail[]
}

export interface IReferenceDetail {
  uuid: string
  quantity: number
}

export interface IReferenceUpdateObject {
  set: Record<string, number>
  filters: Record<string, string>[]
}

export const getReferenceUpdateObject = (items: IReferenceDetail[], reverse = false): IReferenceUpdateObject => {
  const obj: IReferenceUpdateObject = { set: {}, filters: [] }

  // Loop through the items and create the necessary set and filter
  items.forEach((item, index) => {
    // Generate the dynamic element names like 'elem1', 'elem2', 'elem3'
    const elem = `elem${index + 1}`

    // Create the set and filter for each item
    obj.set[`details.$[${elem}].quantity_pending`] = reverse ? item.quantity * -1 : item.quantity
    obj.filters.push({ [`${elem}.uuid`]: item.uuid })
  })

  return obj
}
