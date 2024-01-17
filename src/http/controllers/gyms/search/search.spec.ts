import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user-for-tests'
import { createGymForTest } from '@/utils/tests/create-gym-for-tests'

describe('Search Gym E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    for (let index = 1; index <= 3; index++) {
      await createGymForTest(`Gym ${index}`)
    }

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ query: 'Gym 2', page: 1 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Gym 2' }),
    ])
  })
})
