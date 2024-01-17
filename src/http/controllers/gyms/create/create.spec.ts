import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user-for-tests'
import { Coordinate } from '@/utils/get-distance-between-coordinates'

describe('Create Gym E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const gymCoordinate: Coordinate = {
      latitude: -21.0142653,
      longitude: -42.8518223,
    }

    const gym = {
      title: 'Gym 1',
      description: 'Gym 1 Description',
      phone: '1111111111',
      ...gymCoordinate,
    }

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    expect(response.statusCode).toEqual(201)
  })
})
