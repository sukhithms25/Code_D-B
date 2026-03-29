class SessionService {
  constructor() {
    this.sessions = new Map();
  }

  createSession(userId) {
    const sessionId = `session_${Date.now()}_${userId}`;
    this.sessions.set(userId.toString(), sessionId);
    return sessionId;
  }

  invalidateSession(userId) {
    this.sessions.delete(userId.toString());
    return true;
  }
}

module.exports = new SessionService();
