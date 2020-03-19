const router = require('express').Router();

router.use('/projects', require('./projects'));
router.use('/users', require('./users'));

module.exports = router;