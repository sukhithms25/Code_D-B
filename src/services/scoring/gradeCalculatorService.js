const { GRADE } = require('../../utils/enums');

class GradeCalculatorService {
  /**
   * Converts a numeric total score (0–100) to a letter grade.
   * Grade thresholds use the GRADE enum — no magic strings.
   *
   * @param {number} totalScore
   * @returns {string} Grade letter from GRADE enum
   */
  calculateGrade(totalScore) {
    if (totalScore >= 90) return GRADE.A_PLUS;
    if (totalScore >= 80) return GRADE.A;
    if (totalScore >= 70) return GRADE.B_PLUS;
    if (totalScore >= 60) return GRADE.B;
    if (totalScore >= 50) return GRADE.C;
    return GRADE.F;
  }
}

module.exports = new GradeCalculatorService();
