const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const bcrypt = require('bcrypt');

const env = dotenv.config().parsed
const SALT_WORK_FACTOR = 10;

const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (value) {
        if (!this.isModified('email')) return;
        const user = await Auth.findOne({email: value});
        if (user) throw new Error();
      },
      message: 'This name is already taken'
    }
  },
  username: String,
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  code: String,
});

AuthSchema.methods.checkPassword = function(password){
  console.log(bcrypt.compare(password))
  return bcrypt.compare(password, this.password)
};
AuthSchema.methods.createToken = function(email){
  const token = jwt.sign({email}, env.TOKEN_SECRET, { expiresIn: '3d' })
  return this.token = `Bearer ${token}`
};

AuthSchema.methods.refreshPassword = function(password) {
  return this.password = password
}

AuthSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash
  next();
});

AuthSchema.set('toJSON', {
  transform: (doc, ret, options) =>{
    delete ret.password;
    delete ret._id;
    delete ret.__v;
    delete ret.email;
    delete ret.code;
    return ret;
  }
});

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth
