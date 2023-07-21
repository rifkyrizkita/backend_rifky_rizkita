const db = require("../models");
const blog = db.Blog;
const user = db.User;
const category = db.Category;
const like = db.Like;
const { Op, Sequelize } = require("sequelize");

module.exports = {
  createBlog: async (req, res) => {
    try {
      const { title, content, link, keywords, country, CategoryId } = req.body;
      const keywordsSplit = keywords.split(",");
      console.log(keywordsSplit);

      const isAccountExist = await user.findOne({
        where: { id: req.user.id },
      });
      const result = await blog.create({
        title,
        author: isAccountExist.username,
        content,
        link,
        keywords,
        country,
        CategoryId: +CategoryId,
        UserId: isAccountExist.id,
        imgBlog: req.file.filename,
      });
      res.status(200).send({ result, msg: "Blog created" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  getAllBlog: async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const search = req.query.search;
      const cat_id = req.query.cat_id;
      const sort = req.query.sort || "ASC";
      const sortLike = req.query.sortLike || "ASC";
      const condition = {};
      if (search) {
        condition[Op.or] = [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            keywords: {
              [Op.like]: `%${search}%`,
            },
          },
        ];
      }
      if (cat_id) condition.CategoryId = cat_id;
      const offset = (page - 1) * limit;
      const total = await blog.count({ where: condition });
      const result = await blog.findAll({
        attributes: [
          "title",
          "author",
          "content",
          "imgBlog",
          "keywords",
          "country",
          "link",
          [
            Sequelize.literal(
              "(SELECT COUNT(*) FROM likes WHERE likes.BlogId = blog.id)"
            ),
            "totalLike",
          ],
          "createdAt",
          "CategoryId",
          "UserId",
        ],
        include: [{ model: category }, { model: user }],
        where: condition,
        order: [["createdAt", sort]],
        limit,
        offset: offset,
      });
      result.forEach((blog) => {
        blog.dataValues.createdAt = new Date(
          blog.dataValues.createdAt
        ).toLocaleDateString();
      });
      res.status(200).send({
        totalpage: Math.ceil(total / limit),
        currentpage: page,
        total_blog: total,
        result,
        status: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  getUserBlog: async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const search = req.query.search;
      const cat_id = req.query.cat_id;
      const sort = req.query.sort || "ASC";

      const condition = {};
      if (search) {
        condition[Op.or] = [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            keywords: {
              [Op.like]: `%${search}%`,
            },
          },
        ];
      }
      if (cat_id) condition.CategoryId = cat_id;
      const offset = (page - 1) * limit;
      const isAccountExist = await user.findOne({
        where: { id: req.user.id },
      });
      console.log(isAccountExist.id);
      const total = await blog.count({
        where: { ...condition, UserId: isAccountExist.id },
      });

      const result = await blog.findAll({
        attributes: [
          "title",
          "author",
          "content",
          "imgBlog",
          "keywords",
          "country",
          "link",
          [
            Sequelize.literal(
              "(SELECT COUNT(*) FROM Likes WHERE Likes.BlogId = Blog.id)"
            ),
            "totalLike",
          ],
          "createdAt",
          "CategoryId",
          "UserId",
        ],
        include: [{ model: category }, { model: user }],
        where: { ...condition, UserId: isAccountExist.id },
        order: [["createdAt", sort]],
        limit,
        offset: offset,
      });
      result.forEach((blog) => {
        blog.dataValues.createdAt = new Date(
          blog.dataValues.createdAt
        ).toLocaleDateString();
      });
      res.status(200).send({
        totalpage: Math.ceil(total / limit),
        currentpage: page,
        total_blog: total,
        result,
        status: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  likeBlog: async (req, res) => {
    try {
      const { BlogId } = req.body;
      const UserId = req.user.id;
      const isAccountExist = await user.findOne({
        where: {
          id: req.user.id,
        },
      });

      if (!isAccountExist.isVerified)
        throw { msg: "Account must be verified to like blog" };
      const result = await like.create({
        UserId,
        BlogId,
        isLiked: true,
      });
      res.status(200).send({
        result,
        msg: "Liked the blog",
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  getLikedBlog: async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const search = req.query.search;
      const cat_id = req.query.cat_id;
      const sort = req.query.sort || "ASC";

      const condition = {};
      if (search) {
        condition[Op.or] = [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            keywords: {
              [Op.like]: `%${search}%`,
            },
          },
        ];
      }
      if (cat_id) condition.CategoryId = cat_id;

      const offset = (page - 1) * limit;
      const isAccountExist = await user.findOne({
        where: { id: req.user.id },
      });
      console.log(isAccountExist.id);

      const total = await blog.count({
        include: [
          {
            model: like,
            where: { UserId: isAccountExist.id },
            attributes: [],
          },
        ],
        where: condition,
      });

      const result = await blog.findAll({
        attributes: [
          "title",
          "author",
          "content",
          "imgBlog",
          "keywords",
          "country",
          "link",
          [
            Sequelize.literal(
              "(SELECT COUNT(*) FROM Likes WHERE Likes.BlogId = Blog.id)"
            ),
            "totalLike",
          ],
          "createdAt",
          "CategoryId",
          "UserId",
        ],
        include: [
          { model: category },
          { model: user },
          {
            model: like,
            where: { UserId: isAccountExist.id },
            attributes: [],
          },
        ],
        where: condition,
        order: [["createdAt", sort]],
        limit,
        offset: offset,
      });

      result.forEach((blog) => {
        blog.dataValues.createdAt = new Date(
          blog.dataValues.createdAt
        ).toLocaleDateString();
      });

      res.status(200).send({
        totalpage: Math.ceil(total / limit),
        currentpage: page,
        total_blog: total,
        result,
        status: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  getBlogbyId: async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const total = await blog.count({ where: { id: req.params.id } });
      const offset = (page - 1) * limit;
      const result = await blog.findAll({
        attributes: [
          "title",
          "author",
          "content",
          "imgBlog",
          "keywords",
          "country",
          "link",
          [
            Sequelize.literal(
              "(SELECT COUNT(*) FROM Likes WHERE Likes.BlogId = Blog.id)"
            ),
            "totalLike",
          ],
          "createdAt",
          "CategoryId",
          "UserId",
        ],
        include: [{ model: category }, { model: user }],
        where: { id: req.params.id },
        limit,
        offset:offset,
      });
      result.forEach((blog) => {
        blog.dataValues.createdAt = new Date(
          blog.dataValues.createdAt
        ).toLocaleDateString();
      });
      res.status(200).send({
        totalpage: Math.ceil(total / limit),
        currentpage: page,
        total_blog: total,
        result,
        status: true,
      });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  },
  deleteBlog : async (req, res) => {
    try {
        const result = await blog.update(
          {isDeleted: true},
            { where : {UserId : req.user.id, id : req.body.BlogId}}
        )
        
        res.status(200).send({
            message : "Delete blog success",
        })
    } catch (error) {
        res.status(400).send(error)
    }
}
};
