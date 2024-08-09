import { BaseConsoleCommand, BaseDatabaseConnection, BaseMongoDBConnection } from '@point-hub/papi'

import mongoDBConfig from '@/config/mongodb'
import { CreateChartOfAccountCategoryRepository } from '@/modules/chart-of-account-categories/repositories/create.repository'
import { CreateChartOfAccountTypeRepository } from '@/modules/chart-of-account-types/repositories/create.repository'
import { CreateChartOfAccountRepository } from '@/modules/chart-of-accounts/repositories/create.repository'

export default class DbSeedCommand extends BaseConsoleCommand {
  dbConnection = new BaseDatabaseConnection(new BaseMongoDBConnection(mongoDBConfig.url, mongoDBConfig.name))
  session = this.dbConnection.startSession()
  constructor() {
    super({
      name: 'db:default',
      description: 'Seed default database',
      summary: 'Seed default database',
      arguments: [],
      options: [],
    })
  }
  async handle(): Promise<void> {
    try {
      await this.dbConnection.open()
      this.dbConnection.startSession()
      this.session.startTransaction()
      await this.seedChartOfAccount()
    } catch (error) {
      console.error(error)
      await this.session?.abortTransaction()
    } finally {
      await this.session.commitTransaction()
      await this.session?.endSession()
      this.dbConnection.close()
    }
  }
  private async seedChartOfAccount(): Promise<void> {
    console.info(`[seed] seeding chart of accounts data`)
    // get seeder from module
    const { seeds } = await import(`@/modules/chart-of-accounts/seed`)
    // delete all data inside collection
    await this.dbConnection.collection('chart_of_accounts').deleteAll()
    await this.dbConnection.collection('chart_of_account_categories').deleteAll()
    await this.dbConnection.collection('chart_of_account_types').deleteAll()
    // insert new seeder data
    const createChartOfAccountTypeRepository = new CreateChartOfAccountTypeRepository(this.dbConnection)
    const createChartOfAccountCategoryRepository = new CreateChartOfAccountCategoryRepository(this.dbConnection)
    const createChartOfAccountRepository = new CreateChartOfAccountRepository(this.dbConnection)

    const uniqueTypes = [...new Map(seeds.map((el) => [el.type, el])).values()]
    const types = uniqueTypes.map((el) => el.type)
    for (const type of types) {
      const typeResponse = await createChartOfAccountTypeRepository.handle({ name: type })
      const filteredCategorySeeds = seeds.filter((el) => el.type === type)
      const uniqueCategories = [...new Map(filteredCategorySeeds.map((el) => [el.category, el])).values()]
      const categories = uniqueCategories.map((el) => el.category)
      for (const category of categories) {
        const categoryResponse = await createChartOfAccountCategoryRepository.handle({
          type_id: typeResponse.inserted_id,
          name: category,
        })
        const filteredAccountSeeds = seeds.filter((el) => el.category === category)
        const accounts = filteredAccountSeeds.filter((el) => el.category === category)
        for (const account of accounts) {
          await createChartOfAccountRepository.handle({
            category_id: categoryResponse.inserted_id,
            number: account.number,
            name: account.name,
            subledger: account.subledger ?? '',
            increasing_in: account.increasing_in,
          })
        }
      }
    }
  }
}
