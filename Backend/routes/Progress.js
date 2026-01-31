const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  console.log('✅ Test route working!');
  res.json({ 
    success: true, 
    message: 'Progress API is working!', 
    timestamp: new Date().toISOString() 
  });
});

// Simple main route without controller for testing
router.get('/', (req, res) => {
  console.log('✅ Main progress route working!');
  res.json({ 
    success: true,
    message: 'Main progress endpoint working',
    data: []
  });
});

module.exports = router;