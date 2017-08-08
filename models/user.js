var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  firstname: String,
  lastname: String,
  admin: Boolean,
},{
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
