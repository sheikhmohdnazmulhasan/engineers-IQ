
import mongoose, { Schema } from "mongoose";


const paych = new Schema({
    name: String
}, {
    timestamps: true
});

const Pay = mongoose.models.Pay || mongoose.model('Pay', paych);

export default Pay;
