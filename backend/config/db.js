import mongoose from "mongoose";

const connectDb = async() =>{
    try{
         await mongoose.connect(process.env.MONGODB_URL);
         console.log("MONGODB CONNECTED");
    }catch{
         console.log("MONGODB CONNECTED Error");
    }

    }

export default connectDb;