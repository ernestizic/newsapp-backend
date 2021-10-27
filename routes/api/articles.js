const express = require("express");
const router = express.Router();
const Article = require("../../models/articleModel");
const upload = require("../../middleware/upload");
const auth = require("../../middleware/auth");


// ACCESS: PUBLIC
// @desc Get all articles
// @request GET
// @route /api/v1/articles
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles: articles,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// ACCESS: PUBLIC
// @desc Get one article
// @request GET
// @route /api/v1/article/id
router.get("/article/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    return res.status(200).json({
      success: true,
      article: article,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      error: "Not Found",
    });
  }
});

// ACCESS: PUBLIC
// @desc Get articles by category
// @request GET
// @route /api/v1/articles/category/:catname

router.get("/articles/category/:catname", async (req, res) => {
  try {
    const articles = await Article.find({ category: req.params.catname });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles: articles,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: "Not Found!!!",
    });
  }
});

// ACCESS: PUBLIC
// @desc Get articles by Search
// @request GET
// @route /api/v1/search/articles/:searchword
router.get("/search/articles/:searchword", async (req, res) => {
  try {
    const articles = await Article.find({
      $text: { $search: req.params.searchword },
    });
    if (articles.length >= 1) {
      return res.status(200).json({
        success: true,
        count: articles.length,
        articles: articles,
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "No result found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// ACCESS: PRIVATE
// @desc Add an article
// @request POST
// @route /api/v1/articles
router.post("/articles", auth, (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        res.status(400).json({
          msg: err,
        });
      } else {
        //check if the file field is left empty before submitting
        if (req.file === undefined) {
          return res.status(400).json({
            success: false,
            msg: "Error: No file selected!",
          });
        } else {
          const newArticle = {
            title: req.body.title,
            body: req.body.body,
            category: req.body.category,
            image: req.file.path,
          };
          Article.create(newArticle).then((article) => {
            res.status(201).json({
              success: true,
              data: article,
            });
          });
        }
      }
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
});

// ACCESS: PRIVATE
// @desc edit an article
// @request PUT
// @route /api/v1/article/id
router.put("/article/:id", auth, async(req, res) => {
  const found = await Article.findById(req.params.id);
  try {
    if (!found) {
      return res.status(404).json({
        success: false,
        error: "No Article found!",
      });
    } 
    const updatedArticle = {
      title: req.body.title,
      body: req.body.body,
      category: req.body.category,
      // image: req.file.path ? req.file.path : found.image,
    };
    await Article.updateOne(found, { $set: updatedArticle });
    return res.status(201).json({
      success: true,
      msg: "Article updated!",
      data: found,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});


// ACCESS: PRIVATE
// @desc Delete an article
// @request DELETE
// @route /api/v1/article/:id
router.delete("/article/:id", auth, async(req, res) => {
  try {
    const found = await Article.findById(req.params.id);

    if (!found) {
      return res.status(404).json({
        success: false,
        error: "Can't delete something that doesn't exist!",
      });
    } else {
      await Article.deleteOne(found);
      return res.status(200).json({
        success: true,
        msg: "Article deleted!",
        data: found,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
