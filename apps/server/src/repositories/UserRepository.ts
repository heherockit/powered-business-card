import type { User } from '../models/User';

export interface IUserRepository {
  getById(id: string): User | undefined;
  list(): User[];
  add(user: User): void;
  remove(id: string): boolean;
}

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [
    { id: '1', name: 'Alice Example', email: 'alice@example.com' },
    { id: '2', name: 'Bob Example', email: 'bob@example.com' },
  ];

  getById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  list() {
    return [...this.users];
  }

  add(user: User) {
    this.users.push(user);
  }

  remove(id: string) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx >= 0) {
      this.users.splice(idx, 1);
      return true;
    }
    return false;
  }
}
