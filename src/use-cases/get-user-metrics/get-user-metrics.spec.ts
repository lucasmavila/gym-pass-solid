import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../../repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Check-In Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get user check-ins count from metrics', async () => {
    for (let index = 1; index < 3; index++) {
      await checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${index}`,
      })
    }

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })

    expect(checkInsCount).toBe(2)
  })
})
