
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUser } from '@/interface/users.interface';

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, required: true, default: false },
    isPremiumMember: { type: Boolean, required: true, default: false },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 20)
    next()
})

const User = mongoose.model<IUser>('User', userSchema);

export default User;
