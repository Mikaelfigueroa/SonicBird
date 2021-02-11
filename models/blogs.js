var mongoose    = require("mongoose")
var comments    = require("./comments")
var users       = require("./users")

var blogSchema = new mongoose.Schema({
    tittle: {type: String},
    image:  {type: String},
    body:   {type: String},
    date:   {type: String},
    isfeatured: {type: Boolean,default: false},
    comments:[{type: mongoose.Schema.Types.ObjectId, ref: "comments"}]
})

module.exports = mongoose.model("blogs", blogSchema)
