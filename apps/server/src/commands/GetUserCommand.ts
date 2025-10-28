import type { IUserRepository } from '../repositories/UserRepository'
import type { User } from '../models/User'

export class GetUserCommand {
  constructor(private readonly repo: IUserRepository) {}

  execute(id: string): User | undefined {
    return this.repo.getById(id)
  }
}