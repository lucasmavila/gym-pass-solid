import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetNearbyGymsUseCase } from '../../../../use-cases/get-nearby-gyms/make-get-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQueryBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQueryBodySchema.parse(request.query)

  const nearbyUseCase = makeGetNearbyGymsUseCase()

  const { gyms } = await nearbyUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  reply.status(200).send({ gyms })
}
