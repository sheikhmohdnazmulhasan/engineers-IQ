import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

import { TUser } from '@/types/user.type';

const userSchema = new Schema<TUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },
    username: { type: String, required: true, unique: true, trim: true },
    profileImg: { type: String, required: false },
    password: { type: String, required: true, select: false },
    isEmailVerified: { type: Boolean, required: true, default: false },
    isPremiumMember: { type: Boolean, required: true, default: false },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User', unique: true }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User', unique: true }],
    isBlocked: { type: Boolean, required: true, default: false },
    lastLogin: { type: Date, required: false },
}, {
    timestamps: true,
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, Number(process.env.NEXT_PUBLIC_BCRYPT_SALT_ROUNDS));
    }
    next();
});

// Custom method to exclude password from the response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Static method for verifying password
userSchema.methods.verifyPassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<TUser>('User', userSchema);

export default User;
