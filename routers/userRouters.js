const router = require("express").Router();
const { userControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const {
  checkRegister,
  checkChangePhone,
  checkChangeEmail,
  checkChangeUsername,
  checkChangePassword,
  checkResetPassword,
  checkLogin,
} = require("../middlewares/validator");
const { multerUpload } = require("../middlewares/multer");
router.post("/register", checkRegister, userControllers.register);
router.post("/login",checkLogin, userControllers.login);
router.patch("/verify", verifyToken, userControllers.verifyAccount);
router.get("/keeplogin", verifyToken, userControllers.keepLogin);
router.put("/forgotpassword", userControllers.forgotPassword);
router.patch(
  "/resetpassword",
  verifyToken,
  checkResetPassword,
  userControllers.resetPassword
);
router.patch(
  "/changeusername",
  verifyToken,
  checkChangeUsername,
  userControllers.changeUsername
);
router.patch(
  "/changeemail",
  verifyToken,
  checkChangeEmail,
  userControllers.changeEmail
);
router.patch(
  "/changephone",
  verifyToken,
  checkChangePhone,
  userControllers.changePhone
);
router.patch(
  "/changepassword",
  verifyToken,
  checkChangePassword,
  userControllers.changePassword
);
router.post(
  "/changeimgprofile",
  verifyToken,
  multerUpload().single("file"),
  userControllers.uploadPic
);

module.exports = router;
