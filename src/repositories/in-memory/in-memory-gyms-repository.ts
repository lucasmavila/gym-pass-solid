import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gymsRepository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '../../utils/get-distance-between-coordinates'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(gymId: string) {
    const gym = this.gyms.find((item) => item.id === gymId)
    if (!gym) return null
    return gym
  }

  async create({
    id,
    title,
    description,
    phone,
    latitude,
    longitude,
  }: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: id ?? randomUUID(),
      title,
      description: description ?? null,
      phone: phone ?? null,
      latitude: new Decimal(latitude.toString()),
      longitude: new Decimal(longitude.toString()),
    }

    this.gyms.push(gym)

    return gym
  }

  async searchMany(query: string, page: number) {
    const init = (page - 1) * 20
    const end = page * 20
    return this.gyms
      .filter((item) => item.title.includes(query))
      .slice(init, end)
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return this.gyms.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
        { latitude, longitude },
      )

      const MAX_DISTANCE_IN_KILOMETERS = 10
      return distance < MAX_DISTANCE_IN_KILOMETERS
    })
  }
}
