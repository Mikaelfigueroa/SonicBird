var mongoose                = require("mongoose")
var passportLocalMongoose   = require("passport-local-mongoose")
var validators              = require('validator')
var functions               = require("../functions")


var userSchema = new mongoose.Schema({
    username:   {type:String, unique: true,lowercase:true},
    email:      {type:String, required:true, unique:true, lowercase:true, validate:[(val)=>{return validators.isEmail(val)},"Please provide a accurate email."]},
    password:   String,
    avatar:     {type: String, default: "https://res.cloudinary.com/dbjw5nvs2/image/upload/v1588030256/blank-profile-picture-973460_640_kb8bgf.png"}
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("users", userSchema)
