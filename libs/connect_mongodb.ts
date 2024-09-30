import mongoose from "mongoose";

const connectMongodb = async () => {
    try {
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_CONNECTION_STRING as string);
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } catch (error) {
        console.log("There was an error connecting to MangoDB", error);
    }
};

export default connectMongodb;