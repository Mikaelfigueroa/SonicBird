var express     = require("express")
var router      = express.Router()
var passport    = require("passport")

var middleware  = require("../middleware")
var users       = require("../models/users")
var functions   = require("../functions")

var async       = require("async")
var ejs         = require("ejs")



router.get("/",function(req,res){
    res.redirect("/blogs")
})

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


//-----------------------------register logic------------------------------------------//
router.get("/register",function(req, res){
    res.render("register",{pagename: "Register"})
})



router.post("/register",upload.single('image'),function(req, res){
    var newuser = new users({
        username:   req.body.username,
        email:      req.body.email,
    })
    if(req.file){
      cloudinary.uploader.upload(req.file.path, function(result) {
        newuser.avatar = result.secure_url
        users.register(newuser, req.body.password,function(err,user){ //users.register() comes from the passport-local-mongoose package which is required in the users data models and
          if(err){
            req.flash("err", err)                                     //makes it so that instead of saving the raw password for the user it creates a hash to be deciphered by a key
            return res.redirect("/register")
          }
          req.flash("success","Thank you for joining!")
          passport.authenticate("local")(req,res,function(){
              return res.redirect("/blogs")
          })
        })
      })
    }
    else{
      users.register(newuser, req.body.password,function(err,user){ //users.register() comes from the passport-local-mongoose package which is required in the users data models and
          if(err){    
            console.log(err)

            //makes it so that instead of saving the raw password for the user it creates a hash to be deciphered by a key
            req.flash("error",functions.errCheck(err))
            return res.redirect("/register")
          }
          req.flash("success","Thank you for joining!")
          passport.authenticate("local")(req,res,function(){
            return res.redirect("/blogs")
          })
      })
    }
})

//-------------------------------login logic--------------------------------------------//
router.get("/login",function(req, res){
    res.render("login", {pagename: "Login"})
})



router.post("/login",passport.authenticate("local",{
    successRedirect: "/blogs",
    failureRedirect: "/login",
    failureFlash: true
    }),function(req, res){
})

//--------------------------------logout-------------------------------------------------//
router.get("/logout",function(req, res){
    req.logout()
    res.redirect("/")
})

//-----------------------------------------------------------------------------------------------------------//


router.get("/avataredit",middleware.isloggedin,function(req,res){
  users.findById(req.user.id,function(err,userresult){
    res.render("avataredit",{user: userresult})
  })
})


router.put("/avataredit",middleware.isloggedin,upload.single('image'),function(req, res){
  if(req.file){
    cloudinary.uploader.upload(req.file.path, function(result) {
      users.findById(req.user._id,function(err,userresult){
        userresult.avatar = result.secure_url
        userresult.save()
        res.redirect("back")
      })
    })
  }
  else{
    req.flash("error","you must input a image")
    res.redirect("back")
  }
})


router.get("/profile",middleware.isloggedin,function(req,res){
  posts.find({user: req.user._id}).populate("user").exec(function(err,result){
    if(err){
      req.flash("err",err)
      res.redirect("back")
    }
    else{
      res.render("profile",{posts: result})
    }
  })
})


router.get("*" ,(req,res)=>{
    res.render("err")
})

module.exports = router
