import "dotenv/config";
import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/db.js"
import dotenv from "dotenv"
import userRouter from "./routes/users.js"
import postRouter from "./routes/post.js"

const PORT = process.env.PORT || 3000
const app = express()



app.get("/",(req,res)=>{
    res.status(200).send("Home Page")
})

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}))
app.use("/api",userRouter)
app.use("/api",postRouter)
 
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));
 

app.listen(PORT,()=>{
    connectDB()
    console.log("server connected at port = ",{PORT})
})