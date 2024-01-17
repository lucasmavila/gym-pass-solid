import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../../repositories/in-memory/in-memory-check-ins-repository'
import { GetUserCheckInsHistoryUseCase } from './get-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserCheckInsHistoryUseCase

describe('Get User Check-In History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to get check-in history', async () => {
    for (let index = 1; index < 3; index++) {
      await checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${index}`,
      })
    }

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' }),
    ])
  })

  it('should be able to get paginated check-in history', async () => {
    for (let index = 1; index <= 22; index++) {
      await checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${index}`,
      })
    }

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
