import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    cartData: {
        type: Object,
        default: {}
    }
}, { timestamps: true, minimize: false });

const User = mongoose.model('User', UserSchema);
export default User;

