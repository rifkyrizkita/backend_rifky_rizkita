const express = require("express")
const PORT = 8000
const db = require("./models")
require("dotenv").config()
const server = express()
server.use(express.json())
server.use(express.static("./public"))
server.get("/", (req, res) => {
    res.status(200).send("This my API");
  });
 const {userRouters,blogRouters, categoryRouters} = require("./routers")
 
 server.use("/user", userRouters)
 server.use("/blog", blogRouters)
 server.use("/category", categoryRouters)
  server.listen(PORT, () => {
  //db.sequelize.sync({alter:true})
  console.log(`Server running at port : ${PORT}`);
});
