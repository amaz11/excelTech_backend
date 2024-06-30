const { register, login, allUsers } = require("../controller/auth.controller");
const asyncHandler = require("../middleware/asynchandler");
const authVerify = require('../middleware/authverify');
const router = require("express").Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/users', authVerify, asyncHandler(allUsers));


module.exports = router;