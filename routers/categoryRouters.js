const router = require("express").Router()
const{categoryControllers} = require("../controllers")

router.get("/", categoryControllers.getCategory)
module.exports= router