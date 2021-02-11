require("dotenv").config()

var express     = require("express")
var router      = express.Router()
var passport    = require("passport")

var blogs       = require("../models/blogs")
var comments    = require("../models/comments")
var users       = require("../models/users")

var middleware  = require("../middleware")
var functions   = require("../functions")


var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDKEY,
  api_secret: process.env.CLOUDSECRET
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}





// router.get("/reset",function(req,res) {
//   blogs.deleteMany({},function(err,result) {
//     console.log(result)
//     res.redirect("back")
//   })
// })

// router.get("/delete/:id",function(req,res){
//   blogs.findByIdAndDelete(req.params.id,function(err,result) {
//     console.log(result)
//     res.redirect("back")
//   })
// })


// router.post("/blogs",upload.single("image"),function(req,res) {
//   cloudinary.uploader.upload(req.file.path, function(result) {
//     var blog1 = req.body.blog
//     blog1.image =  result.secure_url

//     console.log(blog1)
    
//     blogs.create(blog1, function(err,result){
//       if(err){
//         console.log(err)
//       }
//       res.redirect("back")
//     })
//   })
// })

// router.get("/blogs/new",upload.single("image"),function(req,res) {
//   res.render("new")
// })




// Index
router.get("/blogs", function(req,res){
  var match = true
  var perPage = 8
  var pageQuery = parseInt(req.query.page)
  var pageNumber = pageQuery ? pageQuery : 1
  var sideblogs = null
  var featured = null
  var found = null
      if(req.query.search){
          const regex = new RegExp(escapeRegex(req.query.search), 'gi')
          blogs.find({$or:[{tittle: regex},{body: regex}]}, function(err, result){
            console.log(result)
           if(err){
               req.flash("error",err)
               return res.redirect("/blogs")
           }
           else {
                if(result.length < 1) {
                  req.flash("error","No blogs match that search")
                  return res.redirect("/blogs")
                }
                else{
                  blogs.find({},function(inerr,sideblog){
                    
                    return res.render("index",{blog:result, match:match, sideblogs:functions.sideblog(sideblog)})
                  })
                }
           }
         })
      }
      else{
        blogs.find({},function(err,result){
          console.log(result)
          return res.render("index",{pagename:"Blogs",blog:result,sideblogs:functions.sideblog(result)})
        })
      }
})


// Show
router.get("/blogs/:id",function(req, res){
    blogs.findById(req.params.id).populate("comments").exec(function(err,result){
      console.log(result)
        if(err){
          req.flash("error",err)
          res.redirect("/blogs")
        }

        blogs.find({},function(inerr,inresult){
          res.render("show",{pagename:"Info", blogs:result,sideblogs: functions.sideblog(inresult)})
        })
    })
})

router.get("/postall",function(req, res){
  blogs.find({},function(err,result){
    console.log(result)
    console.log("hit")
  })
})

//----------------------------------has to be admin//

module.exports = router
