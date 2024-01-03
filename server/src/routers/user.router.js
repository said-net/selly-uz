const authConfig = require("../configs/auth.config");
const userController = require("../controllers/user.controller");

module.exports = require("express")
  .Router()
  .post("/register", userController.register)
  .post("/activate", authConfig.user, userController.activate)
  .post("/resend-sms", authConfig.user, userController.resendSms)
  .post("/recovery-pass", userController.recoveryPass)
  .post('/auth', userController.auth)
  .get('/verify-session', authConfig.user, userController.verifySession)
  .put('/edit-name', authConfig.user, userController.editName)
  .get('/get-main-menu', userController.getMianMenu)