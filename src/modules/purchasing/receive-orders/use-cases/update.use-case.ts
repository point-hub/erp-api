import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { IUpdatePurchaseOrderReference } from '../../purchase-orders/utils/update-reference'
import { ReceiveOrderEntity } from '../entity'
import {
  IBranchReference,
  IDetail,
  IPurchaseOrder,
  ISupplier,
  IWarehouseReference,
  TypeApprovalStatus,
} from '../interface'
import { ICreateReceiveOrderRepository } from '../repositories/create.repository'
import { IUpdateReceiveOrderRepository } from '../repositories/update.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  _id: string
  auth: IAuth
  data: {
    required_date: Date
    required_down_payment: boolean
    revised_count: number
    form_number: string
    purchase_order: IPurchaseOrder
    supplier: ISupplier
    branch: IBranchReference
    warehouse: IWarehouseReference
    details: IDetail[]
    notes?: string
    driver?: string
    license_plate?: string
    approval_to: IAuthReference
    approval_status: TypeApprovalStatus
    created_date?: Date
  }
}

export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  createReceiveOrderRepository: ICreateReceiveOrderRepository
  updateReceiveOrderRepository: IUpdateReceiveOrderRepository
  updatePurchaseOrderReference: IUpdatePurchaseOrderReference
}

export interface IOutput {
  inserted_id: string
}
export class UpdateReceiveOrderUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 3. define entity
    const details = input.data.details?.map((el) => ({
      uuid: el.uuid as string,
      quantity: el.quantity as number,
    }))
    input.data.details = input.data.details.map((obj) => {
      return {
        ...obj,
        quantity_pending: obj.quantity,
      }
    })
    const receiveOrderEntity = new ReceiveOrderEntity({
      revised_count: input.data.revised_count,
      form_number: input.data.form_number,
      purchase_order: {
        _id: input.data.purchase_order._id,
        label: input.data.purchase_order.label,
      },
      supplier: {
        _id: input.data.supplier._id,
        label: input.data.supplier.label,
        code: input.data.supplier.code,
        name: input.data.supplier.name,
      },
      required_date: input.data.required_date,
      branch: input.data.branch,
      warehouse: input.data.warehouse,
      driver: input.data.driver,
      license_plate: input.data.license_plate,
      details: input.data.details,
      notes: input.data.notes,
      is_revised: false,
      is_finished: false,
      approval_request_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      approval_request_date: new Date(),
      approval_to: input.data.approval_to,
      approval_status: 'pending',
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      created_date: new Date(),
    })
    receiveOrderEntity.data = deps.objClean(receiveOrderEntity.data)

    // 4. database operation
    const response = await deps.createReceiveOrderRepository.handle(receiveOrderEntity.data)

    const reference = {
      ref_id: response.inserted_id,
      ref_name: 'receive_orders',
      ref_number: 'xx',
      ref_date: receiveOrderEntity.data.created_date as Date,
      details: details ?? [],
    }
    await deps.updatePurchaseOrderReference.delete(input.data.purchase_order._id, 'receive_orders', input._id)
    await deps.updatePurchaseOrderReference.add(input.data.purchase_order, reference)
    await deps.updateReceiveOrderRepository.handle(input._id, {
      is_revised: true,
    })

    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
