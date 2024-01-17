import { describe, expect, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { UsersRepository } from '../../repositories/usersRepository'

let usersRepository: UsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    })

    expect(user).toHaveProperty('id')
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const user = {
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    }

    await sut.execute(user)

    await expect(() => sut.execute(user)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
