import { DatabaseTestUtil } from '@point-hub/papi'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { isValid } from 'date-fns'
import type { Express } from 'express'
import request from 'supertest'

import { createApp } from '@/app'

import ChartOfAccountFactory from '../factory'

describe('update many chartOfAccounts', async () => {
  let app: Express
  beforeAll(async () => {
    app = await createApp({ dbConnection: DatabaseTestUtil.dbConnection })
  })
  beforeEach(async () => {
    await DatabaseTestUtil.reset()
  })
  it('update success', async () => {
    const chartOfAccountFactory = new ChartOfAccountFactory(DatabaseTestUtil.dbConnection)
    const chartOfAccountData = [
      {
        phone: '',
      },
      {
        phone: '',
      },
      {
        phone: '12345678',
      },
    ]
    chartOfAccountFactory.sequence(chartOfAccountData)
    const resultFactory = await chartOfAccountFactory.createMany(3)

    // suspend every chartOfAccount data with name robot
    const response = await request(app)
      .post('/v1/chartOfAccounts/update-many')
      .send({
        filter: {
          phone: '',
        },
        data: {
          phone: '11223344',
        },
      })

    // expect http response
    expect(response.statusCode).toEqual(200)

    // expect response json
    expect(response.body).toStrictEqual({
      matched_count: 2,
      modified_count: 2,
    })

    // expect recorded data
    const chartOfAccountRecord1 = await DatabaseTestUtil.retrieve('chartOfAccounts', resultFactory.inserted_ids[0])
    expect(chartOfAccountRecord1.phone).toStrictEqual('11223344')
    expect(isValid(new Date(chartOfAccountRecord1.updated_date as string))).toBeTruthy()

    const chartOfAccountRecord2 = await DatabaseTestUtil.retrieve('chartOfAccounts', resultFactory.inserted_ids[1])
    expect(chartOfAccountRecord2.phone).toStrictEqual('11223344')
    expect(isValid(new Date(chartOfAccountRecord2.updated_date as string))).toBeTruthy()

    // expect unmodified data
    const chartOfAccountRecord3 = await DatabaseTestUtil.retrieve('chartOfAccounts', resultFactory.inserted_ids[2])
    expect(chartOfAccountRecord3.phone).toStrictEqual('12345678')
    expect(isValid(new Date(chartOfAccountRecord3.updated_date as string))).toBeFalsy()
  })
})
