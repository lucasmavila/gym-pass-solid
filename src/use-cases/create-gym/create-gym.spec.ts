import { describe, expect, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '../../repositories/in-memory/in-memory-gyms-repository'
import { Coordinate } from '../../utils/get-distance-between-coordinates'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

const gymCoordinate: Coordinate = {
  latitude: -21.0142653,
  longitude: -42.8518223,
}

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym 1',
      description: 'Gym 1 Description',
      phone: '1111111111',
      ...gymCoordinate,
    })

    expect(gym).toHaveProperty('id')
  })
})
