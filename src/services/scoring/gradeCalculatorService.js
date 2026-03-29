class GradeCalculatorService {
  calculateGrade(totalScore) {
    if (totalScore >= 90) return 'A+';
    if (totalScore >= 80) return 'A';
    if (totalScore >= 70) return 'B+';
    if (totalScore >= 60) return 'B';
    if (totalScore >= 50) return 'C';
    return 'F';
  }
}

module.exports = new GradeCalculatorService();
