import { strict as assert } from 'assert'
import { InMemoryUserRepository } from '../src/repositories/UserRepository'

describe('InMemoryUserRepository', () => {
  it('lists default users', () => {
    const repo = new InMemoryUserRepository()
    const users = repo.list()
    assert.ok(users.length >= 2)
  })

  it('adds and removes a user', () => {
    const repo = new InMemoryUserRepository()
    const id = '99'
    repo.add({ id, name: 'Test User', email: 'test@example.com' })
    assert.equal(repo.getById(id)?.name, 'Test User')
    assert.equal(repo.remove(id), true)
    assert.equal(repo.getById(id), undefined)
  })
})