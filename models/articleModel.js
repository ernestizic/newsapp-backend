const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
  },
  category: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
});
ArticleSchema.index({ title: "text", body: "text" });

module.exports = mongoose.model("Article", ArticleSchema);
