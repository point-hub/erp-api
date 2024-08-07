import { IRetrieveAllocationGroupOutput, IRetrieveAllocationGroupRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveRepository: IRetrieveAllocationGroupRepository
}
export interface IOptions {
  session: unknown
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOutput extends IRetrieveAllocationGroupOutput {}

export class RetrieveAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    const response = await deps.retrieveRepository.handle(input._id, options)
    return {
      _id: response._id,
      code: response.code,
      name: response.name,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
