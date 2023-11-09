const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

// Password hash middleware.

UserSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

// Helper method for validating user's password.ss
UserSchema.methods.comparePassword = async function comparePassword(
  candidatePassword,
  cb
) {
  console.log(candidatePassword, this.password)
  const match = await bcrypt.compare(candidatePassword, this.password)
  try {
    if (match) {
      return true
    } else return false
  } catch (err) {
    throw Error('Error compare hashes')
  }
}

module.exports = mongoose.model('User', UserSchema)
