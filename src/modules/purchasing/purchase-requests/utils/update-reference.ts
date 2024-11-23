import type { IDatabase } from '@point-hub/papi'

import { throwApiError } from '@/utils/throw-api-error'

import { collectionName } from '../entity'
import { IPurchaseRequestEntity, IReference } from '../interface'
import { RetrievePurchaseRequestRepository } from '../repositories/retrieve.repository'

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

    const retrievePurchaseRequestRepository = new RetrievePurchaseRequestRepository(this.database, this.options)

    const purchaseRequest = await retrievePurchaseRequestRepository.handle(entity._id as string)

    for (const entityDetail of purchaseRequest.details ?? []) {
      const maxQuantity = Number(entityDetail.quantity ?? 0)

      const totalExistingQuantity =
        purchaseRequest.references?.reduce((acc, entityReference) => {
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
        throwApiError(422, {
          message: `Quantity Error`,
          errors: {
            [`${entityDetail.uuid}`]: `${entityDetail.item?.label} should less than or equal to ${maxQuantity - totalExistingQuantity} ${entityDetail.item?.unit}`,
          },
        })
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
