
const express= require("express");
const cors= require("cors");
const dotenv= require("dotenv");
const connectDB=require("./config/db");
const userRoutes= require("./routes/authRoutes");
dotenv.config();
connectDB();

const app =express();
app.use(cors());
 
app.get("/",(req,res)=>{
    res.send("Shpnest working properly");
});

app.use("/api/auth",userRoutes);

const PORT= process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`server is running on port${PORT}`);
    
});
