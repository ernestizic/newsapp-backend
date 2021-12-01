const express = require("express");
const router = express.Router();
const Article = require("../../models/articleModel");
const Comment = require("../../models/commentModel");
const auth = require("../../middleware/auth");

// ACCESS: PRIVATE
// @desc Post a comment
// @request POST
// @route /api/article/id
router.post("/article/:id", auth, async (req, res) => {
  try {
    // make check prior to findById call to see if id is a valid ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const article = await Article.findById(req.params.id);
      if (article) {
        const newComment = {
          articleid: article._id,
          body: req.body.body,
        };
        const comment = await Comment.create(newComment);
        return res.status(200).json({
          success: true,
          data: comment,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        msg: "The article you're trying to comment on might have been deleted",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
});

module.exports = router;
