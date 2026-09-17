const mongoose = require('mongoose');

const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [emailRegex, 'Invalid email'] },
    password: { type: String, required: true },
    refreshTokens: [{ type: String }]
}, { timestamps: true });

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
