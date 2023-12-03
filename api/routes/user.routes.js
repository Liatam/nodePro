const express= require("express");
const authCtrl = require("../controllers/auth.controller");
const userCtrl = require("../controllers/user.controller");
const router = express.Router();
const {auth, authAdmin} = require("../middlewares/auth");

// An area that returns the user's information based on the token they send
router.get("/myInfo",auth,userCtrl.myInfo)

// Only an admin user will be able to reach and view the list of all users
router.get("/usersList", authAdmin ,userCtrl.userList)

router.post("/",authCtrl.signUp)

router.post("/login", authCtrl.login)

router.put("/:idEdit",auth,userCtrl.editUser);

router.delete("/:idDel" ,auth, userCtrl.deleteAccount);





module.exports = router;
