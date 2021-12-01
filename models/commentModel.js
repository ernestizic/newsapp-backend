const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    articleid: {
        required: true,
        type: String,
    },
    body: {
        type: String,
        trim: true,
        required: true,
    },
    commentBy: mongoose.Schema.Types.ObjectId
})


module.exports = mongoose.model("Comment", CommentSchema);