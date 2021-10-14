const Article = require('../models/articleModel')
const upload = require('../middleware/upload')
const auth = require('../middleware/auth') 



//PUBLIC
//@desc Get all articles
//@request GET
// @route /api/v1/articles
exports.getArticles = async (req, res, next)=> {
    try {
        const articles = await Article.find();

        return res.status(200).json({
            success: true,
            count: articles.length,
            articles: articles
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

//PUBLIC
//@desc Get one article
//@request GET
// @route /api/v1/article/id
exports.getOneArticle = async (req, res, next)=> {
    try {
        const article = await Article.findById(req.params.id);

        return res.status(200).json({
            success: true,
            article: article
        })
    } catch (err) {
        return res.status(404).json({
            success: false,
            error: "Not Found"
        })
    }
}



//PRIVATE
//@desc Add an article
//@request POST
// @route /api/v1/articles
exports.addArticle = (req, res, next)=> {
    try {
        upload(req, res, (err)=> {
            console.log(req.file)
            if(err){
                res.status(400).json({
                    msg: err
                })
            } else {
                //check if the file field is left empty before submitting
                if (req.file === undefined){
                    return res.status(400).json({
                        success: false,
                        msg: "Error: No file selected!"
                    })
                } else {
                    const newArticle = {
                        title: req.body.title,
                        body: req.body.body,
                        category: req.body.category,
                        image: req.file.path,
                    }
                    Article.create(newArticle)
                        .then(article => {
                            //console.log(result)
                            res.status(201).json({
                                success: true,
                                data: article
                            })
                        })
                }
            }
        });
    } catch(err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            res.status(400).json({
                success: false,
                error: messages
            })
        }else {
            return res.status(500).json({
                success: false,
                error: "Server Error"
            })
        }
    };
}


//PRIVATE
//@desc edit an article
//@request PUT
// @route /api/v1/article/id
exports.editArticle = (req, res, next)=> {
    auth(req, res, async(err) => {
        try {
            const found = await Article.findById(req.params.id);
    
            const update = {
                title: req.body.title ? req.body.title : found.title,
                body: req.body.body ? req.body.body : found.body,
                category: req.body.category ? req.body.category : found.category
            }
    
            if(!found){
                return res.status(404).json({
                    success: false,
                    error: "No Article found!"
                })
            } else {
                await Article.updateOne(found, update)
                return res.status(201).json({
                    success: true,
                    msg: "Article updated!",
                    data: found
                })
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: "Server Error"
            })
        }
    })
}


// PRIVATE
//@desc Delete an article
//@request DELETE
// @route /api/v1/article/:id
exports.deleteArticle = (req, res, next) => {
    auth(req, res, async(err)=> {
        try {
            const found = await Article.findById(req.params.id); 
    
            if(!found){
                return res.status(404).json({
                    success: false,
                    error: "Can't delete something that doesn't exist!"
                })
            } else {
                await Article.deleteOne(found)
                return res.status(200).json({
                    success: true,
                    msg: "Article deleted!",
                    data: found
                })
            }
    
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: "Server Error"
            })
        }
    })
}


//PUBLIC
//@desc Get articles by category
//@request GET
// @route /api/v1/articles/category/:catname
exports.getArticlesByCategory = async(req, res, next) => {
    try {
        const articles = await Article.find({category: req.params.catname})

        return res.status(200).json({
            success: true,
            count: articles.length,
            articles: articles
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: "Not Found!!!"
        })
    }
}



//PUBLIC
//@desc Get articles by Search
//@request GET
// @route /api/v1/search/articles/:searchword
exports.getArticlesBySearch = async(req, res, next)=> {
    try{
        const articles = await Article.find({$text: {title: req.params.searchword, body: req.params.searchword}});

        if(articles){
            return res.status(200).json({
                success: true,
                count: articles.length,
                articles: articles
            })
        } else{
            return res.status(404).json({
                success: false,
                msg: "No result found"
            })
        }
    }catch (err){
        return res.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}