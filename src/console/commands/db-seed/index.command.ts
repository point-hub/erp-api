import { BaseConsoleCommand, BaseDatabaseConnection, BaseMongoDBConnection, ICreateManyOutput } from '@point-hub/papi'

import mongoDBConfig from '@/config/mongodb'

export default class DbSeedCommand extends BaseConsoleCommand {
  dbConnection = new BaseDatabaseConnection(new BaseMongoDBConnection(mongoDBConfig.url, mongoDBConfig.name))
  constructor() {
    super({
      name: 'db:seed',
      description: 'Seed database',
      summary: 'Seed database',
      arguments: [],
      options: [],
    })
  }
  async handle(): Promise<void> {
    try {
      await this.dbConnection.open()
      // await this.seed('counters')
      const roles = await this.seed('roles')
      console.log(roles)
    } catch (error) {
      console.error(error)
    } finally {
      this.dbConnection.close()
    }
  }
  private async seed(collectionName: string): Promise<ICreateManyOutput> {
    console.info(`[seed] seeding ${collectionName} data`)
    // get seeder from module
    const { seeds } = await import(`@/modules/${collectionName}/seed`)
    // delete all data inside collection
    await this.dbConnection.collection(collectionName).deleteAll()
    // insert new seeder data
    return await this.dbConnection.collection(collectionName).createMany(seeds)
  }
}
