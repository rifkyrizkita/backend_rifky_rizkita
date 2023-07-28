const db = require("../models");
const user = db.User;
const token_ = db.Token;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const transporter = require("../middlewares/transporter");
const fs = require("fs");
const handlebars = require("handlebars");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const result = await user.create({
        username,
        email,
        phone,
        password: hashPassword,
      });
      const payload = { id: result.id };
      const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1h" });
      const data = await fs.readFileSync("./template.html", "utf-8");
      const tempCompile = await handlebars.compile(data);
      const tempResult = tempCompile({ username, token });
      await transporter.sendMail({
        from: process.env.EMAIL_TRANSPORTER,
        to: email,
        subject: "Verify account",
        html: tempResult,
      });
      // await token_.create({
      // token,
      //UserId: result.id
      //})
      res.status(200).send({
        status: true,
        message: "Register success",
        result,
        token,
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  verifyAccount: async (req, res) => {
    try {
      const isAccountExist = await user.findOne({
        where: {
          id: req.user.id,
        },
      });
      const isTokenExist = await token_.findOne({
        where: {
          UserId: req.user.id,
        },
      });
      console.log(req.headers.authorization);
      tokenVerify = req.headers.authorization.split(" ")[1];

      if (isAccountExist.isVerified) throw { msg: "Account already verified" };
      if (isTokenExist == null) {
        await token_.create({ token: tokenVerify, UserId: req.user.id });
      } else if (tokenVerify == isTokenExist.token) {
        throw { msg: "Token is expired" };
      }

      //if (tokenVerify == isTokenExist.token) throw { msg: "Token is expired" };
      const result = await user.update(
        {
          isVerified: true,
        },
        {
          where: {
            id: isAccountExist.id,
          },
        }
      );
      res.status(200).send({
        message: "Verify success",
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  login: async (req, res) => {
    try {
      const username = req.body.username || "";
      const email = req.body.email || "";
      const phone = req.body.phone || "";
      const password = req.body.password;
      const result = await user.findOne({
        where: {
          [Op.or]: [{ username }, { email }, { phone }],
        },
      });
      if (result === null) throw { message: "Account not found" };
      if (!result.isVerified) throw { message: "Account is not verified" };
      const isValid = await bcrypt.compare(password, result.password);
      if (!isValid) throw { message: "Wrong password" };
      const payload = { id: result.id };
      const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1d" });
      res.status(200).send({
        status: true,
        message: "Login success",
        token,
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  keepLogin: async (req, res) => {
    try {
      const result = await user.findOne({
        where: {
          id: req.user.id,
        },
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const result = await user.findOne({
        where: { email: email },
      });

      if (result == null) throw { msg: "Account not found" };
      const username = result.username;
      const payload = { id: result.id };
      const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1h" });
      const data = await fs.readFileSync("./templateforgotpass.html", "utf-8");
      const tempCompile = await handlebars.compile(data);
      const tempResult = tempCompile({ username, token });
      await transporter.sendMail({
        from: process.env.EMAIL_TRANSPORTER,
        to: email,
        subject: "Reset your password",
        html: tempResult,
      });
      res.status(200).send({ message: "Check your email", token });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password, confirmPassword } = req.body;
      console.log(req.user.id);
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const result = await user.update(
        { password: hashPassword },
        { where: { id: req.user.id } }
      );
      if (result[0] == 0) throw { message: "Password failed to changed" };
      res.status(200).send({ result, message: "Password has been changed" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  changeUsername: async (req, res) => {
    try {
      const { currentUsername, newUsername } = req.body;
      const isAccountExist = await user.findOne({
        where: { id: req.user.id },
      });
      const email = isAccountExist.email;
      console.log(isAccountExist.username);
      if (!isAccountExist.isVerified) throw { msg: "Account not verified" };
      if (currentUsername !== isAccountExist.username)
        throw { message: "Username not found" };
      const result = await user.update(
        { username: newUsername },
        { where: { id: req.user.id } }
      );
      const data = await fs.readFileSync(
        "./templatechangeusername.html",
        "utf-8"
      );
      const tempCompile = await handlebars.compile(data);
      const tempResult = tempCompile({ username: newUsername });
      await transporter.sendMail({
        from: process.env.EMAIL_TRANSPORTER,
        to: email,
        subject: "New username",
        html: tempResult,
      });
      res.status(200).send({ result, message: "Username has been changed" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  changeEmail: async (req, res) => {
    try {
      const { currentEmail, newEmail } = req.body;
      const isAccountExist = await user.findOne({
        where: { id: req.user.id },
      });
      if (!isAccountExist.isVerified) throw { msg: "Account not verified" };
      if (currentEmail !== isAccountExist.email)
        throw { message: "Email not found" };
      const result = await user.update(
        { email: newEmail, isVerified: false },

        { where: { id: req.user.id } }
      );
      const payload = { id: isAccountExist.id };
      const token = jwt.sign(payload, "backend_rrg", { expiresIn: "1h" });
      const data = await fs.readFileSync("./templatechangeemail.html", "utf-8");
      const tempCompile = await handlebars.compile(data);
      const tempResult = tempCompile({ currentEmail, newEmail, token });
      await transporter.sendMail({
        from: process.env.EMAIL_TRANSPORTER,
        to: currentEmail,
        subject: "New email verification",
        html: tempResult,
      });
      res
        .status(200)
        .send({ result, message: "Check your email to verify", token });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  changePhone: async (req, res) => {
    try {
      const { currentPhone, newPhone } = req.body;
      const isAccountExist = await user.findOne({
        where: { id: req.user.id },
      });
      if (!isAccountExist.isVerified) throw { msg: "Account not verified" };
      if (currentPhone !== isAccountExist.phone)
        throw { message: "Phone number not found" };
      const result = await user.update(
        { phone: newPhone },
        { where: { id: req.user.id } }
      );
      const email = isAccountExist.email;

      const data = await fs.readFileSync("./templatechangephone.html", "utf-8");
      const tempCompile = await handlebars.compile(data);
      const tempResult = tempCompile({ phone: newPhone });
      await transporter.sendMail({
        from: process.env.EMAIL_TRANSPORTER,
        to: email,
        subject: "New phone number",
        html: tempResult,
      });
      res
        .status(200)
        .send({ result, message: "Phone number has been changed" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const { currentPassword, password, confirmPassword } = req.body;
      const isAccountExist = await user.findOne({
        where: { id: req.user.id },
      });
      const isValid = await bcrypt.compare(
        currentPassword,
        isAccountExist.password
      );
      if (!isValid) throw { message: "Wrong password" };
      if (password !== confirmPassword)
        throw { message: "Password and Confirm Password must be same" };
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const result = await user.update(
        { password: hashPassword },
        { where: { id: req.user.id } }
      );
      res.status(200).send({ result, message: "Password has been changed" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  uploadPic: async (req, res) => {
    try {
      if (req.file == undefined) {
        throw { message: "Image should not be empty" };
      }
      const result = await user.update(
        {
          imgProfile: req.file.filename,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
      res.status(200).send({ result, message: "Upload success" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
};
