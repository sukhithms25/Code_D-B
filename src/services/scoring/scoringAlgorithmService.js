class ScoringAlgorithmService {
  calculateTotalScore({ codingActivity = 0, projects = 0, problemSolving = 0, consistency = 0 }) {
    // Weightings: 30-30-20-20
    const score = (codingActivity * 0.30) + (projects * 0.30) + (problemSolving * 0.20) + (consistency * 0.20);
    return Math.round(score * 100) / 100;
  }
}

module.exports = new ScoringAlgorithmService();
