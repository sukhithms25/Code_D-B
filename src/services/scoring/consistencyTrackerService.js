class ConsistencyTrackerService {
  calculateConsistencyScore(activityLog) {
    if (!activityLog || activityLog.length === 0) return 0;
    
    // Percentage of active days in the last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    const activeDays = new Set(
      activityLog
        .filter(log => new Date(log.date).getTime() > thirtyDaysAgo)
        .map(log => new Date(log.date).toDateString())
    ).size;
    
    const score = (activeDays / 30) * 100;
    return Math.min(Math.round(score), 100);
  }

  getStreakData(userId) {
    // Placeholder fetching logic
    return {
      currentStreak: 0,
      maxStreak: 0
    };
  }
}

module.exports = new ConsistencyTrackerService();
