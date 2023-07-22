const { body, validationResult } = require("express-validator");
const fs = require("fs")
module.exports = {
  checkRegister: async (req, res, next) => {
    try {
      await body("username")
        .notEmpty()
        .withMessage("Username must not be empty")
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric")
        .run(req);
      await body("email")
        .notEmpty()
        .withMessage("Email must not be empty")
        .isEmail()
        .withMessage("Invalid email")
        .run(req);
      await body("phone")
        .notEmpty()
        .withMessage("Phone number must not be empty")
        .isMobilePhone()
        .withMessage("Invalid phone number")
        .run(req);
      await body("password")
        .notEmpty()
        .withMessage("Password must not be empty")
        .isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        )
        .run(req);
      await body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password must not be empty")
        .equals(req.body.password)
        .withMessage("Passwords do not match")
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkLogin: async (req, res, next) => {
    try {
      await body("username")
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric")
        .optional({ nullable: true })
        .run(req);
      await body("email")
        .isEmail()
        .withMessage("Invalid email")
        .optional({ nullable: true })
        .run(req);
      await body("phone")
        .isMobilePhone()
        .withMessage("Invalid phone number")
        .optional({ nullable: true })
        .run(req);
      await body("password")
        .notEmpty()
        .withMessage("Password must not be empty")
        .isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        )
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkChangeUsername: async (req, res, next) => {
    try {
      await body("currentUsername")
        .notEmpty()
        .withMessage("Current username must not be empty")
        .isAlphanumeric()
        .withMessage("Current username must be alphanumeric")
        .run(req);
      await body("newUsername")
        .notEmpty()
        .withMessage("New username must not be empty")
        .isAlphanumeric()
        .withMessage("New username must be alphanumeric")
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkChangeEmail: async (req, res, next) => {
    try {
      await body("currentEmail")
        .notEmpty()
        .withMessage("Current email must not be empty")
        .isEmail()
        .withMessage("Invalid current email")
        .run(req);
      await body("newEmail")
        .notEmpty()
        .withMessage("New email must not be empty")
        .isEmail()
        .withMessage("Invalid new email")
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkChangePhone: async (req, res, next) => {
    try {
      await body("currentPhone")
        .notEmpty()
        .withMessage("Current phone number must not be empty")
        .isMobilePhone()
        .withMessage("Invalid current phone number")
        .run(req);
      await body("newPhone")
        .notEmpty()
        .withMessage("New phone number must not be empty")
        .isMobilePhone()
        .withMessage("Invalid new phone number")
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkResetPassword: async (req, res, next) => {
    try {
      await body("password")
        .notEmpty()
        .isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        )
        .run(req);
      await body("confirmPassword")
        .notEmpty()
        .equals(req.body.password)
        .withMessage("Passwords do not match")
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkChangePassword: async (req, res, next) => {
    try {
      await body("currentPassword")
        .notEmpty()
        .isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          "Current password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        )
        .run(req);
      await body("password")
        .notEmpty()
        .isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          "New password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        )
        .run(req);
      await body("confirmPassword")
        .notEmpty()
        .equals(req.body.password)
        .withMessage("Passwords do not match")
        .run(req);
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkCreateBlog: async (req, res, next) => {
    try {
      if (req.file === undefined) {
        res.status(400).send("Image blog must not be empty")
      }
      
      const {filename, destination} = req.file
      await body("title")
        .notEmpty()
        .withMessage("Title must not be empty")
        .run(req);
      await body("content")
        .notEmpty()
        .withMessage("Content must not be empty")
        .run(req);
      await body("keywords")
        .notEmpty()
        .withMessage("Keywords must not be empty")
        .run(req);
      await body("country")
        .notEmpty()
        .withMessage("Country must not be empty")
        .run(req);
      await body("CategoryId")
        .notEmpty()
        .withMessage("Category must not be empty")
        .run(req);

      const validation = validationResult(req);
      if (validation.isEmpty()) {
        next();
      } else {
        fs.unlinkSync(`${destination}/${filename}`)
        return res.status(400).send({
          status: false,
          message: "Invalid validation",
          error: validation.array(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  
};
