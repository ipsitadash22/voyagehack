import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import usersRoute from"./routes/users.js"
import hotelsRoute from"./routes/hotels.js"
import roomsRoute from"./routes/rooms.js"
import cookieParser from "cookie-parser";
const app=express()
dotenv.config()
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO || "");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
mongoose.connection.on("disconnected",()=>{
 console.log("mongoDB disconected ");
})
mongoose.connection.on("connected",()=>{
    console.log("mongoDB Conected ");
})

app.use(cookieParser())
//extra middleware to post items and give api request
app.use(express.json());


//middlewares
app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus=err.status||500
    const errorMessage=err.message||"Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
    });

});

app.listen(8800,()=>{
    connect();
    console.log("Connected to backend");
});