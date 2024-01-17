import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../checkInsRepository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = []

  async create({
    gym_id,
    user_id,
    validated_at,
  }: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      gym_id,
      user_id,
      validated_at: validated_at ? new Date(validated_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnTheSameDate = this.checkIns.find((item) => {
      const checkInDate = dayjs(item.created_at)

      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return isOnSameDate && item.user_id === userId
    })

    if (!checkInOnTheSameDate) {
      return null
    }
    return checkInOnTheSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    const start = (page - 1) * 20
    const end = page * 20
    return this.checkIns
      .filter((item) => item.user_id === userId)
      .slice(start, end)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((item) => item.user_id === userId).length
  }

  async findById(checkInId: string) {
    const checkIn = this.checkIns.find((item) => item.id === checkInId)

    if (!checkIn) return null

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn
    }

    return checkIn
  }
}
