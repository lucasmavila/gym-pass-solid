import { Gym } from '@prisma/client'
import { GymsRepository } from '../../repositories/gymsRepository'

interface GetNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface GetNearbyGymsUserCaseResponse {
  gyms: Gym[]
}

export class GetNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: GetNearbyGymsUseCaseRequest): Promise<GetNearbyGymsUserCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
