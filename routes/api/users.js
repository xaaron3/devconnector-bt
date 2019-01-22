const express = require('express');
const router = express.Router();


// @route         GET api/users/test
// @description   tests users route
// @access        public route
router.get('/test', (req, res) => res.json({ msg: 'users works!' }));

module.exports = router;