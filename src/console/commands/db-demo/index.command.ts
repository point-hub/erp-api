import { BaseConsoleCommand, BaseDatabaseConnection, BaseMongoDBConnection } from '@point-hub/papi'

import mongoDBConfig from '@/config/mongodb'

export default class DbSeedCommand extends BaseConsoleCommand {
  dbConnection = new BaseDatabaseConnection(new BaseMongoDBConnection(mongoDBConfig.url, mongoDBConfig.name))

  constructor() {
    super({
      name: 'db:demo',
      description: 'Seed demo database',
      summary: 'Seed demo database',
      arguments: [],
      options: [],
    })
  }
  async handle(): Promise<void> {
    let session
    try {
      await this.dbConnection.open()
      session = this.dbConnection.startSession()
      session.startTransaction()
      await this.seeds(['master/roles'], { session })
      await this.seeds(['master/branches'], { session })
      await this.seeds(['master/warehouses'], { session })
      await this.seeds(['master/allocation-groups'], { session })
      await this.seeds(['master/supplier-groups'], { session })
      await this.seeds(['master/customer-groups'], { session })
    } catch (error) {
      console.error(error)
      await session?.abortTransaction()
    } finally {
      await session?.commitTransaction()
      await session?.endSession()
      this.dbConnection.close()
    }
  }
  private async seeds(directories: string[], options: unknown): Promise<void> {
    for (const directory of directories) {
      // import seed function
      const { seed } = await import(`@/modules/${directory}/demo.seed`)
      // seed database
      await seed(this.dbConnection, options)
    }
  }
}
