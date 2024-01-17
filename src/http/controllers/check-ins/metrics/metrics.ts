import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/get-user-metrics/make-get-user-metrics-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const userCheckInsHistoryUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await userCheckInsHistoryUseCase.execute({
    userId,
  })

  reply.status(200).send({ checkInsCount })
}
