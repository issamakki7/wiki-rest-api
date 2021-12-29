const express = require('express')

const mongoose = require('mongoose');
const req = require('express/lib/request');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser:true});

const articleSchema = mongoose.Schema({
    title:String,
    content:String
})

const Article = mongoose.model("Article",articleSchema);


app.route('/articles')

.get(function(req,res){
    Article.find(function(err,foundArticles){ //We did not put a condition on what to find
        if(err){                            // because we want to find everything
            res.send(err);
        }
        else{
            res.send(foundArticles);
        }
    })
})

.post(function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    //Inside the save method, we can add a callback function that
    //will trigger if there were any errors
    newArticle.save(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("Successfully added a new article");
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send('Successfully deleted all articles');
        }
    })
})

//////Requests Targeting a Specific Article/////////////////////////////

app.route('/articles/:articleTitle')

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No articles matching that article was found");
        }
    })
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title,content: req.body.content},
        function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully updated article");
            }
        }
    )
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully updated article");
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send('Successfully deleted article')
            }
        }
    )
});


app.listen(3000,function(){
    console.log('Server is running on port 3000');
})

