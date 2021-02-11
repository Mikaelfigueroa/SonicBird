var mongoose = require("mongoose")
var users    = require("./users");


var commentsSchema = new mongoose.Schema({
    text:   {type: String, required: true},
    user:{
            id :{type: mongoose.Schema.Types.ObjectId,ref: "users"},
            username: String,
            avatar: String
    },
    replies: [{
      text: String,
      user:{
              id :{type: mongoose.Schema.Types.ObjectId,ref: "users"},
              username: String,
              avatar: String
            }
    }]
})

module.exports = mongoose.model("comments", commentsSchema)
