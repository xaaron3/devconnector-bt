const express = require('express');
const router = express.Router();

// @route         GET api/profile/test
// @description   tests profile route
// @access        public route
router.get('/test', (req, res) => res.json({ msg: 'profile works!' }));

module.exports = router;