import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserCheckInsHistoryUseCase } from '@/use-cases/get-user-check-ins-history/make-get-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInsHistoryQuerySchema.parse(request.query)
  const userId = request.user.sub

  const userCheckInsHistoryUseCase = makeGetUserCheckInsHistoryUseCase()

  const { checkIns } = await userCheckInsHistoryUseCase.execute({
    userId,
    page,
  })

  reply.status(200).send({ checkIns })
}
