import { Gym } from '@prisma/client'
import { GymsRepository } from '../../repositories/gymsRepository'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUserCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUserCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
