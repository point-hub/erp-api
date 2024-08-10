import { BaseConsoleCommand, BaseDatabaseConnection, BaseMongoDBConnection } from '@point-hub/papi'

import mongoDBConfig from '@/config/mongodb'

export default class DbSeedCommand extends BaseConsoleCommand {
  dbConnection = new BaseDatabaseConnection(new BaseMongoDBConnection(mongoDBConfig.url, mongoDBConfig.name))
  constructor() {
    super({
      name: 'db:seed',
      description: 'Seed database',
      summary: 'Seed database',
      arguments: [
        {
          name: 'module',
          description: 'Directory name of your module',
        },
        {
          name: 'collection',
          description: 'Collection name of your module',
        },
      ],
      options: [
        {
          type: 'string',
          flag: '--filename',
          description: 'Filename',
        },
      ],
    })
  }
  async handle(): Promise<void> {
    try {
      await this.dbConnection.open()
      const fileName = (this.opts['--filename'] as string) ?? 'seed'
      await this.seed(this.args['module'], this.args['collection'], fileName)
    } catch (error) {
      console.error(error)
    } finally {
      this.dbConnection.close()
    }
  }

  private async seed(directoryName: string, collectionName: string, fileName: string): Promise<void> {
    console.info(`[seed] seeding ${collectionName} data`)
    // get seeder from module
    const { seeds } = await import(`@/modules/${directoryName}/${fileName}`)
    // delete all data inside collection
    await this.dbConnection.collection(collectionName).deleteAll()
    // insert new seeder data
    await this.dbConnection.collection(collectionName).createMany(seeds)
  }
}
