//this file allows me to create a middleware object to call in all my different routes so i can keep them orginized in here instead of re writting them on each route file
var blogs       = require("../models/blogs")
var comments    = require("../models/comments")

var middleware = {}

middleware.checkblogownership = function(req,res,next){
    if(req.isAuthenticated()){
        blogs.findById(req.params.id, function(err,results){
            if(err || !results){
                req.flash("error","Blog not found.")
                res.redirect("back")
            }
            else{
                if(results.user.id.equals(req.user._id) || req.user.isAdmin){ //here i am using a mongoose function that allows me to compare a data points id with the data point send in the parameter
                    next()
                }
                else{
                    req.flash("error","Permision not allowed")
                    res.redirect("back")
                }
            }
        })
    }
    else{
        req.flash("error","You need to be logged in to do that")
        res.redirect("/login")
    }
}
middleware.checkcommentownership = function(req,res,next){
    if(req.isAuthenticated()){
        comments.findById(req.params.review_id,function(err,results){
            if(err || !results){
                console.log(err)
            }
            else{
                if(results.user.id.equals(req.user._id) || req.user.isAdmin){ //here i am using a mongoose function that allows me to compare a data points id with the data point send in the parameter
                    next()
                }
                else{
                    res.redirect("back")
                }
            }
        })
    }
    else{
        req.flash("error","you need to be logged in to do that ")
        res.redirect("/login")
    }
}


middleware.isloggedin = function (req,res,next){
    if(req.isAuthenticated()){
        return next()
    }

    req.flash("error","you need to be logged in to do that.")
    res.redirect("/login")
}


module.exports = middleware
