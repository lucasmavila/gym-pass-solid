import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../../repositories/in-memory/in-memory-gyms-repository'
import { GetNearbyGymsUseCase } from './get-nearby-gyms'
import { FindManyNearbyParams } from '../../repositories/gymsRepository'

let gymsRepository: InMemoryGymsRepository
let sut: GetNearbyGymsUseCase

describe('Seach Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GetNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to get nearby gyms', async () => {
    const userCoordinates: FindManyNearbyParams = {
      latitude: -20.7260652,
      longitude: -42.863554,
    }

    await gymsRepository.create({
      title: 'Near Gym 1',
      description: null,
      phone: null,
      latitude: -20.7379316,
      longitude: -42.8640506,
    })

    await gymsRepository.create({
      title: 'Near Gym 2',
      description: null,
      phone: null,
      latitude: -20.7257666,
      longitude: -42.8768843,
    })

    await gymsRepository.create({
      title: 'Far Way Gym',
      description: null,
      phone: null,
      latitude: -20.7036456,
      longitude: -42.7461961,
    })

    const { gyms } = await sut.execute({
      userLatitude: userCoordinates.latitude,
      userLongitude: userCoordinates.longitude,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym 1' }),
      expect.objectContaining({ title: 'Near Gym 2' }),
    ])
  })
})
