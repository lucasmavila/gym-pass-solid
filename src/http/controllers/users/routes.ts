import { FastifyInstance } from 'fastify'
import { register } from './register/register'
import { authenticate } from './authenticate/authenticate'
import { profile } from './profile/profile'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { refresh } from './refresh/refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)
  /* Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
