const express = require('express');
const dotenv = require('dotenv');
const articles = require('./routes/api/articles'); //import articles route
const users = require('./routes/api/users'); //import users route
const ejs = require('ejs');
const cors = require('cors');
const upload = require('./middleware/upload'); // upload middleware brought in to upload file
const Article = require('./models/articleModel'); // Article model imported because template engine is used here
const fs = require('fs')
const path = require('path');



const connectDB = require('./config/db');

dotenv.config({path: './config/config.env'});

connectDB();


const app = express();



////////////////////////////////////////// Middleware ///////////////////////////////////////////

// Body Parser Middleware 
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// cors middleware
app.use(cors());



//////////////////////////////////////// END OF MIDDLEWARE ///////////////////////////////////////



// Public folder
app.use(express.static(path.join(__dirname, 'public', 'images')));


app.use('/api/v1', articles)
app.use('/api', users)


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));

