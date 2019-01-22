const express = require('express');
const router = express.Router();


// @route         GET api/posts/test
// @description   tests post route
// @access        public route
router.get('/test', (req, res) => res.json({ msg: 'posts works!' }));

module.exports = router;