import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '../../repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../../repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { Coordinate } from '../../utils/get-distance-between-coordinates'
import { MaxDistanceError } from '../errors/max-distance-error'
import { MaxNumberOfCheckIns } from '../errors/max-number-of-check-ins'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const userCordinate: Coordinate = {
  latitude: -21.0142653,
  longitude: -42.8518223,
}

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    const gym = {
      id: 'gym01',
      title: 'Gym 01',
      description: 'Gym 01',
      phone: '',
      latitude: new Decimal(userCordinate.latitude),
      longitude: new Decimal(userCordinate.longitude),
    }

    await gymsRepository.create(gym)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym01',
      userId: 'user01',
      userLatitude: userCordinate.latitude,
      userLongitude: userCordinate.longitude,
    })

    expect(checkIn).toHaveProperty('id')
  })

  it('should not be able to check in twice in the same day', async () => {
    const gymId = 'gym01'
    const userId = 'user01'
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0))

    await sut.execute({
      gymId,
      userId,
      userLatitude: userCordinate.latitude,
      userLongitude: userCordinate.longitude,
    })

    await expect(() =>
      sut.execute({
        gymId,
        userId,
        userLatitude: userCordinate.latitude,
        userLongitude: userCordinate.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckIns)
  })

  it('should be able to check in twice but in different days', async () => {
    const gymId = 'gym01'
    const userId = 'user01'
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0))

    await sut.execute({
      gymId,
      userId,
      userLatitude: userCordinate.latitude,
      userLongitude: userCordinate.longitude,
    })

    vi.setSystemTime(new Date(2024, 0, 2, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId,
      userId,
      userLatitude: userCordinate.latitude,
      userLongitude: userCordinate.longitude,
    })

    expect(checkIn).toHaveProperty('id')
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym02',
      title: 'Gym 02',
      description: 'Gym 02',
      latitude: new Decimal(-21.004202),
      longitude: new Decimal(-42.8479767),
      phone: '',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym02',
        userId: 'user01',
        userLatitude: -21.001823,
        userLongitude: -42.860003,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
