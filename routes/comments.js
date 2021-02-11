var express     = require("express")
var router      = express.Router()
var passport    = require("passport")

var blogs       = require("../models/blogs")
var comments    = require("../models/comments")
var users       = require("../models/users")
var middleware  = require("../middleware") // ../middleware is a special path that will always require the approriate middleware code
var functions   = require("../functions")


//create
router.post("/blogs/:id/comments",middleware.isloggedin,function(req,res){

    blogs.findById(req.params.id).populate("comments").exec(function(err,blogsresults){
        if(err){
            req.flash("err","Blog was not found.")
            res.redirect("/blogs")
        }
        else{
            comments.create(req.body,function(err,commentsresult){
                if(err){
                    req.flash("err","Error Creating Posting Comment.")
                    res.redirect("/blogs")
                }
                else{
                    commentsresult.user.avatar      = req.user.avatar
                    commentsresult.user.id          = req.user._id
                    commentsresult.user.username    = req.user.username

                    commentsresult.save()
                    blogsresults.comments.push(commentsresult)
                    blogsresults.save()
                    return res.redirect("back")
                }
            })
        }


    })

})
//reply post
router.post("/blogs/:id/:commentid",middleware.isloggedin,function(req,res){
    comments.findById(req.params.commentid).exec(function(err,commentsresult){
      var commentobj = {
          text: req.body.reply,
          user:{
            username :req.user.username,
            id :req.user.id,
            avatar :req.user.avatar
          }
      }
      commentsresult.replies.push(commentobj)
      commentsresult.save()
      res.redirect("back")
      })
})

module.exports = router
