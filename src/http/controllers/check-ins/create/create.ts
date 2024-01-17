import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCheckInUseCase } from '@/use-cases/check-in/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const creaeteCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const creaeteCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { gymId } = creaeteCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = creaeteCheckInBodySchema.parse(request.body)
  const userId = request.user.sub

  const createGymUseCase = makeCheckInUseCase()

  await createGymUseCase.execute({
    gymId,
    userId,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  reply.status(201).send()
}
