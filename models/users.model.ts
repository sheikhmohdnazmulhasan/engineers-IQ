import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUser } from '@/interface/users.interface';

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    profileImg: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },  // Exclude password by default
    isEmailVerified: { type: Boolean, required: true, default: false },
    isPremiumMember: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Array of User IDs for followers
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Array of User IDs for following
}, {
    timestamps: true,
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT_ROUNDS));
    }
    next();
});

// Method to populate followers and following fields when getting user data
userSchema.methods.populateFollowersAndFollowing = async function () {
    return await this.populate('followers following').execPopulate();
};

// Custom query to exclude password
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password
    return user;
}

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
