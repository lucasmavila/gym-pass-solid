import { prisma } from '@/lib/prisma'

export async function createGymForTest(
  title = 'Gym 1',
  newGymCoordinates = {
    latitude: -21.0142653,
    longitude: -42.8518223,
  },
) {
  const newGym = {
    title,
    description: null,
    phone: null,
    ...newGymCoordinates,
  }
  const gym = await prisma.gym.create({
    data: newGym,
  })
  return gym
}
