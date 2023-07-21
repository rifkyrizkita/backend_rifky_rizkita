const jwt = require("jsonwebtoken")

module.exports= {
    verifyToken: (req, res, next) => {
        try {
          let token = req.headers.authorization;
          if (!token) throw { message: "Token is empty" };
          token = token.split(" ")[1];
    
          let verifiedUser = jwt.verify(token, "backend_rrg");
          console.log(verifiedUser);
          req.user = verifiedUser;
    
          next();
        } catch (error) {
          res.status(400).send(error);
        }
      },
}