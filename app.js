const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus quam, eum aperiam fuga accusantium .";
const aboutContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus quam, eum aperiam fuga accusantium .";
const contactContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus quam, eum aperiam fuga accusantium .";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts=[];
const CONNECTION_URL=""//mongodb connection link
mongoose.connect(CONNECTION_URL, function(){
    console.log("Connected to MongoDB");
});

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);



app.get("/", function (req, res) {
    res.render("home",{
      startingContent: homeStartingContent,
      posts: posts
    
    });
});

app.get("/about", function(req, res){
    res.render("about",{aboutContent});
});

app.get("/contact", function(req, res){
    res.render("contact",{contactContent});
})

app.get("/compose", function(req, res){
    res.render("compose");
});
app.post("/compose", function(req, res){
    // console.log(title);
    // console.log(body);

    const post = {
        title: req.body.postTitle,
        content: req.body.postBody
    };

    post.save()
    .then(item => {
    res.send("item saved to database");
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });

    res.redirect("/");                                                                                                       
});

app.get("/posts/:postName", function(req, res){
    // console.log(req.params.postName);
    const requestedTitle=_.lowerCase(req.params.postName);

    posts.forEach(function(post){
        const storedTitle = _.lowerCase(post.title);

        if(storedTitle==requestedTitle){
            // console.log("Matched");
            res.render("post", {
                title: post.title,
                content: post.content
            });
        }
        // else{
        //     console.log("No match");
        // }
    })
});

app.listen(3000, function (req, res) {
    console.log("This server is working on port 3000");
});