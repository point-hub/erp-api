import type { IDatabase } from '@point-hub/papi'

import { throwApiError } from '@/utils/throw-api-error'

import { collectionName } from '../entity'
import { IPurchaseRequestEntity, IReference } from '../interface'

export interface IUpdatePurchaseRequestReference {
  add(entity: IPurchaseRequestEntity, reference: IReference): Promise<void>
  delete(_id: string, ref_name: string, ref_id: string): Promise<void>
}

export class UpdatePurchaseRequestReference implements IUpdatePurchaseRequestReference {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async add(entity: IPurchaseRequestEntity, reference: IReference): Promise<void> {
    await this.database
      .collection(collectionName)
      .update(entity._id as string, { $push: { references: reference } }, this.options)

    let isFinished = true

    for (const entityDetail of entity.details ?? []) {
      const maxQuantity = entityDetail.quantity ?? 0

      const totalExistingQuantity =
        entity.references?.reduce((acc, entityReference) => {
          return (
            acc +
            entityReference.details.reduce(
              (acc, entityReferenceDetail) =>
                entityDetail.uuid === entityReferenceDetail.uuid ? acc + entityReferenceDetail.quantity : acc,
              0,
            )
          )
        }, 0) ?? 0

      const totalNewQuantity = reference.details.reduce(
        (acc, referenceDetail) => (entityDetail.uuid === referenceDetail.uuid ? acc + referenceDetail.quantity : acc),
        0,
      )

      if (totalExistingQuantity + totalNewQuantity < maxQuantity) {
        isFinished = false
        break
      }

      if (totalExistingQuantity + totalNewQuantity > maxQuantity) {
        throwApiError(422, { message: 'Quantity Error' })
        break
      }
    }

    if (isFinished) {
      await this.database
        .collection(collectionName)
        .update(entity._id as string, { $set: { is_finished: true } }, this.options)
    }
  }

  async delete(_id: string, ref_name: string, ref_id: string) {
    await this.database
      .collection(collectionName)
      .update(_id, { $pull: { references: { ref_id: ref_id, ref_name: ref_name } } }, this.options)
    await this.database.collection(collectionName).update(_id, { $set: { is_finished: false } }, this.options)
  }
}
