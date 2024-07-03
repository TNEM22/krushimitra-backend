const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    required: [true, 'A user must be a farmer or expert'],
    enum: {
      values: ['farmer', 'expert'],
      message: 'User is either: farmer or expert',
    },
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  exp: {
    type: Number,
  },
  hourlyRate: {
    type: Number,
  },
  status: {
    type: String,
    default: 'Offline',
  },
  photo: {
    type: String,
    default: '/placeholder.svg',
  },
});

userSchema.pre('validate', function (next) {
  if (this.role === 'expert' && (this.exp === null || this.exp === undefined)) {
    this.invalidate('exp', 'Experience is required for experts');
    this.invalidate('hourlyRate', 'Hourly Rate is required for experts');
  }
  next();
});

// Pre-save middleware to remove `exp` if role is not 'expert'
userSchema.pre('save', function (next) {
  if (this.role !== 'expert') {
    this.exp = undefined;
    this.hourlyRate = undefined;
    this.status = undefined;
    this.photo = undefined;
  }
  next();
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 10);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to currrent query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    // console.log(JWTTimestamp * 1000, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  //                                     min  sec  millis
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
