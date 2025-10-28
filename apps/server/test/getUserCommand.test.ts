import { strict as assert } from 'assert';
import { InMemoryUserRepository } from '../src/repositories/UserRepository';
import { GetUserCommand } from '../src/commands/user/GetUserCommand';

describe('GetUserCommand', () => {
  it('returns a user when it exists', () => {
    const repo = new InMemoryUserRepository();
    const cmd = new GetUserCommand(repo);
    const user = cmd.execute('1');
    assert.ok(user);
  });

  it('returns undefined for missing users', () => {
    const repo = new InMemoryUserRepository();
    const cmd = new GetUserCommand(repo);
    const user = cmd.execute('missing');
    assert.equal(user, undefined);
  });
});
