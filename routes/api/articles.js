const express = require("express");
const router = express.Router();
const {
  getArticles,
  getOneArticle,
  addArticle,
  editArticle,
  deleteArticle,
  getArticlesByCategory,
  getArticlesBySearch,
} = require("../../controllers/articleController");

router.route("/articles").get(getArticles).post(addArticle);

router.route("/article/:id").get(getOneArticle).delete(deleteArticle).put(editArticle);

router.route("/articles/category/:catname").get(getArticlesByCategory);

router.route("/search/articles/:searchword").get(getArticlesBySearch);

module.exports = router;
