const express= require("express");
const userCtrl = require("../controllers/user.controller");
const router = express.Router();

router.post("/",userCtrl.signUp)

router.post("/login", userCtrl.login)

module.exports = router;
