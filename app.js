require("dotenv").config()
var express             = require("express")            //connects express to node.js
var app                 = express()                     //creates the app object which is everything
var bodyparser          = require("body-parser")        //connects body parser which vars us get data from html forms
var mongoose            = require("mongoose")           //connects mongoose
var flash               = require("connect-flash")      //connects flash for err messages
var passport            = require("passport")
var localstrategy       = require("passport-local")
var methodOverride      = require("method-override")    //allows us to do put, devare and other request properly to the correct corresponding routes
var expressSanitizer    = require("express-sanitizer")  //filters out scripts from html forms

var functions           = require("./functions")
var blogs               = require("./models/blogs")
var comments            = require("./models/comments")
var users               = require("./models/users")

/*-----------------requiring routes------------------------------------------------------------------------------------------------------------*/
var indexRoutes         = require("./routes/index")
var blogsRoutes         = require("./routes/blogs")
var commentsRoutes      = require("./routes/comments")


/*-------------just in case gridfs----*/


/*---------------------db----------------------------------------------------------------------------------------------------------------------*/

var url = process.env.DBURL;
mongoose.connect(url);

//-------------------------etx-------------------------------------------------//

app.set("view engine","ejs")
app.use(bodyparser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(express.static("public"))
app.use(methodOverride("_method"))
app.use(bodyparser.json())
//--------------------------passport--------------------------//
app.use(require("express-session")({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


passport.use(new localstrategy(users.authenticate()))
passport.serializeUser(users.serializeUser())
passport.deserializeUser(users.deserializeUser())

//---------------------------locals----------------------------------------------//
app.use(flash());                               //sets flash as middleware
app.use(function(req,res,next){

  res.locals.currentUser  = req.user
  res.locals.pagename     = "SonicBird"
  res.locals.success      = req.flash('success');
  res.locals.error        = req.flash('error');
  next()
})
//--------------------------route re call----------------------------------------//



app.use(blogsRoutes)
app.use(commentsRoutes)
app.use(indexRoutes)

app.listen(process.env.PORT || 5000, () => {
  console.log('----------------server is running-----------')
  console.log('|||||||||||||||||||||||||||||||||||||||||||||||')
})
