const router = require("express").Router();
const { blogControllers } = require("../controllers");
const { multerUpload } = require("../middlewares/multer");
const { verifyToken } = require("../middlewares/auth");
const { checkCreateBlog } = require("../middlewares/validator");

router.post(
  "/createblog",
  multerUpload().single("file"),
  checkCreateBlog,
  verifyToken,
  blogControllers.createBlog
);
router.get("/getallblog", blogControllers.getAllBlog);
router.get("/getuserblog", verifyToken, blogControllers.getUserBlog);
router.post("/likeblog", verifyToken, blogControllers.likeBlog);
router.get("/getlikedblog", verifyToken, blogControllers.getLikedBlog);
router.get("/:id", blogControllers.getBlogbyId)

module.exports = router;
