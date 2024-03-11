import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

describe('chartOfAccount use transaction', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('transaction aborted when create failed', async () => {
    const data = {
      new: {
        name: 'John',
      },
      create: {
        name: 'John',
      },
    }

    await request(app).post('/v1/chartOfAccounts/transaction').send(data)

    // expect recorded data
    const chartOfAccountRecords = await DatabaseTestUtil.retrieveAll('chartOfAccounts')
    expect(chartOfAccountRecords.data.length).toStrictEqual(0)
  })
  it('transaction aborted when create many failed', async () => {
    const data = {
      new: {
        name: 'John',
      },
      create: {
        name: 'John 2',
      },
      createMany: {
        chartOfAccounts: [
          {
            name: 'John 2',
          },
        ],
      },
    }

    await request(app).post('/v1/chartOfAccounts/transaction').send(data)

    // expect recorded data
    const chartOfAccountRecords = await DatabaseTestUtil.retrieveAll('chartOfAccounts')
    expect(chartOfAccountRecords.data.length).toStrictEqual(2)
  })
  it('transaction aborted when update failed', async () => {
    const data = {
      new: {
        name: 'John',
      },
      create: {
        name: 'John 2',
      },
      createMany: {
        chartOfAccounts: [
          {
            name: 'John 3',
          },
        ],
      },
      update: {
        name: 'John 3',
      },
    }

    await request(app).post('/v1/chartOfAccounts/transaction').send(data)

    // expect recorded data
    const chartOfAccountRecords = await DatabaseTestUtil.retrieveAll('chartOfAccounts')
    expect(chartOfAccountRecords.data.length).toStrictEqual(3)
  })
  it('transaction aborted when update many failed', async () => {
    const data = {
      new: {
        name: 'John',
      },
      create: {
        name: 'John 2',
      },
      createMany: {
        chartOfAccounts: [
          {
            name: 'John 3',
          },
          {
            name: 'John 4',
          },
        ],
      },
      update: {
        name: 'John 5',
      },
      updateMany: {
        filter: {
          name: 'John 5',
        },
        data: {
          name: 'John 2',
        },
      },
    }

    await request(app).post('/v1/chartOfAccounts/transaction').send(data)

    // expect recorded data
    const chartOfAccountRecords = await DatabaseTestUtil.retrieveAll('chartOfAccounts')
    expect(chartOfAccountRecords.data.length).toStrictEqual(4)
    expect(chartOfAccountRecords.data[0].name).toStrictEqual('John 5')
  })
  it('transaction aborted when delete failed', async () => {
    const data = {
      new: {
        name: 'John',
      },
      create: {
        name: 'John 2',
      },
      createMany: {
        chartOfAccounts: [
          {
            name: 'John 3',
          },
          {
            name: 'John 4',
          },
        ],
      },
      update: {
        name: 'John 5',
      },
      updateMany: {
        filter: {
          name: 'John 5',
        },
        data: {
          name: 'John',
        },
      },
      delete: false,
    }

    await request(app).post('/v1/chartOfAccounts/transaction').send(data)

    // expect recorded data
    const chartOfAccountRecords = await DatabaseTestUtil.retrieveAll('chartOfAccounts')
    expect(chartOfAccountRecords.data.length).toStrictEqual(4)
  })
  it('transaction aborted when delete many failed', async () => {
    const data = {
      new: {
        name: 'John',
      },
      create: {
        name: 'John 2',
      },
      createMany: {
        chartOfAccounts: [
          {
            name: 'John 3',
          },
          {
            name: 'John 4',
          },
        ],
      },
      update: {
        name: 'John 5',
      },
      updateMany: {
        filter: {
          name: 'John 5',
        },
        data: {
          name: 'John',
        },
      },
      delete: true,
      deleteMany: false,
    }

    await request(app).post('/v1/chartOfAccounts/transaction').send(data)

    // expect recorded data
    const chartOfAccountRecords = await DatabaseTestUtil.retrieveAll('chartOfAccounts')
    expect(chartOfAccountRecords.data.length).toStrictEqual(3)
  })
})
