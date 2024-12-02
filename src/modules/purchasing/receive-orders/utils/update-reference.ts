import type { IDatabase } from '@point-hub/papi'

import { throwApiError } from '@/utils/throw-api-error'
import { getReferenceUpdateObject } from '@/utils/transaction'

import { collectionName } from '../entity'
import { IReceiveOrderEntity, IReference } from '../interface'
import { IRetrieveReceiveOrderOutput, RetrieveReceiveOrderRepository } from '../repositories/retrieve.repository'

export interface IUpdateReceiveOrderReference {
  add(entity: IReceiveOrderEntity, reference: IReference): Promise<void>
  delete(_id: string, ref_name: string, ref_id: string): Promise<void>
}

export class UpdateReceiveOrderReference implements IUpdateReceiveOrderReference {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async add(entity: IReceiveOrderEntity, reference: IReference): Promise<void> {
    let isFinished = true

    const retrieveReceiveOrderRepository = new RetrieveReceiveOrderRepository(this.database, this.options)

    const receiveOrder = await retrieveReceiveOrderRepository.handle(entity._id as string)

    for (const entityDetail of receiveOrder.details ?? []) {
      const maxQuantity = Number(entityDetail.quantity ?? 0)

      const totalExistingQuantity =
        receiveOrder.references?.reduce((acc, entityReference) => {
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

    // update add quantity references
    await this.database
      .collection(collectionName)
      .update(entity._id as string, { $push: { references: reference } }, this.options)

    // update -1
    const updateObject = getReferenceUpdateObject(reference.details)

    await this.database
      .collection(collectionName)
      .update(entity._id as string, { $inc: updateObject.set }, { ...this.options, arrayFilters: updateObject.filters })

    // if all quantity is completed set status to true
    if (isFinished) {
      await this.database
        .collection(collectionName)
        .update(entity._id as string, { $set: { is_finished: true } }, this.options)
    }
  }

  async delete(_id: string, ref_name: string, ref_id: string) {
    const receiveOrder = (await this.database
      .collection(collectionName)
      .retrieve(_id, this.options)) as unknown as IRetrieveReceiveOrderOutput

    const reference = receiveOrder.references.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ref: any) => ref.ref_name === ref_name && ref.ref_id === ref_id,
    ) as unknown as IReference

    await this.database
      .collection(collectionName)
      .update(_id, { $pull: { references: { ref_id: ref_id, ref_name: ref_name } } }, this.options)

    const updateObject = getReferenceUpdateObject(reference.details, true)

    await this.database
      .collection(collectionName)
      .update(_id, { $inc: updateObject.set }, { ...this.options, arrayFilters: updateObject.filters })

    await this.database.collection(collectionName).update(_id, { $set: { is_finished: false } }, this.options)
  }
}
