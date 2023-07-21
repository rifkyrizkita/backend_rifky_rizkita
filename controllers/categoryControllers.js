const db = require("../models");

const category = db.Category;

module.exports= {
    getCategory: async (req,res) => {
        try {
            const result = await category.findAll()
            res.status(200).send({
                status: true,
                result
            })
        } catch (error) {
            res.status(400).send(error)
            console.log(error);
        }
    }
}
