module.exports = {
  ROLES: ['student', 'hod', 'admin'],

  SCORE_WEIGHTS: {
    coding:         30,
    projects:       30,
    problemSolving: 20,
    consistency:    20,
  },

  PAGINATION: {
    PAGE:  1,
    LIMIT: 10,
  },

  FILES: {
    MAX_SIZE: 5 * 1024 * 1024, // 5 MB in bytes
  },

  ROADMAP_STATUS: {
    PENDING:     'pending',
    IN_PROGRESS: 'in-progress',
    COMPLETED:   'completed',
  },

  NOTIFICATION_TYPES: {
    ALERT:    'alert',
    REMINDER: 'reminder',
    SYSTEM:   'system',
    MESSAGE:  'message',
  },
};
