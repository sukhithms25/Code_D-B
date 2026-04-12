const { SCORE_WEIGHTS } = require('../../utils/constants');
const { roundToTwo } = require('../../utils/helpers/mathHelpers');

class ScoringAlgorithmService {
  /**
   * Calculates a student's overall score using the weighted formula.
   * Weights are pulled from constants — change once, applies everywhere.
   *
   * Formula: coding(30%) + projects(30%) + problemSolving(20%) + consistency(20%)
   *
   * @param {{ codingActivity: number, projects: number, problemSolving: number, consistency: number }} scores
   * @returns {number} Total score from 0–100
   */
  calculateTotalScore({ codingActivity = 0, projects = 0, problemSolving = 0, consistency = 0 }) {
    const score =
      (codingActivity  * SCORE_WEIGHTS.coding         / 100) +
      (projects        * SCORE_WEIGHTS.projects        / 100) +
      (problemSolving  * SCORE_WEIGHTS.problemSolving  / 100) +
      (consistency     * SCORE_WEIGHTS.consistency     / 100);

    return roundToTwo(score);
  }
}

module.exports = new ScoringAlgorithmService();
