import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user-for-tests'
import { createGymForTest } from '@/utils/tests/create-gym-for-tests'

describe('Nearby Gyms E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const userCoordinates = {
      latitude: -20.7260652,
      longitude: -42.863554,
    }

    const gyms = [
      {
        title: 'Near Gym 1',
        description: null,
        phone: null,
        latitude: -20.7379316,
        longitude: -42.8640506,
      },
      {
        title: 'Near Gym 2',
        description: null,
        phone: null,
        latitude: -20.7257666,
        longitude: -42.8768843,
      },
      {
        title: 'Far Way Gym',
        description: null,
        phone: null,
        latitude: -20.7036456,
        longitude: -42.7461961,
      },
    ]

    for (let index = 0; index < gyms.length; index++) {
      await createGymForTest(gyms[index].title, {
        latitude: gyms[index].latitude,
        longitude: gyms[index].longitude,
      })
    }

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ ...userCoordinates })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(2)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym 1' }),
      expect.objectContaining({ title: 'Near Gym 2' }),
    ])
  })
})
