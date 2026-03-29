const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Code DB API is running perfectly!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
