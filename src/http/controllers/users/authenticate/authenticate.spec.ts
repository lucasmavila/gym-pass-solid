import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const registerBody = {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    }
    await request(app.server).post('/users').send(registerBody)

    const loginBody = {
      email: 'johndoe@mail.com',
      password: '123456',
    }
    const response = await request(app.server).post('/sessions').send(loginBody)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
