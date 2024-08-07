import type { ISchemaValidation } from '@point-hub/papi'

import { AllocationGroupEntity } from '../entity'
import { IUpdateAllocationGroupOutput, IUpdateAllocationGroupRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    code?: string
    name?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateRepository: IUpdateAllocationGroupRepository
}
export interface IOptions {
  session?: unknown
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOutput extends IUpdateAllocationGroupOutput {}

export class UpdateAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const allocationGroupEntity = new AllocationGroupEntity({
      code: input.data.code,
      name: input.data.name,
    })
    allocationGroupEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateRepository.handle(input._id, allocationGroupEntity.data, options)
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
