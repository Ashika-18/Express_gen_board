var express = require('express');
var router = express.Router();

//prisma@client
const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
