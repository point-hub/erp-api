import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { AllocationEntity } from '../entity'
import { IUpdateAllocationRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    allocation_group_id?: string
    code?: string
    name?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateAllocationRepository: IUpdateAllocationRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateAllocationUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const allocationEntity = new AllocationEntity({
      allocation_group_id: input.data.allocation_group_id,
      code: input.data.code,
      name: input.data.name,
    })
    allocationEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateAllocationRepository.handle(input._id, allocationEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
