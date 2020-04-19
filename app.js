var express=require("express"),
method=require("method-override"),
expressSanitier=require("express-sanitizer"),
app=express(),
bodyParser=require("body-parser"),
mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/27017",({useNewUrlParser:true , useUnifiedTopology:true, useFindAndModify:false}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitier());
app.use(method("_method"));

var blogSchema=mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}

});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image: "https://as2.ftcdn.net/jpg/02/96/35/63/500_F_296356355_0YlFGZllBt6G7J7MbQUK9XTJTmU351ev.jpg",
//     body: "Hello this is blog post" 

// });
app.get("/",function(req,res){
    console.log("root redirct route called");
    res.redirect("/blogs");

});



app.get("/blogs",function(req,res){
   

    
    Blog.find({},function(err,blogs){
        if(err)
        {
            console.log("get index route called");
            console.log(err);
            res.render("new");
        }
        else{
           
            res.render("index",{blogs:blogs});
        }
    });

   

});

app.post("/blogs",function(req,res){

    //save data

    req.body.blog.body=req.sanitize(req.body.blog.body);
   

    Blog.create(req.body.blog,function(err,blog)
    {
        if(err)
        {
            console.log("post save route called");
    
            console.log(err);
        }
        else{
            
            res.redirect("blogs");
        }
    });
    
});

app.get("/blogs/new",function(req,res){
    console.log("get new route called");
    res.render("new");
});

app.get("/blogs/:id/edit",function(req,res){
   
    Blog.findById(req.params.id,function(err,foundblog){
        if(err)
        {
            console.log("get edit route called");
            res.redirect("/blogs");
        }
        else{

            res.render("edit",{blog:foundblog});
        }
    });
    


});

app.get("/blogs/:id",function(req,res){
   
    Blog.findById(req.params.id,function(err,foundblog){
        if(err)
        {
            console.log("get show route called");
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundblog});
        }

    });
});

//update

app.put("/blogs/:id",function(req,res){

   console.log("put route called");
   req.body.blog.body=req.sanitisze(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
       if(err){
           console.log(err);
           req.redirect("/blogs");
       }else{
           res.redirect("/blogs/"+req.params.id);
        
       }
       
   });

});

//delete

app.delete("/blogs/:id",function(req,res){

    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }

    });


});

app.listen(3000,function(){
    console.log("blog app started");

});