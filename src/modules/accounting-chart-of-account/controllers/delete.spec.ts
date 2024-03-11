import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import ChartOfAccountFactory from '../factory'

describe('delete an chartOfAccount', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('delete success', async () => {
    const chartOfAccountFactory = new ChartOfAccountFactory(DatabaseTestUtil.dbConnection)
    const resultFactory = await chartOfAccountFactory.createMany(3)

    const response = await request(app).delete(`/v1/chartOfAccounts/${resultFactory.inserted_ids[1]}`)

    // expect http response
    expect(response.statusCode).toEqual(200)

    // expect response json
    expect(response.body).toStrictEqual({ deleted_count: 1 })

    // expect recorded data
    const chartOfAccountRecord = await DatabaseTestUtil.retrieve('chartOfAccounts', resultFactory.inserted_ids[1])
    expect(chartOfAccountRecord).toBeNull()

    const chartOfAccountRecords = await DatabaseTestUtil.retrieveAll('chartOfAccounts')
    expect(chartOfAccountRecords.data.length).toStrictEqual(2)
  })
})
