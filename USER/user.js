class UserService {
  constructor() {
    this.users = [];
  }

  register(user_id, password) {
    if (this.users.some(u => u.user_id === user_id)) {
      throw new Error('User exists');
    }
    this.users.push({ user_id, password });
  }

  authenticate(user_id, password) {
    return this.users.find(u => u.user_id === user_id && u.password === password);
  }

  getUserById(user_id) {
    return this.users.find(u => u.user_id === user_id);
  }
}

module.exports = UserService;
