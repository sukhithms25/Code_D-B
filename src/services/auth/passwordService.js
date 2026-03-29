const bcrypt = require('bcryptjs');

class PasswordService {
  async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = new PasswordService();
